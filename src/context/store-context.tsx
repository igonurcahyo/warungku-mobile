import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { DUMMY_PRODUCTS, Product } from '@/constants/pos-data';

export interface StockNotification {
  id: string;
  productId: string;
  productName: string;
  type: 'out' | 'low';
  title: 'Stok Habis' | 'Stok Menipis';
  message: string;
  time: string;
  stock: number;
}

export interface StoreInfo {
  name: string;
  owner: string;
  email: string;
  version: string;
  appTitle: string;
  appSubtitle: string;
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  incrementStock: (productId: string) => void;
  decrementStock: (productId: string) => void;
  saveStock: (productId: string, newStock: number) => void;
  stockNotificationEnabled: boolean;
  setStockNotificationEnabled: (enabled: boolean) => void;
  storeInfo: StoreInfo;
  notifications: StockNotification[];
  unreadCount: number;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  name: 'WarungKu',
  owner: 'Pemilik Warung',
  email: 'owner@example.com',
  version: '1.0.0',
  appTitle: 'WarungKu',
  appSubtitle: 'POS & Inventory',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [stockNotificationEnabled, setStockNotificationEnabled] = useState(true);
  const [storeInfo] = useState<StoreInfo>(DEFAULT_STORE_INFO);

  // Quick increment stock (+1)
  const incrementStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + 1 } : p))
    );
  };

  // Quick decrement stock (-1, clamped to min 0)
  const decrementStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
      )
    );
  };

  // Save specific stock value
  const saveStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  // Compute notifications based on products and toggle state
  const notifications: StockNotification[] = useMemo(() => {
    if (!stockNotificationEnabled) {
      return [];
    }

    const list: StockNotification[] = [];

    products.forEach((p) => {
      if (p.stock === 0) {
        list.push({
          id: `notif-out-${p.id}`,
          productId: p.id,
          productName: p.name,
          type: 'out',
          title: 'Stok Habis',
          message: `${p.name} sudah habis`,
          time: 'Sekarang',
          stock: p.stock,
        });
      } else if (p.stock > 0 && p.stock <= 5) {
        list.push({
          id: `notif-low-${p.id}`,
          productId: p.id,
          productName: p.name,
          type: 'low',
          title: 'Stok Menipis',
          message: `${p.name} tersisa ${p.stock}`,
          time: '5 menit lalu',
          stock: p.stock,
        });
      }
    });

    // Sort: Out of stock first, then low stock
    return list.sort((a, b) => (a.type === 'out' ? -1 : 1));
  }, [products, stockNotificationEnabled]);

  const unreadCount = notifications.length;

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        incrementStock,
        decrementStock,
        saveStock,
        stockNotificationEnabled,
        setStockNotificationEnabled,
        storeInfo,
        notifications,
        unreadCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
