export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  categoryId?: number | null;
  categoryName?: string;
  unit?: string;
}

export type ProductCategory = string;

export interface CartItem {
  product: Product;
  quantity: number;
}

export const CATEGORIES: ProductCategory[] = [
  'Semua',
  'Makanan',
  'Minuman',
  'Sembako',
  'Lainnya',
];

export const FORM_CATEGORIES: Exclude<ProductCategory, 'Semua'>[] = [
  'Makanan',
  'Minuman',
  'Sembako',
  'Lainnya',
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Indomie Goreng',
    price: 3500,
    category: 'Makanan',
    stock: 25,
  },
  {
    id: 'p2',
    name: 'Indomie Soto',
    price: 3500,
    category: 'Makanan',
    stock: 15,
  },
  {
    id: 'p3',
    name: 'Aqua 600ml',
    price: 3000,
    category: 'Minuman',
    stock: 18,
  },
  {
    id: 'p4',
    name: 'Teh Pucuk',
    price: 4000,
    category: 'Minuman',
    stock: 12,
  },
  {
    id: 'p5',
    name: 'Kopi Kapal Api',
    price: 2000,
    category: 'Minuman',
    stock: 3,
  },
  {
    id: 'p6',
    name: 'Gula 1kg',
    price: 17000,
    category: 'Sembako',
    stock: 8,
  },
  {
    id: 'p7',
    name: 'Beras 5kg',
    price: 75000,
    category: 'Sembako',
    stock: 5,
  },
  {
    id: 'p8',
    name: 'Roti',
    price: 5000,
    category: 'Makanan',
    stock: 0,
  },
  {
    id: 'p9',
    name: 'Minyak Goreng 1L',
    price: 18000,
    category: 'Sembako',
    stock: 14,
  },
  {
    id: 'p10',
    name: 'Telur 1kg',
    price: 28000,
    category: 'Sembako',
    stock: 4,
  },
  {
    id: 'p11',
    name: 'Kerupuk Kaleng',
    price: 1000,
    category: 'Lainnya',
    stock: 30,
  },
  {
    id: 'p12',
    name: 'Sabun Mandi',
    price: 4500,
    category: 'Lainnya',
    stock: 0,
  },
];

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export type StockStatusType = 'out' | 'low' | 'available';

export interface StockStatusInfo {
  label: string;
  type: StockStatusType;
}

export function getStockStatus(stock: number): StockStatusInfo {
  if (stock === 0) {
    return { label: 'Stok Habis', type: 'out' };
  }
  if (stock >= 1 && stock <= 5) {
    return { label: 'Stok Menipis', type: 'low' };
  }
  return { label: 'Tersedia', type: 'available' };
}
