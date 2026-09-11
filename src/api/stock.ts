import { apiRequest } from './client';

export interface BackendStockItem {
  id: number;
  name: string;
  price: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  categoryId: number | null;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockResult {
  success: boolean;
  data?: BackendStockItem[];
  error?: string;
}

export interface UpdateStockResult {
  success: boolean;
  data?: BackendStockItem;
  message?: string;
  error?: string;
}

/**
 * Fetch stock items from PostgreSQL backend
 * GET /api/mobile/stock
 */
export async function getStockApi(params?: {
  search?: string;
  categoryId?: number;
  status?: string;
}): Promise<StockResult> {
  const queryParts: string[] = [];
  if (params?.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params?.categoryId) {
    queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
  }
  if (params?.status) {
    queryParts.push(`status=${encodeURIComponent(params.status)}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const res = await apiRequest<{
    success: boolean;
    data: BackendStockItem[];
    message?: string;
  }>(`/api/mobile/stock${queryString}`, {
    method: 'GET',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memuat data stok.',
    };
  }

  return {
    success: true,
    data: res.data.data || [],
  };
}

/**
 * Update stock for a specific product
 * PUT /api/mobile/stock/:productId
 */
export async function updateStockApi(
  productId: number | string,
  stock: number,
  note?: string
): Promise<UpdateStockResult> {
  const res = await apiRequest<{
    success: boolean;
    data: BackendStockItem;
    message?: string;
  }>(`/api/mobile/stock/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ stock, note }),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memperbarui stok.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Stok berhasil diperbarui.',
  };
}
