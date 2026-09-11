import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import { Product } from '@/constants/pos-data';
import {
  Transaction,
  TransactionItem,
  PaymentMethod,
  PaymentStatus,
  DUMMY_TRANSACTIONS,
} from '@/constants/transaction-data';
import { AuthUser, AuthStore, getMeApi, logoutApi } from '@/api/auth';
import { getAuthToken } from '@/api/client';
import {
  CategoryItem,
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '@/api/categories';
import {
  BackendProduct,
  ProductPayload,
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '@/api/products';
import {
  BackendStockItem,
  getStockApi,
  updateStockApi,
} from '@/api/stock';

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

function mapBackendProduct(bp: BackendProduct): Product {
  return {
    id: String(bp.id),
    name: bp.name,
    price: bp.sellingPrice ?? bp.price,
    category: bp.categoryName || 'Lainnya',
    stock: bp.stock,
    categoryId: bp.categoryId,
    categoryName: bp.categoryName || 'Lainnya',
    unit: bp.unit || 'Pcs',
  };
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: CategoryItem[];
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingStock: boolean;
  productsError: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchStock: () => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<{ success: boolean; data?: Product; error?: string }>;
  updateProduct: (
    id: string | number,
    payload: ProductPayload
  ) => Promise<{ success: boolean; data?: Product; error?: string }>;
  deleteProduct: (id: string | number) => Promise<{ success: boolean; error?: string }>;
  addCategory: (name: string) => Promise<{ success: boolean; data?: CategoryItem; error?: string }>;
  updateCategory: (
    id: number,
    name: string
  ) => Promise<{ success: boolean; data?: CategoryItem; error?: string }>;
  deleteCategory: (id: number) => Promise<{ success: boolean; error?: string }>;
  updateStock: (
    productId: string | number,
    newStock: number,
    note?: string
  ) => Promise<{ success: boolean; data?: BackendStockItem; error?: string }>;
  incrementStock: (productId: string) => Promise<{ success: boolean; error?: string }>;
  decrementStock: (productId: string) => Promise<{ success: boolean; error?: string }>;
  saveStock: (
    productId: string,
    newStock: number
  ) => Promise<{ success: boolean; error?: string }>;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [stockNotificationEnabled, setStockNotificationEnabled] = useState(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(DEFAULT_STORE_INFO);
  const [transactions, setTransactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  // Mobile Auth State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [store, setStore] = useState<AuthStore | null>(null);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const res = await getProductsApi();
      if (res.success && res.data) {
        setProducts(res.data.map(mapBackendProduct));
      } else {
        setProductsError(res.error || 'Gagal memuat produk dari server.');
      }
    } catch (err: any) {
      setProductsError(err?.message || 'Gagal memuat produk.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<void> => {
    setIsLoadingCategories(true);
    try {
      const res = await getCategoriesApi();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchStock = useCallback(async (): Promise<void> => {
    setIsLoadingStock(true);
    try {
      const res = await getStockApi();
      if (res.success && res.data) {
        setProducts((prev) => {
          if (prev.length === 0) {
            return res.data!.map((item) => ({
              id: String(item.id),
              name: item.name,
              price: item.sellingPrice ?? item.price ?? 0,
              category: item.categoryName || 'Lainnya',
              stock: item.stock,
              categoryId: item.categoryId,
              categoryName: item.categoryName || 'Lainnya',
              unit: item.unit || 'Pcs',
            }));
          }
          const stockMap = new Map(res.data!.map((s) => [String(s.id), s]));
          return prev.map((p) => {
            const fresh = stockMap.get(p.id);
            if (fresh) {
              return {
                ...p,
                stock: fresh.stock,
                unit: fresh.unit || p.unit,
                category: fresh.categoryName || p.category,
                categoryName: fresh.categoryName || p.categoryName,
              };
            }
            return p;
          });
        });
      }
    } catch (err) {
      console.error('fetchStock error:', err);
    } finally {
      setIsLoadingStock(false);
    }
  }, []);

  const addProduct = async (
    payload: ProductPayload
  ): Promise<{ success: boolean; data?: Product; error?: string }> => {
    const res = await createProductApi(payload);
    if (res.success && res.data) {
      const newProd = mapBackendProduct(res.data);
      setProducts((prev) => [newProd, ...prev]);
      fetchCategories();
      return { success: true, data: newProd };
    }
    return { success: false, error: res.error || 'Gagal menambahkan produk' };
  };

  const updateProduct = async (
    id: string | number,
    payload: ProductPayload
  ): Promise<{ success: boolean; data?: Product; error?: string }> => {
    const res = await updateProductApi(id, payload);
    if (res.success && res.data) {
      const updated = mapBackendProduct(res.data);
      setProducts((prev) => prev.map((p) => (p.id === String(id) ? updated : p)));
      fetchCategories();
      return { success: true, data: updated };
    }
    return { success: false, error: res.error || 'Gagal memperbarui produk' };
  };

  const deleteProduct = async (
    id: string | number
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await deleteProductApi(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== String(id)));
      fetchCategories();
      return { success: true };
    }
    return { success: false, error: res.error || 'Gagal menghapus produk' };
  };

  const addCategory = async (
    name: string
  ): Promise<{ success: boolean; data?: CategoryItem; error?: string }> => {
    const res = await createCategoryApi({ name });
    if (res.success && res.data) {
      setCategories((prev) =>
        [...prev, res.data!].sort((a, b) => a.name.localeCompare(b.name))
      );
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error || 'Gagal menambahkan kategori' };
  };

  const updateCategory = async (
    id: number,
    name: string
  ): Promise<{ success: boolean; data?: CategoryItem; error?: string }> => {
    const res = await updateCategoryApi(id, { name });
    if (res.success && res.data) {
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, name: res.data!.name } : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      fetchProducts();
      return { success: true, data: res.data };
    }
    return { success: false, error: res.error || 'Gagal memperbarui kategori' };
  };

  const deleteCategory = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await deleteCategoryApi(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    }
    return { success: false, error: res.error || 'Gagal menghapus kategori' };
  };

  const loginUser = (loggedInUser: AuthUser, loggedInStore: AuthStore | null) => {
    setUser(loggedInUser);
    setStore(loggedInStore);
    setStoreInfo((prev) => ({
      ...prev,
      name: loggedInStore?.name || prev.name,
      owner: loggedInUser.name || prev.owner,
      email: loggedInUser.email || prev.email,
    }));
    fetchProducts();
    fetchCategories();
    fetchStock();
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
    setProducts([]);
    setCategories([]);
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

  // Update stock with server sync
  const updateStock = async (
    productId: string | number,
    newStock: number,
    note?: string
  ): Promise<{ success: boolean; data?: BackendStockItem; error?: string }> => {
    const prodIdStr = String(productId);
    const num = Math.round(newStock);
    if (isNaN(num) || num < 0) {
      return {
        success: false,
        error: 'Jumlah stok harus berupa bilangan bulat dan tidak boleh negatif.',
      };
    }

    try {
      const res = await updateStockApi(productId, num, note);
      if (res.success && res.data) {
        const confirmedStock = res.data.stock;
        setProducts((prev) =>
          prev.map((p) =>
            p.id === prodIdStr ? { ...p, stock: confirmedStock } : p
          )
        );
        return { success: true, data: res.data };
      }
      return {
        success: false,
        error: res.error || 'Gagal memperbarui stok di server.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Terjadi kesalahan jaringan saat memperbarui stok.',
      };
    }
  };

  // Quick increment stock (+1) synced with server
  const incrementStock = async (
    productId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const target = products.find((p) => p.id === productId);
    if (!target) return { success: false, error: 'Produk tidak ditemukan.' };
    return updateStock(productId, target.stock + 1);
  };

  // Quick decrement stock (-1, clamped to min 0) synced with server
  const decrementStock = async (
    productId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const target = products.find((p) => p.id === productId);
    if (!target) return { success: false, error: 'Produk tidak ditemukan.' };
    if (target.stock <= 0) return { success: false, error: 'Stok sudah habis.' };
    return updateStock(productId, Math.max(0, target.stock - 1));
  };

  // Save specific stock value synced with server
  const saveStock = async (
    productId: string,
    newStock: number
  ): Promise<{ success: boolean; error?: string }> => {
    return updateStock(productId, newStock);
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
        categories,
        isLoadingProducts,
        isLoadingCategories,
        isLoadingStock,
        productsError,
        fetchProducts,
        fetchCategories,
        fetchStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateStock,
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
