import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { PaymentMethodSummary, formatRupiahCompact } from '@/constants/report-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ReportPaymentMethodsProps {
  methods: PaymentMethodSummary[];
}

export function ReportPaymentMethods({ methods }: ReportPaymentMethodsProps) {
  if (!methods || methods.length === 0) {
    return null;
  }

  const tunaiItem = methods.find((m) => m.method === 'Tunai');
  const qrisItem = methods.find((m) => m.method === 'QRIS');

  const tunaiPercentage = tunaiItem ? tunaiItem.percentage : 50;
  const qrisPercentage = qrisItem ? qrisItem.percentage : 50;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Metode Pembayaran</Text>
          <Text style={styles.cardSubtitle}>Distribusi cara pembayaran</Text>
        </View>
        <View style={styles.badge}>
          <AppIcon name="wallet" size={14} color={WarungkuColors.primary} />
          <Text style={styles.badgeText}>Metode</Text>
        </View>
      </View>

      {/* Progress Bar Track */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressSegmentTunai,
            { flex: tunaiPercentage },
          ]}
        />
        <View
          style={[
            styles.progressSegmentQRIS,
            { flex: qrisPercentage },
          ]}
        />
      </View>

      {/* Method Detail Cards */}
      <View style={styles.detailsRow}>
        {/* Tunai */}
        <View style={styles.methodBox}>
          <View style={styles.methodHeader}>
            <View style={[styles.colorDot, { backgroundColor: WarungkuColors.primary }]} />
            <Text style={styles.methodTitle}>Tunai</Text>
            <View style={styles.pctBadge}>
              <Text style={styles.pctText}>{tunaiPercentage}%</Text>
            </View>
          </View>
          <Text style={styles.transactionCount}>
            {tunaiItem ? tunaiItem.count : 0} transaksi
          </Text>
          <Text style={styles.amountText}>
            {tunaiItem ? formatRupiahCompact(tunaiItem.totalAmount) : 'Rp0'}
          </Text>
        </View>

        {/* QRIS */}
        <View style={styles.methodBox}>
          <View style={styles.methodHeader}>
            <View style={[styles.colorDot, { backgroundColor: WarungkuColors.secondaryContainer }]} />
            <Text style={styles.methodTitle}>QRIS</Text>
            <View style={[styles.pctBadge, styles.pctBadgeQRIS]}>
              <Text style={[styles.pctText, styles.pctTextQRIS]}>{qrisPercentage}%</Text>
            </View>
          </View>
          <Text style={styles.transactionCount}>
            {qrisItem ? qrisItem.count : 0} transaksi
          </Text>
          <Text style={styles.amountText}>
            {qrisItem ? formatRupiahCompact(qrisItem.totalAmount) : 'Rp0'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: WarungkuColors.primary,
  },
  progressBarTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 14,
  },
  progressSegmentTunai: {
    backgroundColor: WarungkuColors.primary,
  },
  progressSegmentQRIS: {
    backgroundColor: WarungkuColors.secondaryContainer,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  methodBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.text,
    flex: 1,
  },
  pctBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pctText: {
    fontSize: 10,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  pctBadgeQRIS: {
    backgroundColor: '#FEF3E6',
  },
  pctTextQRIS: {
    color: WarungkuColors.secondaryContainer,
  },
  transactionCount: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 2,
  },
  amountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
