import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';
import { formatRupiahCompact } from '@/constants/report-data';

interface ReportSummaryCardsProps {
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
}

export function ReportSummaryCards({
  totalSales,
  transactionCount,
  averageTransaction,
}: ReportSummaryCardsProps) {
  return (
    <View style={styles.container}>
      {/* Card Utama: Total Penjualan */}
      <View style={[styles.card, styles.heroCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.heroLabel}>Total Penjualan</Text>
          <View style={styles.heroIconBadge}>
            <AppIcon name="wallet" size={18} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.heroValue}>{formatRupiahCompact(totalSales)}</Text>
        <Text style={styles.heroSubtext}>Total nilai transaksi penjualan</Text>
      </View>

      {/* Row: Jumlah Transaksi & Rata-rata Transaksi */}
      <View style={styles.row}>
        {/* Card: Jumlah Transaksi */}
        <View style={[styles.card, styles.subCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.subLabel}>Transaksi</Text>
            <View style={[styles.subIconBadge, { backgroundColor: '#E6F4EA' }]}>
              <AppIcon name="receipt" size={15} color={WarungkuColors.primary} />
            </View>
          </View>
          <Text style={styles.subValue}>{transactionCount}</Text>
          <Text style={styles.subSubtext}>Jumlah Transaksi</Text>
        </View>

        {/* Card: Rata-rata Transaksi */}
        <View style={[styles.card, styles.subCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.subLabel}>Rata-rata</Text>
            <View style={[styles.subIconBadge, { backgroundColor: '#FEF3E6' }]}>
              <AppIcon name="bar-chart" size={15} color={WarungkuColors.secondaryContainer} />
            </View>
          </View>
          <Text style={styles.subValue}>{formatRupiahCompact(averageTransaction)}</Text>
          <Text style={styles.subSubtext}>Rata-rata Transaksi</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  heroCard: {
    backgroundColor: WarungkuColors.primary,
    borderColor: WarungkuColors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A7F3D0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtext: {
    fontSize: 12,
    color: '#D1FAE5',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  subCard: {
    flex: 1,
    padding: 14,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  subIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subValue: {
    fontSize: 18,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginTop: 2,
    marginBottom: 2,
  },
  subSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
