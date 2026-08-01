import { createContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext(null);

const keyFor = (userId) => `trustore-wishlist-${userId || 'guest'}`;

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const activeKey = useRef(keyFor(user?.id));

  // Same per-user scoping as CartContext — switches to the right wishlist whenever
  // who's logged in changes, so one user's saved items never leak into another's.
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

  const isWishlisted = (productId) => items.some((i) => i.productId === productId);

  const toggleWishlist = (product, storeId, storeName) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product._id)) {
        return prev.filter((i) => i.productId !== product._id);
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images?.[0],
          price: product.price,
          unit: product.unit,
          storeId,
          storeName,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}