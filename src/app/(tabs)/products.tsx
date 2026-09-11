import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WarungkuColors } from '@/constants/colors';
import {
  Product,
  ProductCategory,
} from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';
import { CategorySelector } from '@/components/pos/category-selector';
import { ProductManagementCard } from '@/components/products/product-management-card';
import { ProductFormModal } from '@/components/products/product-form-modal';
import { DeleteConfirmModal } from '@/components/products/delete-confirm-modal';
import { useStore } from '@/context/store-context';

export default function ProductsScreen() {
  // Shared state for product list from context
  const { products, setProducts } = useStore();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');

  // Modal states
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === 'Semua' || p.category === selectedCategory;
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

  // Save product (Add or Update)
  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (productData.id) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id
            ? {
                ...p,
                name: productData.name,
                price: productData.price,
                category: productData.category,
                stock: productData.stock,
              }
            : p
        )
      );
    } else {
      // Add new
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
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

        {/* Product Count Badge */}
        <View style={styles.productCountBadge}>
          <Text style={styles.productCountText}>{products.length} Produk</Text>
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
      />

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
        ListEmptyComponent={
          products.length === 0 ? (
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
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!productToDelete}
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirmDelete={handleDeleteProduct}
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
