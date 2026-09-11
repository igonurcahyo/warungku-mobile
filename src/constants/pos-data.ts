export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

export type ProductCategory = 'Semua' | 'Makanan' | 'Minuman' | 'Sembako' | 'Lainnya';

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

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Indomie Goreng',
    price: 3500,
    category: 'Makanan',
  },
  {
    id: 'p2',
    name: 'Indomie Soto',
    price: 3500,
    category: 'Makanan',
  },
  {
    id: 'p3',
    name: 'Aqua 600ml',
    price: 3000,
    category: 'Minuman',
  },
  {
    id: 'p4',
    name: 'Teh Pucuk',
    price: 4000,
    category: 'Minuman',
  },
  {
    id: 'p5',
    name: 'Kopi Kapal Api',
    price: 2000,
    category: 'Minuman',
  },
  {
    id: 'p6',
    name: 'Gula 1kg',
    price: 17000,
    category: 'Sembako',
  },
  {
    id: 'p7',
    name: 'Beras 5kg',
    price: 75000,
    category: 'Sembako',
  },
  {
    id: 'p8',
    name: 'Roti',
    price: 5000,
    category: 'Makanan',
  },
  {
    id: 'p9',
    name: 'Minyak Goreng 1L',
    price: 18000,
    category: 'Sembako',
  },
  {
    id: 'p10',
    name: 'Telur 1kg',
    price: 28000,
    category: 'Sembako',
  },
  {
    id: 'p11',
    name: 'Kerupuk Kaleng',
    price: 1000,
    category: 'Lainnya',
  },
  {
    id: 'p12',
    name: 'Sabun Mandi',
    price: 4500,
    category: 'Lainnya',
  },
];

export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}
