import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WarungkuColors } from '@/constants/colors';
import { Product } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';
import { CategorySelector } from '@/components/pos/category-selector';
import { ProductManagementCard } from '@/components/products/product-management-card';
import { ProductFormModal, ProductFormData } from '@/components/products/product-form-modal';
import { DeleteConfirmModal } from '@/components/products/delete-confirm-modal';
import { CategoryManagementModal } from '@/components/products/category-management-modal';
import { useStore } from '@/context/store-context';

export default function ProductsScreen() {
  const {
    products,
    categories,
    isLoadingProducts,
    productsError,
    fetchProducts,
    fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    isAuthenticated,
  } = useStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated, fetchProducts, fetchCategories]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchProducts(), fetchCategories()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchProducts, fetchCategories]);

  // Dynamic category list for filter
  const categoryNames = useMemo(() => {
    return ['Semua', ...categories.map((c) => c.name)];
  }, [categories]);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === 'Semua' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Open Form for Adding
  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsFormModalVisible(true);
  };

  // Open Form for Editing
  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalVisible(true);
  };

  // Save product (Add or Update) via API
  const handleSaveProduct = async (formData: ProductFormData) => {
    setIsSavingProduct(true);
    try {
      if (formData.id) {
        // Update existing
        const res = await updateProduct(formData.id, {
          name: formData.name,
          price: formData.price,
          stock: formData.stock,
          categoryId: formData.categoryId,
          unit: formData.unit || 'Pcs',
        });
        if (!res.success) {
          Alert.alert('Gagal Memperbarui Produk', res.error || 'Terjadi kesalahan.');
          return false;
        }
      } else {
        // Add new
        const res = await addProduct({
          name: formData.name,
          price: formData.price,
          stock: formData.stock,
          categoryId: formData.categoryId,
          unit: formData.unit || 'Pcs',
        });
        if (!res.success) {
          Alert.alert('Gagal Menambahkan Produk', res.error || 'Terjadi kesalahan.');
          return false;
        }
      }
      return true;
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete product via API
  const handleDeleteProduct = async (productId: string) => {
    const res = await deleteProduct(productId);
    if (!res.success) {
      Alert.alert('Gagal Menghapus Produk', res.error || 'Terjadi kesalahan server.');
    }
    setProductToDelete(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Produk</Text>
          <Text style={styles.headerSubtitle}>
            Kelola produk dan harga jual warung.
          </Text>
        </View>

        {/* Header Action Buttons */}
        <View style={styles.headerActionContainer}>
          <TouchableOpacity
            style={styles.categoryManageBtn}
            onPress={() => setIsCategoryModalVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Kelola kategori"
          >
            <AppIcon name="products" size={13} color={WarungkuColors.primary} />
            <Text style={styles.categoryManageText}>Kategori</Text>
          </TouchableOpacity>

          <View style={styles.productCountBadge}>
            <Text style={styles.productCountText}>{products.length} Produk</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={18} color={WarungkuColors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk..."
            placeholderTextColor={WarungkuColors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon name="x" size={14} color={WarungkuColors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Horizontal Filter */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categoryNames}
      />

      {/* Error state banner if any */}
      {productsError && (
        <View style={styles.errorBanner}>
          <AppIcon name="alert-triangle" size={16} color={WarungkuColors.error} />
          <Text style={styles.errorBannerText}>{productsError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              fetchProducts();
              fetchCategories();
            }}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductManagementCard
            product={item}
            onEdit={handleOpenEdit}
            onDelete={(p) => setProductToDelete(p)}
          />
        )}
        contentContainerStyle={styles.productListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[WarungkuColors.primary]}
            tintColor={WarungkuColors.primary}
          />
        }
        ListEmptyComponent={
          isLoadingProducts && products.length === 0 ? (
            /* Loading State */
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={WarungkuColors.primary} />
              <Text style={[styles.emptySubtitle, { marginTop: 14 }]}>
                Memuat produk dari database...
              </Text>
            </View>
          ) : products.length === 0 ? (
            /* Empty State: No products in catalog */
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <AppIcon name="box" size={34} color={WarungkuColors.secondaryText} />
              </View>
              <Text style={styles.emptyTitle}>Belum ada produk</Text>
              <Text style={styles.emptySubtitle}>
                Tambahkan produk pertama untuk mulai mengelola warung.
              </Text>
              <TouchableOpacity
                style={styles.emptyAddButton}
                activeOpacity={0.8}
                onPress={handleOpenAdd}
              >
                <AppIcon name="plus" size={16} color={WarungkuColors.onPrimary} />
                <Text style={styles.emptyAddButtonText}>Tambah Produk</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Empty Filter: Search or category yielded 0 results */
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <AppIcon name="search" size={32} color={WarungkuColors.secondaryText} />
                </View>
                <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
                <Text style={styles.emptySubtitle}>
                  Coba kata kunci lain atau pilih filter kategori yang berbeda.
                </Text>
                {(searchQuery.length > 0 || selectedCategory !== 'Semua') && (
                  <TouchableOpacity
                    style={styles.resetFilterButton}
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.resetFilterText}>Reset Filter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          )
        }
      />

      {/* Floating Action Button (FAB): + Tambah Produk */}
      <View style={styles.fabWrapper} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.fabButton}
          activeOpacity={0.85}
          onPress={handleOpenAdd}
          accessibilityRole="button"
          accessibilityLabel="Tambah produk baru"
        >
          <AppIcon name="plus" size={18} color={WarungkuColors.onPrimary} />
          <Text style={styles.fabButtonText}>Tambah Produk</Text>
        </TouchableOpacity>
      </View>

      {/* Product Form Modal (Add & Edit) */}
      <ProductFormModal
        visible={isFormModalVisible}
        productToEdit={productToEdit}
        onClose={() => {
          setIsFormModalVisible(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        isSaving={isSavingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!productToDelete}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirmDelete={handleDeleteProduct}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WarungkuColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  headerActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryManageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: WarungkuColors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  categoryManageText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  productCountBadge: {
    backgroundColor: WarungkuColors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  productCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 14,
    color: WarungkuColors.text,
    fontWeight: '500',
  },
  clearSearchButton: {
    padding: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEDEA',
    marginHorizontal: 20,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: WarungkuColors.error,
    fontWeight: '600',
  },
  retryButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: WarungkuColors.card,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  productListContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 96, // Space for FAB and tabs
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: 260,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WarungkuColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 46,
  },
  emptyAddButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
  },
  resetFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  resetFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  fabWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    zIndex: 99,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WarungkuColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.2,
  },
});
