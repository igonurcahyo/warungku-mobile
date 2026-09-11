import { apiRequest } from './client';

export interface CategoryItem {
  id: number;
  name: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResult {
  success: boolean;
  data?: CategoryItem[];
  error?: string;
}

export interface CategoryMutationResult {
  success: boolean;
  data?: CategoryItem;
  message?: string;
  error?: string;
}

/**
 * Fetch categories for the authenticated store
 * GET /api/mobile/categories
 */
export async function getCategoriesApi(): Promise<CategoriesResult> {
  const res = await apiRequest<{ success: boolean; data: CategoryItem[]; message?: string }>(
    '/api/mobile/categories',
    {
      method: 'GET',
    }
  );

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memuat kategori warung.',
    };
  }

  return {
    success: true,
    data: res.data.data || [],
  };
}

/**
 * Create a new category
 * POST /api/mobile/categories
 */
export async function createCategoryApi(payload: {
  name: string;
}): Promise<CategoryMutationResult> {
  const res = await apiRequest<{
    success: boolean;
    data: CategoryItem;
    message?: string;
  }>('/api/mobile/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal menambahkan kategori.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Kategori berhasil ditambahkan.',
  };
}

/**
 * Update an existing category
 * PUT /api/mobile/categories/:id
 */
export async function updateCategoryApi(
  id: number,
  payload: { name: string }
): Promise<CategoryMutationResult> {
  const res = await apiRequest<{
    success: boolean;
    data: CategoryItem;
    message?: string;
  }>(`/api/mobile/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal memperbarui kategori.',
    };
  }

  return {
    success: true,
    data: res.data.data,
    message: res.data.message || 'Kategori berhasil diperbarui.',
  };
}

/**
 * Delete a category
 * DELETE /api/mobile/categories/:id
 */
export async function deleteCategoryApi(
  id: number
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await apiRequest<{
    success: boolean;
    message?: string;
  }>(`/api/mobile/categories/${id}`, {
    method: 'DELETE',
  });

  if (!res.success || !res.data?.success) {
    return {
      success: false,
      error: res.error || 'Gagal menghapus kategori.',
    };
  }

  return {
    success: true,
    message: res.data.message || 'Kategori berhasil dihapus.',
  };
}
