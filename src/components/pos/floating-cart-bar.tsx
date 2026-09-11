import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { formatRupiah } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface FloatingCartBarProps {
  itemCount: number;
  totalPrice: number;
  onPress: () => void;
}

export function FloatingCartBar({
  itemCount,
  totalPrice,
  onPress,
}: FloatingCartBarProps) {
  if (itemCount === 0) return null;

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.cartBar}
        activeOpacity={0.85}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Keranjang belanja, ${itemCount} item, total ${formatRupiah(totalPrice)}. Tekan untuk melihat keranjang.`}
      >
        {/* Left Side: Cart Icon + Count + Subtotal */}
        <View style={styles.leftContent}>
          <View style={styles.cartIconWrapper}>
            <AppIcon name="cart" size={20} color={WarungkuColors.onPrimary} focused />
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{itemCount}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.itemCountText}>{itemCount} Item</Text>
            <Text style={styles.totalPriceText}>{formatRupiah(totalPrice)}</Text>
          </View>
        </View>

        {/* Right Side: Action Button Text */}
        <View style={styles.rightAction}>
          <Text style={styles.actionText}>Lihat Keranjang</Text>
          <AppIcon name="chevron-right" size={14} color={WarungkuColors.onPrimary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    zIndex: 99,
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WarungkuColors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: WarungkuColors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: WarungkuColors.secondaryContainer,
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: WarungkuColors.primary,
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.outlineVariant,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: WarungkuColors.onPrimary,
    letterSpacing: -0.3,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WarungkuColors.primaryContainer,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
  },
});
