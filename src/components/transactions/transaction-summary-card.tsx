import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { formatRupiahCompact } from '@/constants/transaction-data';
import { AppIcon } from '@/components/ui/app-icon';

interface TransactionSummaryProps {
  totalTransactions: number;
  totalSales: number;
}

export function TransactionSummaryCard({
  totalTransactions,
  totalSales,
}: TransactionSummaryProps) {
  return (
    <View style={styles.container}>
      {/* 1. Total Transaksi */}
      <View style={styles.summaryCard}>
        <View style={styles.cardTopRow}>
          <Text style={styles.label}>Total Transaksi</Text>
          <View style={styles.iconCircle}>
            <AppIcon name="receipt" size={14} color={WarungkuColors.primary} />
          </View>
        </View>
        <Text style={styles.value}>{totalTransactions}</Text>
        <Text style={styles.subtext}>Nota tercatat</Text>
      </View>

      {/* 2. Total Penjualan */}
      <View style={[styles.summaryCard, styles.salesCard]}>
        <View style={styles.cardTopRow}>
          <Text style={styles.label}>Total Penjualan</Text>
          <View style={[styles.iconCircle, styles.salesIconCircle]}>
            <AppIcon name="wallet" size={14} color={WarungkuColors.primary} />
          </View>
        </View>
        <Text style={styles.salesValue}>{formatRupiahCompact(totalSales)}</Text>
        <Text style={styles.subtext}>Nilai transaksi</Text>
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
  summaryCard: {
    flex: 1,
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  salesCard: {
    borderLeftWidth: 3.5,
    borderLeftColor: WarungkuColors.primary,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salesIconCircle: {
    backgroundColor: WarungkuColors.surfaceContainer,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  salesValue: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.4,
  },
  subtext: {
    fontSize: 11,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
});
