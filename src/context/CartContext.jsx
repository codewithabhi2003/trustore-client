import { createContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

const keyFor = (userId) => `trustore-cart-${userId || 'guest'}`;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const activeKey = useRef(keyFor(user?.id));

  // Switches to the right cart (per logged-in user, or a shared "guest" cart when
  // nobody's logged in) whenever who's logged in changes — login, logout, or switching
  // accounts on the same browser no longer leaks one user's cart into another's.
  useEffect(() => {
    const key = keyFor(user?.id);
    activeKey.current = key;
    try {
      setItems(JSON.parse(localStorage.getItem(key)) || []);
    } catch {
      setItems([]);
    }
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(activeKey.current, JSON.stringify(items));
  }, [items]);

  const addItem = (product, storeId, storeName, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images?.[0],
          price: product.price,
          unit: product.unit,
          quantity,
          storeId,
          storeName,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const removeItem = (productId) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const storeGroups = items.reduce((groups, item) => {
    if (!groups[item.storeId]) groups[item.storeId] = { storeName: item.storeName, items: [] };
    groups[item.storeId].items.push(item);
    return groups;
  }, {});

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount, storeGroups }}
    >
      {children}
    </CartContext.Provider>
  );
}