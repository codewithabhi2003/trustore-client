import { createContext, useEffect, useState } from 'react';

export const WishlistContext = createContext(null);

const STORAGE_KEY = 'trustore-wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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