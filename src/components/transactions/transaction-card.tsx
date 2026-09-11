import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Transaction, formatRupiahCompact } from '@/constants/transaction-data';
import { AppIcon } from '@/components/ui/app-icon';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isLunas = transaction.paymentStatus === 'Lunas';
  const isQRIS = transaction.paymentMethod === 'QRIS';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={() => onPress(transaction)}
      accessibilityRole="button"
      accessibilityLabel={`Transaksi ${transaction.id}, total ${formatRupiahCompact(transaction.total)}, status ${transaction.paymentStatus}`}
    >
      {/* Top Header Row: ID & Date */}
      <View style={styles.headerRow}>
        <View style={styles.idGroup}>
          <View style={styles.receiptIconBox}>
            <AppIcon name="receipt" size={15} color={WarungkuColors.primary} />
          </View>
          <Text style={styles.trxId}>#{transaction.id}</Text>
        </View>
        <Text style={styles.trxDate}>{transaction.dateDisplay}</Text>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsPreview}>
        {transaction.items.map((item, idx) => (
          <Text key={idx} style={styles.itemLine} numberOfLines={1}>
            {item.productName}{' '}
            <Text style={styles.itemQuantity}>× {item.quantity}</Text>
          </Text>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Summary Row: Total & Badges */}
      <View style={styles.bottomRow}>
        {/* Total Price */}
        <View>
          <Text style={styles.totalLabel}>Total Penjualan</Text>
          <Text style={styles.totalAmount}>
            {formatRupiahCompact(transaction.total)}
          </Text>
        </View>

        {/* Badges: Payment Method & Payment Status */}
        <View style={styles.badgesGroup}>
          {/* Method Badge */}
          <View style={[styles.methodBadge, isQRIS && styles.qrisBadge]}>
            <AppIcon
              name={isQRIS ? 'qr-code' : 'wallet'}
              size={12}
              color={isQRIS ? WarungkuColors.primary : WarungkuColors.secondaryText}
            />
            <Text
              style={[
                styles.methodBadgeText,
                isQRIS && styles.qrisBadgeText,
              ]}
            >
              {transaction.paymentMethod}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              isLunas ? styles.statusBadgeLunas : styles.statusBadgePending,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isLunas ? styles.statusTextLunas : styles.statusTextPending,
              ]}
            >
              {transaction.paymentStatus}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  receiptIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trxId: {
    fontSize: 16,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  trxDate: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    fontWeight: '500',
  },
  itemsPreview: {
    paddingLeft: 36,
    gap: 2,
    marginBottom: 6,
  },
  itemLine: {
    fontSize: 13,
    color: WarungkuColors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: WarungkuColors.surfaceContainer,
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: WarungkuColors.secondaryText,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  badgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: WarungkuColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  qrisBadge: {
    backgroundColor: WarungkuColors.surfaceContainer,
    borderColor: WarungkuColors.primaryContainer,
  },
  methodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  qrisBadgeText: {
    color: WarungkuColors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeLunas: {
    backgroundColor: WarungkuColors.successContainer,
    borderColor: '#A7F3D0',
  },
  statusBadgePending: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FFE0B2',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextLunas: {
    color: WarungkuColors.success,
  },
  statusTextPending: {
    color: WarungkuColors.secondary,
  },
});
