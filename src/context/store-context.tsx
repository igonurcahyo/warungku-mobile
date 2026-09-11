import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { DUMMY_PRODUCTS, Product } from '@/constants/pos-data';
import {
  Transaction,
  TransactionItem,
  PaymentMethod,
  PaymentStatus,
  DUMMY_TRANSACTIONS,
} from '@/constants/transaction-data';
import { AuthUser, AuthStore, getMeApi, logoutApi } from '@/api/auth';
import { getAuthToken } from '@/api/client';

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

interface CreateTransactionParams {
  items: TransactionItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
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
  // Transactions
  transactions: Transaction[];
  createTransaction: (params: CreateTransactionParams) => Transaction;
  markTransactionPaid: (transactionId: string) => void;
  cancelTransaction: (transactionId: string) => void;
  // Auth state
  user: AuthUser | null;
  store: AuthStore | null;
  isAuthenticated: boolean;
  loginUser: (user: AuthUser, store: AuthStore | null) => void;
  logoutUser: () => Promise<void>;
  checkAuthSession: () => Promise<boolean>;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  name: 'WarungKu',
  owner: 'Pemilik Warung',
  email: 'owner@example.com',
  version: '1.0.0',
  appTitle: 'WarungKu',
  appSubtitle: 'POS & Inventory',
};

function formatIndonesianDateDisplay(d: Date): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year} • ${hours}:${minutes}`;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS);
  const [stockNotificationEnabled, setStockNotificationEnabled] = useState(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(DEFAULT_STORE_INFO);
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  // Mobile Auth State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [store, setStore] = useState<AuthStore | null>(null);

  const loginUser = (loggedInUser: AuthUser, loggedInStore: AuthStore | null) => {
    setUser(loggedInUser);
    setStore(loggedInStore);
    setStoreInfo((prev) => ({
      ...prev,
      name: loggedInStore?.name || prev.name,
      owner: loggedInUser.name || prev.owner,
      email: loggedInUser.email || prev.email,
    }));
  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    setUser(null);
    setStore(null);
    setStoreInfo(DEFAULT_STORE_INFO);
  };

  const checkAuthSession = async (): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const res = await getMeApi(token);
      if (res.success && res.user) {
        loginUser(res.user, res.store ?? null);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  useEffect(() => {
    checkAuthSession();
  }, []);

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

  // Internal helper to generate sequential ID
  const generateNextTransactionId = (curr: Transaction[]): string => {
    let maxNum = 125;
    curr.forEach((t) => {
      const match = t.id.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `TRX-${(maxNum + 1).toString().padStart(5, '0')}`;
  };

  // Create new transaction (Cash or QRIS pending)
  const createTransaction = (params: CreateTransactionParams): Transaction => {
    const nextId = generateNextTransactionId(transactions);
    const now = new Date();
    const isPaid = params.paymentStatus === 'Lunas';

    const newTrx: Transaction = {
      id: nextId,
      dateISO: now.toISOString(),
      dateDisplay: formatIndonesianDateDisplay(now),
      items: params.items,
      total: params.total,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus,
      paidAt: isPaid ? now.toISOString() : undefined,
    };

    // If payment is completed immediately (Tunai), deduct stock ONCE
    if (isPaid) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const item = params.items.find(
            (it) => it.productName.toLowerCase() === p.name.toLowerCase()
          );
          if (item) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity) };
          }
          return p;
        })
      );
    }

    setTransactions((prev) => [newTrx, ...prev]);
    return newTrx;
  };

  // Mark an existing pending transaction as paid (QRIS success or resume paid)
  // PREVENTS DUPLICATE STOCK DEDUCTION via paidAt flag and status check
  const markTransactionPaid = (transactionId: string) => {
    setTransactions((prevTrx) => {
      const target = prevTrx.find((t) => t.id === transactionId);

      // If already paid or doesn't exist, do nothing
      if (!target || target.paymentStatus === 'Lunas' || target.paidAt) {
        return prevTrx;
      }

      // Deduct stock for items once
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const item = target.items.find(
            (it) => it.productName.toLowerCase() === p.name.toLowerCase()
          );
          if (item) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity) };
          }
          return p;
        })
      );

      // Return updated transactions
      return prevTrx.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              paymentStatus: 'Lunas' as PaymentStatus,
              paidAt: new Date().toISOString(),
            }
          : t
      );
    });
  };

  // Cancel an existing pending transaction explicitly
  const cancelTransaction = (transactionId: string) => {
    setTransactions((prevTrx) =>
      prevTrx.map((t) =>
        t.id === transactionId && t.paymentStatus === 'Menunggu Pembayaran'
          ? { ...t, paymentStatus: 'Dibatalkan' as PaymentStatus }
          : t
      )
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
        transactions,
        createTransaction,
        markTransactionPaid,
        cancelTransaction,
        user,
        store,
        isAuthenticated: !!user,
        loginUser,
        logoutUser,
        checkAuthSession,
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
