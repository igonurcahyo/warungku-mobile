import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah, getStockStatus } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface StockProductCardProps {
  product: Product;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onOpenEditModal: (product: Product) => void;
}

export function StockProductCard({
  product,
  onIncrement,
  onDecrement,
  onOpenEditModal,
}: StockProductCardProps) {
  const stockStatus = getStockStatus(product.stock);
  const isZeroStock = product.stock <= 0;

  return (
    <View style={styles.card}>
      {/* Top Product Information */}
      <View style={styles.topInfoRow}>
        <View style={styles.detailsCol}>
          <View style={styles.badgeRow}>
            {/* Category */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            {/* Stock Status Badge */}
            <View
              style={[
                styles.statusBadge,
                stockStatus.type === 'out' && styles.statusBadgeOut,
                stockStatus.type === 'low' && styles.statusBadgeLow,
                stockStatus.type === 'available' && styles.statusBadgeAvailable,
              ]}
            >
              {stockStatus.type === 'low' && (
                <AppIcon name="alert-triangle" size={11} color={WarungkuColors.secondary} />
              )}
              <Text
                style={[
                  styles.statusBadgeText,
                  stockStatus.type === 'out' && styles.statusTextOut,
                  stockStatus.type === 'low' && styles.statusTextLow,
                  stockStatus.type === 'available' && styles.statusTextAvailable,
                ]}
              >
                {stockStatus.label}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Price */}
          <Text style={styles.productPrice}>{formatRupiah(product.price)}</Text>
        </View>

        {/* Current Stock Highlight */}
        <TouchableOpacity
          style={[
            styles.stockDisplayBox,
            stockStatus.type === 'out' && styles.stockDisplayBoxOut,
            stockStatus.type === 'low' && styles.stockDisplayBoxLow,
          ]}
          activeOpacity={0.75}
          onPress={() => onOpenEditModal(product)}
          accessibilityLabel={`Ubah stok ${product.name}, saat ini ${product.stock}`}
          accessibilityRole="button"
        >
          <Text style={styles.stockDisplayLabel}>Stok Saat Ini</Text>
          <Text
            style={[
              styles.stockDisplayNumber,
              stockStatus.type === 'out' && styles.stockNumberOut,
              stockStatus.type === 'low' && styles.stockNumberLow,
            ]}
          >
            {product.stock}
          </Text>
          <Text style={styles.tapToEditHint}>Ketuk ubah</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Controls Row */}
      <View style={styles.bottomControlsRow}>
        {/* Direct Edit Button */}
        <TouchableOpacity
          style={styles.directEditBtn}
          activeOpacity={0.75}
          onPress={() => onOpenEditModal(product)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Ubah stok manual ${product.name}`}
        >
          <AppIcon name="edit" size={15} color={WarungkuColors.primary} />
          <Text style={styles.directEditText}>Ubah Stok</Text>
        </TouchableOpacity>

        {/* Quick Stepper: [-]  count  [+] */}
        <View style={styles.stepperContainer}>
          {/* Minus Button */}
          <TouchableOpacity
            style={[styles.stepBtn, isZeroStock && styles.stepBtnDisabled]}
            disabled={isZeroStock}
            onPress={() => onDecrement(product.id)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={`Kurangi stok ${product.name}`}
          >
            <AppIcon
              name="minus"
              size={16}
              color={isZeroStock ? WarungkuColors.outlineVariant : WarungkuColors.text}
            />
          </TouchableOpacity>

          {/* Value Display */}
          <View style={styles.stepValueBox}>
            <Text style={styles.stepValueText}>{product.stock}</Text>
          </View>

          {/* Plus Button */}
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onIncrement(product.id)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel={`Tambah stok ${product.name}`}
          >
            <AppIcon name="plus" size={16} color={WarungkuColors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailsCol: {
    flex: 1,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeOut: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  statusBadgeLow: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FFE0B2',
  },
  statusBadgeAvailable: {
    backgroundColor: '#D4F8E8',
    borderColor: '#A7F3D0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextOut: {
    color: WarungkuColors.error,
  },
  statusTextLow: {
    color: WarungkuColors.secondary,
  },
  statusTextAvailable: {
    color: WarungkuColors.success,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  stockDisplayBox: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minWidth: 84,
  },
  stockDisplayBoxOut: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  stockDisplayBoxLow: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FFE0B2',
  },
  stockDisplayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
  },
  stockDisplayNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.5,
    marginVertical: 1,
  },
  stockNumberOut: {
    color: WarungkuColors.error,
  },
  stockNumberLow: {
    color: WarungkuColors.secondary,
  },
  tapToEditHint: {
    fontSize: 9,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: WarungkuColors.surfaceContainer,
    marginVertical: 12,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WarungkuColors.surfaceLow,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minHeight: 44,
  },
  directEditText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 9,
    backgroundColor: WarungkuColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  stepBtnDisabled: {
    backgroundColor: WarungkuColors.surfaceContainer,
    elevation: 0,
    shadowOpacity: 0,
  },
  stepValueBox: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  stepValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: WarungkuColors.text,
  },
});
