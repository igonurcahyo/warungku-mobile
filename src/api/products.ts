import { apiRequest } from './client';

export interface BackendProduct {
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

export interface ProductsResult {
  success: boolean;
  data?: BackendProduct[];
  error?: string;
}

export interface ProductMutationResult {
  success: boolean;
  data?: BackendProduct;
  message?: string;
  error?: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  unit?: string;
}

/**
 * Fetch products for authenticated store
 * GET /api/mobile/products
 */
export async function getProductsApi(params?: {
  search?: string;
  categoryId?: number;
}): Promise<ProductsResult> {
  const queryParts: string[] = [];
  if (params?.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }
  if (params?.categoryId) {
    queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

  const res = await apiRequest<{
    success: boolean;
    data: BackendProduct[];
    message?: string;
  }>(`/api/mobile/products${queryString}`, {
    method: 'GET',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memuat data produk.',
    };
  }

  return {
    success: true,
    data: res.data.data || [],
  };
}

/**
 * Create a new product
 * POST /api/mobile/products
 */
export async function createProductApi(
  payload: ProductPayload
): Promise<ProductMutationResult> {
  const res = await apiRequest<{
    success: boolean;
    data: BackendProduct;
    message?: string;
  }>('/api/mobile/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal menambahkan produk.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Produk berhasil ditambahkan.',
  };
}

/**
 * Update an existing product
 * PUT /api/mobile/products/:id
 */
export async function updateProductApi(
  id: number | string,
  payload: ProductPayload
): Promise<ProductMutationResult> {
  const res = await apiRequest<{
    success: boolean;
    data: BackendProduct;
    message?: string;
  }>(`/api/mobile/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memperbarui produk.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Produk berhasil diperbarui.',
  };
}

/**
 * Delete a product
 * DELETE /api/mobile/products/:id
 */
export async function deleteProductApi(
  id: number | string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await apiRequest<{
    success: boolean;
    message?: string;
  }>(`/api/mobile/products/${id}`, {
    method: 'DELETE',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal menghapus produk.',
    };
  }

  return {
    success: true,
    message: res.data.message || 'Produk berhasil dihapus.',
  };
}
