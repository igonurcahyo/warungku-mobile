import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah, getStockStatus } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ProductManagementCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductManagementCard({
  product,
  onEdit,
  onDelete,
}: ProductManagementCardProps) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <View style={styles.card}>
      {/* Top Details Row: Name, Category, Stock Status */}
      <View style={styles.topRow}>
        <View style={styles.infoCol}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            {/* Stock Status Badge */}
            <View
              style={[
                styles.stockBadge,
                stockStatus.type === 'out' && styles.stockBadgeOut,
                stockStatus.type === 'low' && styles.stockBadgeLow,
                stockStatus.type === 'available' && styles.stockBadgeAvailable,
              ]}
            >
              {stockStatus.type === 'low' && (
                <AppIcon name="alert-triangle" size={11} color={WarungkuColors.secondary} />
              )}
              <Text
                style={[
                  styles.stockBadgeText,
                  stockStatus.type === 'out' && styles.stockTextOut,
                  stockStatus.type === 'low' && styles.stockTextLow,
                  stockStatus.type === 'available' && styles.stockTextAvailable,
                ]}
              >
                {stockStatus.label} ({product.stock})
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Product Price */}
          <Text style={styles.productPrice}>
            {formatRupiah(product.price)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Action Buttons: Edit & Hapus */}
      <View style={styles.actionRow}>
        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.75}
          onPress={() => onEdit(product)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${product.name}`}
        >
          <AppIcon name="edit" size={16} color={WarungkuColors.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.75}
          onPress={() => onDelete(product)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          accessibilityRole="button"
          accessibilityLabel={`Hapus ${product.name}`}
        >
          <AppIcon name="trash" size={16} color={WarungkuColors.error} />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  stockBadgeOut: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  stockBadgeLow: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FFE0B2',
  },
  stockBadgeAvailable: {
    backgroundColor: '#D4F8E8',
    borderColor: '#A7F3D0',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockTextOut: {
    color: WarungkuColors.error,
  },
  stockTextLow: {
    color: WarungkuColors.secondary,
  },
  stockTextAvailable: {
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
    fontSize: 17,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: WarungkuColors.surfaceContainer,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minHeight: 44,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFEDEA',
    borderWidth: 1,
    borderColor: '#FFDAD6',
    minHeight: 44,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.error,
  },
});
