export interface TransactionItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type PaymentMethod = 'Tunai' | 'QRIS';
export type PaymentStatus = 'Lunas' | 'Menunggu Pembayaran' | 'Dibatalkan';
export type DateFilterType = 'Semua' | 'Hari Ini' | '7 Hari' | '30 Hari';

export interface Transaction {
  id: string;
  dateISO: string; // Used for relative date filtering
  dateDisplay: string;
  items: TransactionItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string; // Set when payment is completed to guarantee single stock deduction
}

export function formatRupiahCompact(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

// Dummy transactions spanning Today, Past 7 Days, and Past 30 Days
export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-00125',
    dateISO: '2026-09-11T14:32:00', // Today
    dateDisplay: '11 September 2026 • 14:32',
    items: [
      { productName: 'Indomie Goreng', quantity: 2, price: 3500, subtotal: 7000 },
      { productName: 'Teh Botol', quantity: 1, price: 3500, subtotal: 3500 },
    ],
    total: 10500,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00124',
    dateISO: '2026-09-11T11:15:00', // Today
    dateDisplay: '11 September 2026 • 11:15',
    items: [
      { productName: 'Beras 5kg', quantity: 1, price: 75000, subtotal: 75000 },
      { productName: 'Minyak Goreng 1L', quantity: 1, price: 18000, subtotal: 18000 },
      { productName: 'Gula 1kg', quantity: 2, price: 17000, subtotal: 34000 },
    ],
    total: 127000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00123',
    dateISO: '2026-09-11T08:45:00', // Today
    dateDisplay: '11 September 2026 • 08:45',
    items: [
      { productName: 'Kopi Kapal Api', quantity: 3, price: 2000, subtotal: 6000 },
      { productName: 'Roti', quantity: 2, price: 5000, subtotal: 10000 },
    ],
    total: 16000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00122',
    dateISO: '2026-09-10T16:20:00', // Yesterday (7 Days)
    dateDisplay: '10 September 2026 • 16:20',
    items: [
      { productName: 'Aqua 600ml', quantity: 4, price: 3000, subtotal: 12000 },
      { productName: 'Kerupuk Kaleng', quantity: 3, price: 1000, subtotal: 3000 },
    ],
    total: 15000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00121',
    dateISO: '2026-09-09T19:10:00', // 2 days ago (7 Days)
    dateDisplay: '9 September 2026 • 19:10',
    items: [
      { productName: 'Telur 1kg', quantity: 1, price: 28000, subtotal: 28000 },
      { productName: 'Indomie Soto', quantity: 4, price: 3500, subtotal: 14000 },
    ],
    total: 42000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00120',
    dateISO: '2026-09-07T13:00:00', // 4 days ago (7 Days)
    dateDisplay: '7 September 2026 • 13:00',
    items: [
      { productName: 'Teh Pucuk', quantity: 2, price: 4000, subtotal: 8000 },
      { productName: 'Sabun Mandi', quantity: 2, price: 4500, subtotal: 9000 },
    ],
    total: 17000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Menunggu Pembayaran',
  },
  {
    id: 'TRX-00119',
    dateISO: '2026-09-05T10:30:00', // 6 days ago (7 Days)
    dateDisplay: '5 September 2026 • 10:30',
    items: [
      { productName: 'Gula 1kg', quantity: 1, price: 17000, subtotal: 17000 },
      { productName: 'Kopi Kapal Api', quantity: 5, price: 2000, subtotal: 10000 },
    ],
    total: 27000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00118',
    dateISO: '2026-08-28T15:40:00', // 14 days ago (30 Days)
    dateDisplay: '28 Agustus 2026 • 15:40',
    items: [
      { productName: 'Beras 5kg', quantity: 1, price: 75000, subtotal: 75000 },
    ],
    total: 75000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00117',
    dateISO: '2026-08-20T17:25:00', // 22 days ago (30 Days)
    dateDisplay: '20 Agustus 2026 • 17:25',
    items: [
      { productName: 'Minyak Goreng 1L', quantity: 1, price: 18000, subtotal: 18000 },
      { productName: 'Aqua 600ml', quantity: 2, price: 3000, subtotal: 6000 },
      { productName: 'Roti', quantity: 1, price: 5000, subtotal: 5000 },
    ],
    total: 29000,
    paymentMethod: 'Tunai',
    paymentStatus: 'Lunas',
  },
  {
    id: 'TRX-00116',
    dateISO: '2026-08-15T09:12:00', // 27 days ago (30 Days)
    dateDisplay: '15 Agustus 2026 • 09:12',
    items: [
      { productName: 'Indomie Goreng', quantity: 5, price: 3500, subtotal: 17500 },
      { productName: 'Telur 1kg', quantity: 1, price: 28000, subtotal: 28000 },
    ],
    total: 45500,
    paymentMethod: 'Tunai',
    paymentStatus: 'Menunggu Pembayaran',
  },
];
