// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string;      // ex: "12.90", "12,90 €" -> sera parsé côté calcul
  origin: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;                     // 💡 nouveau : total € du panier
  getItemQuantity: (id: string) => number; // 💡 nouveau : quantité d’un article
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'qvtbox_cart_v1';
const isBrowser = typeof window !== 'undefined';

// Parse des prix robustes (gère "12,90 €", espaces, etc.)
const parsePrice = (raw: string): number => {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (!isBrowser) return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persistance locale
  React.useEffect(() => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // silencieux si stockage indisponible
    }
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existing = current.find(i => i.id === newItem.id);
      if (existing) {
        return current.map(i =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(0, Math.min(99, Math.floor(quantity))); // clamp 0..99
    if (q <= 0) {
      setItems(current => current.filter(item => item.id !== id));
      return;
    }
    setItems(current =>
      current.map(item => (item.id === id ? { ...item, quantity: q } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [items]
  );

  const getItemQuantity = useCallback(
    (id: string) => items.find(i => i.id === id)?.quantity ?? 0,
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    getItemQuantity,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
