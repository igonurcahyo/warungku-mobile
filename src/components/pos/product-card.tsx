import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
}: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.infoArea}>
        {/* Category Badge & In-Cart Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          {quantityInCart > 0 && (
            <View style={styles.inCartBadge}>
              <Text style={styles.inCartText}>{quantityInCart} di keranjang</Text>
            </View>
          )}
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Price */}
        <Text style={styles.productPrice}>
          {formatRupiah(product.price)}
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          quantityInCart > 0 && styles.addButtonActive,
        ]}
        onPress={() => onAddToCart(product)}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={`Tambah ${product.name} ke keranjang`}
        accessibilityRole="button"
      >
        <AppIcon
          name="plus"
          size={16}
          color={WarungkuColors.onPrimary}
        />
        <Text style={styles.addButtonText}>Tambah</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  infoArea: {
    flex: 1,
    marginRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: WarungkuColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  inCartBadge: {
    backgroundColor: WarungkuColors.successContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inCartText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.success,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
    lineHeight: 22,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: WarungkuColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 46,
    minWidth: 92,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonActive: {
    backgroundColor: WarungkuColors.primaryContainer,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.2,
  },
});
