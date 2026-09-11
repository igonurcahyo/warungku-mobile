import { formatRupiahCompact } from './transaction-data';

export type ReportPeriod = 'Hari Ini' | '7 Hari' | '30 Hari';

export interface ReportItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ReportTransaction {
  id: string;
  date: string;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS';
  paymentStatus: 'Lunas';
  items: ReportItem[];
}

export interface ChartBarData {
  label: string;
  value: number;
  displayValue: string;
}

export interface TopProductItem {
  id: string;
  productName: string;
  soldCount: number;
  revenue: number;
  category: string;
}

export interface PaymentMethodSummary {
  method: 'Tunai' | 'QRIS';
  count: number;
  percentage: number;
  totalAmount: number;
}

export interface ReportSummaryData {
  period: ReportPeriod;
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
  chartBars: ChartBarData[];
  topProducts: TopProductItem[];
  paymentMethods: PaymentMethodSummary[];
  recentTransactions: ReportTransaction[];
}

export const DUMMY_REPORT_DATA: Record<ReportPeriod, ReportSummaryData> = {
  'Hari Ini': {
    period: 'Hari Ini',
    totalSales: 1250000,
    transactionCount: 42,
    averageTransaction: 29762,
    chartBars: [
      { label: '08:00', value: 185000, displayValue: '185 rb' },
      { label: '11:00', value: 340000, displayValue: '340 rb' },
      { label: '14:00', value: 290000, displayValue: '290 rb' },
      { label: '17:00', value: 275000, displayValue: '275 rb' },
      { label: '20:00', value: 160000, displayValue: '160 rb' },
    ],
    topProducts: [
      { id: '1', productName: 'Indomie Goreng', soldCount: 32, revenue: 112000, category: 'Makanan' },
      { id: '2', productName: 'Teh Botol Sosro', soldCount: 25, revenue: 87500, category: 'Minuman' },
      { id: '3', productName: 'Kopi Kapal Api Sachet', soldCount: 21, revenue: 42000, category: 'Minuman' },
      { id: '4', productName: 'Aqua 600ml', soldCount: 18, revenue: 54000, category: 'Minuman' },
      { id: '5', productName: 'Telur Ayam 1kg', soldCount: 12, revenue: 336000, category: 'Sembako' },
    ],
    paymentMethods: [
      { method: 'Tunai', count: 28, percentage: 67, totalAmount: 820000 },
      { method: 'QRIS', count: 14, percentage: 33, totalAmount: 430000 },
    ],
    recentTransactions: [
      {
        id: 'TRX-00125',
        date: '11 Sep 2026 • 14:32',
        total: 25000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [
          { productName: 'Indomie Goreng', quantity: 2, price: 3500, subtotal: 7000 },
          { productName: 'Minyak Goreng 1L', quantity: 1, price: 18000, subtotal: 18000 },
        ],
      },
      {
        id: 'TRX-00124',
        date: '11 Sep 2026 • 13:15',
        total: 18500,
        paymentMethod: 'QRIS',
        paymentStatus: 'Lunas',
        items: [
          { productName: 'Teh Botol Sosro', quantity: 3, price: 3500, subtotal: 10500 },
          { productName: 'Roti Coklat', quantity: 1, price: 8000, subtotal: 8000 },
        ],
      },
      {
        id: 'TRX-00123',
        date: '11 Sep 2026 • 11:40',
        total: 42000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [
          { productName: 'Beras 2kg', quantity: 1, price: 32000, subtotal: 32000 },
          { productName: 'Kopi Kapal Api Sachet', quantity: 5, price: 2000, subtotal: 10000 },
        ],
      },
      {
        id: 'TRX-00122',
        date: '11 Sep 2026 • 09:10',
        total: 15000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [
          { productName: 'Aqua 600ml', quantity: 5, price: 3000, subtotal: 15000 },
        ],
      },
    ],
  },
  '7 Hari': {
    period: '7 Hari',
    totalSales: 8750000,
    transactionCount: 295,
    averageTransaction: 29661,
    chartBars: [
      { label: 'Sen', value: 1100000, displayValue: '1.1 jt' },
      { label: 'Sel', value: 1250000, displayValue: '1.2 jt' },
      { label: 'Rab', value: 980000, displayValue: '980 rb' },
      { label: 'Kam', value: 1320000, displayValue: '1.3 jt' },
      { label: 'Jum', value: 1450000, displayValue: '1.4 jt' },
      { label: 'Sab', value: 1500000, displayValue: '1.5 jt' },
      { label: 'Min', value: 1150000, displayValue: '1.1 jt' },
    ],
    topProducts: [
      { id: '1', productName: 'Indomie Goreng', soldCount: 185, revenue: 647500, category: 'Makanan' },
      { id: '4', productName: 'Aqua 600ml', soldCount: 142, revenue: 426000, category: 'Minuman' },
      { id: '2', productName: 'Teh Botol Sosro', soldCount: 128, revenue: 448000, category: 'Minuman' },
      { id: '6', productName: 'Beras 5kg', soldCount: 94, revenue: 7050000, category: 'Sembako' },
      { id: '7', productName: 'Minyak Goreng 1L', soldCount: 76, revenue: 1368000, category: 'Sembako' },
    ],
    paymentMethods: [
      { method: 'Tunai', count: 198, percentage: 67, totalAmount: 5850000 },
      { method: 'QRIS', count: 97, percentage: 33, totalAmount: 2900000 },
    ],
    recentTransactions: [
      {
        id: 'TRX-00125',
        date: '11 Sep 2026 • 14:32',
        total: 25000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Indomie Goreng', quantity: 2, price: 3500, subtotal: 7000 }],
      },
      {
        id: 'TRX-00124',
        date: '11 Sep 2026 • 13:15',
        total: 18500,
        paymentMethod: 'QRIS',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Teh Botol Sosro', quantity: 3, price: 3500, subtotal: 10500 }],
      },
      {
        id: 'TRX-00120',
        date: '10 Sep 2026 • 18:20',
        total: 75000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Beras 5kg', quantity: 1, price: 75000, subtotal: 75000 }],
      },
      {
        id: 'TRX-00115',
        date: '09 Sep 2026 • 16:45',
        total: 36000,
        paymentMethod: 'QRIS',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Minyak Goreng 1L', quantity: 2, price: 18000, subtotal: 36000 }],
      },
    ],
  },
  '30 Hari': {
    period: '30 Hari',
    totalSales: 37800000,
    transactionCount: 1280,
    averageTransaction: 29531,
    chartBars: [
      { label: 'Mgg 1', value: 8900000, displayValue: '8.9 jt' },
      { label: 'Mgg 2', value: 9600000, displayValue: '9.6 jt' },
      { label: 'Mgg 3', value: 9200000, displayValue: '9.2 jt' },
      { label: 'Mgg 4', value: 10100000, displayValue: '10.1 jt' },
    ],
    topProducts: [
      { id: '1', productName: 'Indomie Goreng', soldCount: 760, revenue: 2660000, category: 'Makanan' },
      { id: '4', productName: 'Aqua 600ml', soldCount: 620, revenue: 1860000, category: 'Minuman' },
      { id: '6', productName: 'Beras 5kg', soldCount: 410, revenue: 30750000, category: 'Sembako' },
      { id: '8', productName: 'Gula Pasir 1kg', soldCount: 355, revenue: 6035000, category: 'Sembako' },
      { id: '7', productName: 'Minyak Goreng 1L', soldCount: 320, revenue: 5760000, category: 'Sembako' },
    ],
    paymentMethods: [
      { method: 'Tunai', count: 845, percentage: 66, totalAmount: 24950000 },
      { method: 'QRIS', count: 435, percentage: 34, totalAmount: 12850000 },
    ],
    recentTransactions: [
      {
        id: 'TRX-00125',
        date: '11 Sep 2026 • 14:32',
        total: 25000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Indomie Goreng', quantity: 2, price: 3500, subtotal: 7000 }],
      },
      {
        id: 'TRX-00124',
        date: '11 Sep 2026 • 13:15',
        total: 18500,
        paymentMethod: 'QRIS',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Teh Botol Sosro', quantity: 3, price: 3500, subtotal: 10500 }],
      },
      {
        id: 'TRX-00098',
        date: '01 Sep 2026 • 10:12',
        total: 92000,
        paymentMethod: 'Tunai',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Beras 5kg', quantity: 1, price: 75000, subtotal: 75000 }],
      },
      {
        id: 'TRX-00050',
        date: '20 Agu 2026 • 15:30',
        total: 51000,
        paymentMethod: 'QRIS',
        paymentStatus: 'Lunas',
        items: [{ productName: 'Gula Pasir 1kg', quantity: 3, price: 17000, subtotal: 51000 }],
      },
    ],
  },
};

export { formatRupiahCompact };
