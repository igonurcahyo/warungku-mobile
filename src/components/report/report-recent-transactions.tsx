import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { ReportTransaction, formatRupiahCompact } from '@/constants/report-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ReportRecentTransactionsProps {
  transactions: ReportTransaction[];
}

export function ReportRecentTransactions({ transactions }: ReportRecentTransactionsProps) {
  const router = useRouter();

  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Transaksi Terbaru</Text>
          <Text style={styles.cardSubtitle}>Penjualan terkini periode ini</Text>
        </View>
        <TouchableOpacity
          style={styles.seeAllBtn}
          activeOpacity={0.7}
          onPress={() => router.navigate('/(tabs)/transactions')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAllText}>Lihat Semua</Text>
          <AppIcon name="chevron-right" size={14} color={WarungkuColors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {transactions.map((trx, index) => {
          const isQRIS = trx.paymentMethod === 'QRIS';

          return (
            <View
              key={trx.id}
              style={[
                styles.trxItem,
                index < transactions.length - 1 && styles.itemSeparator,
              ]}
            >
              {/* Left Column: ID & Date */}
              <View style={styles.leftCol}>
                <View style={styles.idRow}>
                  <Text style={styles.idText}>#{trx.id}</Text>
                  <View
                    style={[
                      styles.methodBadge,
                      isQRIS ? styles.methodBadgeQRIS : styles.methodBadgeTunai,
                    ]}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        isQRIS ? styles.methodTextQRIS : styles.methodTextTunai,
                      ]}
                    >
                      {trx.paymentMethod}
                    </Text>
                  </View>
                </View>
                <Text style={styles.dateText}>{trx.date}</Text>
              </View>

              {/* Right Column: Amount & Status */}
              <View style={styles.rightCol}>
                <Text style={styles.amountText}>{formatRupiahCompact(trx.total)}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{trx.paymentStatus}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#EAEFE9',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  listContainer: {
    gap: 2,
  },
  trxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftCol: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  idText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  methodBadgeTunai: {
    backgroundColor: '#E6F4EA',
  },
  methodBadgeQRIS: {
    backgroundColor: '#FEF3E6',
  },
  methodText: {
    fontSize: 10,
    fontWeight: '700',
  },
  methodTextTunai: {
    color: WarungkuColors.primary,
  },
  methodTextQRIS: {
    color: WarungkuColors.secondaryContainer,
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 2,
  },
  statusPill: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: WarungkuColors.primary,
  },
});
