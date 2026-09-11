import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';

interface StockSummaryProps {
  totalCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export function StockSummaryCard({
  totalCount,
  lowStockCount,
  outOfStockCount,
}: StockSummaryProps) {
  return (
    <View style={styles.container}>
      {/* 1. Total Produk */}
      <View style={styles.metricCard}>
        <View style={styles.metricTopRow}>
          <Text style={styles.metricLabel}>Total</Text>
          <View style={[styles.iconDot, { backgroundColor: WarungkuColors.surfaceContainer }]}>
            <AppIcon name="box" size={13} color={WarungkuColors.primary} />
          </View>
        </View>
        <Text style={styles.metricValue}>{totalCount}</Text>
        <Text style={styles.metricSubtext}>Produk</Text>
      </View>

      {/* 2. Stok Menipis */}
      <View style={[styles.metricCard, styles.warningBorder]}>
        <View style={styles.metricTopRow}>
          <Text style={styles.metricLabel}>Menipis</Text>
          <View style={[styles.iconDot, { backgroundColor: '#FFF4E6' }]}>
            <AppIcon name="alert-triangle" size={12} color={WarungkuColors.secondary} />
          </View>
        </View>
        <Text style={[styles.metricValue, { color: WarungkuColors.secondary }]}>
          {lowStockCount}
        </Text>
        <Text style={styles.metricSubtext}>1–5 unit</Text>
      </View>

      {/* 3. Stok Habis */}
      <View style={[styles.metricCard, styles.errorBorder]}>
        <View style={styles.metricTopRow}>
          <Text style={styles.metricLabel}>Habis</Text>
          <View style={[styles.iconDot, { backgroundColor: '#FFEDEA' }]}>
            <AppIcon name="alert-triangle" size={12} color={WarungkuColors.error} />
          </View>
        </View>
        <Text style={[styles.metricValue, { color: WarungkuColors.error }]}>
          {outOfStockCount}
        </Text>
        <Text style={styles.metricSubtext}>0 unit</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  metricCard: {
    flex: 1,
    backgroundColor: WarungkuColors.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  warningBorder: {
    borderLeftWidth: 3,
    borderLeftColor: WarungkuColors.secondaryContainer,
  },
  errorBorder: {
    borderLeftWidth: 3,
    borderLeftColor: WarungkuColors.error,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  iconDot: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  metricSubtext: {
    fontSize: 10,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
    fontWeight: '600',
  },
});
