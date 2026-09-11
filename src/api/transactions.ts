import { apiRequest } from './client';

export interface BackendTransactionItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface BackendTransaction {
  id: number;
  transactionNumber: string;
  total: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: 'cash' | 'qris';
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
  itemCount?: number;
  totalQuantity?: number;
  items: BackendTransactionItem[];
}

export interface CreateCashTransactionPayload {
  paymentMethod: 'cash';
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  paidAmount: number;
}

export interface TransactionsResult {
  success: boolean;
  data?: BackendTransaction[];
  error?: string;
}

export interface TransactionDetailResult {
  success: boolean;
  data?: BackendTransaction;
  error?: string;
}

export interface CreateTransactionResult {
  success: boolean;
  data?: BackendTransaction;
  message?: string;
  error?: string;
}

/**
 * Fetch transactions for authenticated store
 * GET /api/mobile/transactions
 */
export async function getTransactionsApi(params?: {
  search?: string;
  paymentMethod?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TransactionsResult> {
  const queryParts: string[] = [];
  if (params?.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params?.paymentMethod) {
    queryParts.push(`paymentMethod=${encodeURIComponent(params.paymentMethod)}`);
  }
  if (params?.period) {
    queryParts.push(`period=${encodeURIComponent(params.period)}`);
  }
  if (params?.startDate) {
    queryParts.push(`startDate=${encodeURIComponent(params.startDate)}`);
  }
  if (params?.endDate) {
    queryParts.push(`endDate=${encodeURIComponent(params.endDate)}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const res = await apiRequest<{
    success: boolean;
    data: BackendTransaction[];
    message?: string;
  }>(`/api/mobile/transactions${queryString}`, {
    method: 'GET',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || res.data?.message || 'Gagal memuat riwayat transaksi.',
    };
  }

  return {
    success: true,
    data: res.data.data || [],
  };
}

/**
 * Fetch detail of a single transaction
 * GET /api/mobile/transactions/:id
 */
export async function getTransactionDetailApi(
  id: number | string
): Promise<TransactionDetailResult> {
  const res = await apiRequest<{
    success: boolean;
    data: BackendTransaction;
    message?: string;
  }>(`/api/mobile/transactions/${id}`, {
    method: 'GET',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || res.data?.message || 'Gagal memuat detail transaksi.',
    };
  }

  return {
    success: true,
    data: res.data.data,
  };
}

/**
 * Create a new cash transaction
 * POST /api/mobile/transactions
 */
export async function createCashTransactionApi(
  payload: CreateCashTransactionPayload
): Promise<CreateTransactionResult> {
  const res = await apiRequest<{
    success: boolean;
    data: BackendTransaction;
    message?: string;
  }>('/api/mobile/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || res.data?.message || 'Gagal memproses transaksi.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Transaksi berhasil disimpan.',
  };
}
