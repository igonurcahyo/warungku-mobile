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
  CartItem,
} from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';
import { CategorySelector } from '@/components/pos/category-selector';
import { ProductCard } from '@/components/pos/product-card';
import { FloatingCartBar } from '@/components/pos/floating-cart-bar';
import { CartModal } from '@/components/pos/cart-modal';
import { QrisPaymentModal } from '@/components/pos/qris-payment-modal';
import { Transaction } from '@/constants/transaction-data';
import { useStore } from '@/context/store-context';

export default function PosScreen() {
  const { products, categories, createTransaction } = useStore();

  // Local temporary states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  // Dynamic category list from database
  const categoryNames = useMemo(() => {
    return ['Semua', ...categories.map((c) => c.name)];
  }, [categories]);

  // QRIS Payment Modal states
  const [activeQrisTrx, setActiveQrisTrx] = useState<Transaction | null>(null);
  const [isQrisModalVisible, setIsQrisModalVisible] = useState(false);

  // Filter products based on search query and category (live products from store)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Derived cart metrics
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        if (prevItems[existingIndex].quantity >= product.stock) {
          return prevItems;
        }
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleIncrementQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          if (item.quantity >= item.product.stock) {
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const handleDecrementQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToQris = () => {
    const trxItems = cartItems.map((it) => ({
      productName: it.product.name,
      quantity: it.quantity,
      price: it.product.price,
      subtotal: it.product.price * it.quantity,
    }));
    const newTrx = createTransaction({
      items: trxItems,
      total: totalPrice,
      paymentMethod: 'QRIS',
      paymentStatus: 'Menunggu Pembayaran',
    });
    handleClearCart();
    setIsCartModalVisible(false);
    setActiveQrisTrx(newTrx);
    setIsQrisModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* POS Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Kasir</Text>
          <Text style={styles.headerSubtitle}>
            Pilih produk untuk membuat transaksi
          </Text>
        </View>

        {/* Top Cart Icon Button */}
        <TouchableOpacity
          style={styles.headerCartButton}
          activeOpacity={0.7}
          onPress={() => setIsCartModalVisible(true)}
          accessibilityLabel="Buka keranjang"
          accessibilityRole="button"
        >
          <AppIcon
            name="cart"
            size={22}
            color={totalQuantity > 0 ? WarungkuColors.primary : WarungkuColors.secondaryText}
            focused={totalQuantity > 0}
          />
          {totalQuantity > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
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

      {/* Category Horizontal Selector */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categoryNames}
      />

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const inCart = cartItems.find(
            (cartItem) => cartItem.product.id === item.id
          );
          return (
            <ProductCard
              product={item}
              quantityInCart={inCart ? inCart.quantity : 0}
              onAddToCart={handleAddToCart}
            />
          );
        }}
        contentContainerStyle={[
          styles.productListContent,
          // Extra bottom padding when floating cart bar is visible
          { paddingBottom: totalQuantity > 0 ? 100 : 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <AppIcon
                  name="box"
                  size={32}
                  color={WarungkuColors.secondaryText}
                />
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
        }
      />

      {/* Sticky / Floating Cart Bar above bottom tabs */}
      <FloatingCartBar
        itemCount={totalQuantity}
        totalPrice={totalPrice}
        onPress={() => setIsCartModalVisible(true)}
      />

      {/* Cart Detail & Payment Modal */}
      <CartModal
        visible={isCartModalVisible}
        cartItems={cartItems}
        totalPrice={totalPrice}
        totalQuantity={totalQuantity}
        onClose={() => setIsCartModalVisible(false)}
        onIncrementQuantity={handleIncrementQuantity}
        onDecrementQuantity={handleDecrementQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToQris={handleProceedToQris}
      />

      {/* QRIS Payment Modal */}
      <QrisPaymentModal
        visible={isQrisModalVisible}
        transaction={activeQrisTrx}
        onClose={() => setIsQrisModalVisible(false)}
        onPaidSuccess={() => {
          setIsQrisModalVisible(false);
          setActiveQrisTrx(null);
        }}
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
  headerCartButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: WarungkuColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    position: 'relative',
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: WarungkuColors.secondaryContainer,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
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
    paddingTop: 10,
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
});
