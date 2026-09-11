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
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { Product } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';
import { StockSummaryCard } from '@/components/stock/stock-summary-card';
import {
  StockFilterTabs,
  StockFilterType,
} from '@/components/stock/stock-filter-tabs';
import { StockProductCard } from '@/components/stock/stock-product-card';
import { StockEditModal } from '@/components/stock/stock-edit-modal';
import { useStore } from '@/context/store-context';

export default function StockScreen() {
  const router = useRouter();
  // Shared state for products from context
  const { products, setProducts, unreadCount } = useStore();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StockFilterType>('Semua');

  // Direct edit modal state
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Calculate dynamic summary counts
  const summaryCounts = useMemo(() => {
    let lowCount = 0;
    let outCount = 0;
    let availableCount = 0;

    products.forEach((p) => {
      if (p.stock === 0) {
        outCount += 1;
      } else if (p.stock >= 1 && p.stock <= 5) {
        lowCount += 1;
      } else {
        availableCount += 1;
      }
    });

    return {
      semua: products.length,
      tersedia: availableCount,
      menipis: lowCount,
      habis: outCount,
    };
  }, [products]);

  // Filtered products based on search and stock status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      // 2. Stock filter
      let matchesStock = true;
      if (selectedFilter === 'Tersedia') {
        matchesStock = p.stock > 5;
      } else if (selectedFilter === 'Menipis') {
        matchesStock = p.stock >= 1 && p.stock <= 5;
      } else if (selectedFilter === 'Habis') {
        matchesStock = p.stock === 0;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, selectedFilter]);

  // Quick increment stock (+1)
  const handleIncrement = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + 1 } : p
      )
    );
  };

  // Quick decrement stock (-1, clamped to min 0)
  const handleDecrement = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - 1) } : p
      )
    );
  };

  // Open direct edit modal
  const handleOpenEditModal = (product: Product) => {
    setSelectedProductForEdit(product);
    setIsEditModalVisible(true);
  };

  // Save new stock value from modal
  const handleSaveStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Manajemen Stok</Text>
          <Text style={styles.headerSubtitle}>
            Pantau dan kelola stok produk
          </Text>
        </View>

        {/* Bell Notification Icon */}
        <TouchableOpacity
          style={styles.bellButton}
          activeOpacity={0.7}
          onPress={() => router.navigate('/notifications')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={unreadCount > 0 ? `Notifikasi Stok (${unreadCount})` : 'Notifikasi Stok'}
          accessibilityRole="button"
        >
          <AppIcon name="bell" size={20} color={WarungkuColors.text} />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stock Summary Mini Cards */}
      <StockSummaryCard
        totalCount={summaryCounts.semua}
        lowStockCount={summaryCounts.menipis}
        outOfStockCount={summaryCounts.habis}
      />

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
              accessibilityLabel="Hapus pencarian"
              accessibilityRole="button"
            >
              <AppIcon name="x" size={14} color={WarungkuColors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stock Status Filter Tabs */}
      <StockFilterTabs
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        counts={summaryCounts}
      />

      {/* Products Stock List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockProductCard
            product={item}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onOpenEditModal={handleOpenEditModal}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <AppIcon name="box" size={32} color={WarungkuColors.secondaryText} />
              </View>
              <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Tidak ada produk yang cocok dengan pencarian atau filter stok yang dipilih.
              </Text>
              {(searchQuery.length > 0 || selectedFilter !== 'Semua') && (
                <TouchableOpacity
                  style={styles.resetFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('Semua');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetFilterBtnText}>Reset Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        }
      />

      {/* Direct Numeric Edit Stock Modal */}
      <StockEditModal
        visible={isEditModalVisible}
        product={selectedProductForEdit}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedProductForEdit(null);
        }}
        onSaveStock={handleSaveStock}
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
    paddingBottom: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WarungkuColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    position: 'relative',
    marginLeft: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
});
