import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { DashboardHeader } from '@/components/dashboard-header';
import { AppIcon } from '@/components/ui/app-icon';
import { formatRupiahCompact } from '@/constants/transaction-data';
import { useStore } from '@/context/store-context';

export default function DashboardScreen() {
  const router = useRouter();
  const { unreadCount, products, transactions } = useStore();

  // Metrics synced with store
  const totalProducts = products.length;
  const lowStockItems = useMemo(
    () => products.filter((p) => p.stock <= 5),
    [products]
  );
  const lowStockCount = lowStockItems.length;

  const todayTrx = useMemo(
    () => transactions.filter((t) => t.dateISO.startsWith('2026-09-11')),
    [transactions]
  );
  const todaySales = useMemo(
    () =>
      todayTrx
        .filter((t) => t.paymentStatus === 'Lunas')
        .reduce((sum, t) => sum + t.total, 0),
    [todayTrx]
  );
  const todayCount = todayTrx.length;

  const recentTransactions = useMemo(
    () => transactions.slice(0, 3),
    [transactions]
  );
  const lowStockDisplay = useMemo(
    () => lowStockItems.slice(0, 3),
    [lowStockItems]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Mobile Top Header */}
      <DashboardHeader
        notificationCount={unreadCount}
        onNotificationPress={() => router.navigate('/notifications')}
        onProfilePress={() => router.navigate('/settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Banner */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Selamat datang 👋</Text>
          <Text style={styles.greetingSubtitle}>
            Kelola warung Anda dengan mudah.
          </Text>
        </View>

        {/* Summary Cards Grid (2x2) */}
        <View style={styles.summaryGrid}>
          {/* Penjualan Hari Ini */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Penjualan Hari Ini</Text>
              <View style={styles.summaryIconBadge}>
                <AppIcon name="wallet" size={16} color={WarungkuColors.primary} />
              </View>
            </View>
            <Text style={styles.summaryValuePrimary}>{formatRupiahCompact(todaySales)}</Text>
            <Text style={styles.summarySubtext}>Ringkasan kasir hari ini</Text>
          </View>

          {/* Transaksi Hari Ini */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Transaksi Hari Ini</Text>
              <View style={styles.summaryIconBadge}>
                <AppIcon name="box" size={16} color={WarungkuColors.primary} />
              </View>
            </View>
            <Text style={styles.summaryValue}>{todayCount}</Text>
            <Text style={styles.summarySubtext}>Total nota tercatat</Text>
          </View>

          {/* Total Produk */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Produk</Text>
              <View style={styles.summaryIconBadge}>
                <AppIcon name="box" size={16} color={WarungkuColors.primary} />
              </View>
            </View>
            <Text style={styles.summaryValue}>{totalProducts}</Text>
            <Text style={styles.summarySubtext}>Item terdaftar aktif</Text>
          </View>

          {/* Stok Menipis */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Stok Menipis</Text>
              <View style={styles.warningIconBadge}>
                <AppIcon name="alert-triangle" size={15} color={WarungkuColors.primary} />
              </View>
            </View>
            <View style={styles.warningValueRow}>
              <Text style={styles.warningValue}>{lowStockCount}</Text>
              {lowStockCount > 0 && (
                <View style={styles.warningPill}>
                  <Text style={styles.warningPillText}>Perlu Restock</Text>
                </View>
              )}
            </View>
            <Text style={styles.summarySubtext}>Batas minimum stok</Text>
          </View>
        </View>

        {/* Quick Actions (Aksi Cepat) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.quickActionRow}>
            {/* Buka Kasir */}
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={() => router.navigate('/(tabs)/pos')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: WarungkuColors.primary }]}>
                <AppIcon name="pos" size={20} color={WarungkuColors.onPrimary} focused />
              </View>
              <Text style={styles.quickActionLabel}>Kasir</Text>
            </TouchableOpacity>

            {/* Kelola Produk */}
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={() => router.navigate('/(tabs)/products')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: WarungkuColors.primaryContainer }]}>
                <AppIcon name="products" size={20} color={WarungkuColors.onPrimary} focused />
              </View>
              <Text style={styles.quickActionLabel}>Produk</Text>
            </TouchableOpacity>

            {/* Kelola Stok */}
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={() => router.navigate('/(tabs)/stock')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: WarungkuColors.secondary }]}>
                <AppIcon name="stock" size={20} color={WarungkuColors.onPrimary} focused />
              </View>
              <Text style={styles.quickActionLabel}>Stok</Text>
            </TouchableOpacity>

            {/* Laporan Penjualan */}
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.75}
              onPress={() => router.navigate('/report')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#004532' }]}>
                <AppIcon name="bar-chart" size={20} color={WarungkuColors.onPrimary} focused />
              </View>
              <Text style={styles.quickActionLabel}>Laporan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions (Transaksi Terbaru) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              activeOpacity={0.7}
              onPress={() => router.navigate('/(tabs)/transactions')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
              <AppIcon name="chevron-right" size={12} color={WarungkuColors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.transactionListCard}>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyInlineCard}>
                <Text style={styles.emptyInlineText}>Belum ada transaksi</Text>
              </View>
            ) : (
              recentTransactions.map((trx, index) => (
                <View
                  key={trx.id}
                  style={[
                    styles.transactionItem,
                    index < recentTransactions.length - 1 && styles.itemSeparator,
                  ]}
                >
                  <View style={styles.trxLeft}>
                    <View style={styles.trxIconWrapper}>
                      <AppIcon name="receipt" size={18} color={WarungkuColors.primary} />
                    </View>
                    <View>
                      <Text style={styles.trxIdText}>{trx.id}</Text>
                      <Text style={styles.trxTimeText}>{trx.dateDisplay}</Text>
                    </View>
                  </View>

                  <View style={styles.trxRight}>
                    <Text style={styles.trxAmountText}>{formatRupiahCompact(trx.total)}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        trx.paymentStatus === 'Menunggu Pembayaran' && styles.statusBadgePending,
                        trx.paymentStatus === 'Dibatalkan' && styles.statusBadgeCancelled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          trx.paymentStatus === 'Menunggu Pembayaran' && styles.statusTextPending,
                          trx.paymentStatus === 'Dibatalkan' && styles.statusTextCancelled,
                        ]}
                      >
                        {trx.paymentStatus}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Low Stock (Stok Menipis) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Stok Menipis</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              activeOpacity={0.7}
              onPress={() => router.navigate('/(tabs)/stock')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.seeAllText}>Lihat Stok</Text>
              <AppIcon name="chevron-right" size={12} color={WarungkuColors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.stockListCard}>
            {lowStockDisplay.length === 0 ? (
              <View style={styles.emptyInlineCard}>
                <Text style={styles.emptyInlineText}>Semua stok produk aman</Text>
              </View>
            ) : (
              lowStockDisplay.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.stockItem,
                    index < lowStockDisplay.length - 1 && styles.itemSeparator,
                  ]}
                >
                  <View style={styles.stockLeft}>
                    <View style={styles.stockIconWrapper}>
                      <AppIcon name="box" size={18} color={WarungkuColors.secondaryText} />
                    </View>
                    <View>
                      <Text style={styles.stockNameText}>{item.name}</Text>
                      <Text style={styles.stockCategoryText}>{item.category}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.stockBadge,
                      item.stock === 0 && styles.stockBadgeOut,
                    ]}
                  >
                    <AppIcon
                      name="alert-triangle"
                      size={12}
                      color={item.stock === 0 ? WarungkuColors.error : WarungkuColors.secondaryContainer}
                    />
                    <Text
                      style={[
                        styles.stockBadgeText,
                        item.stock === 0 && styles.stockTextOut,
                      ]}
                    >
                      {item.stock === 0 ? 'Habis' : `Stok ${item.stock}`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Bottom spacing to ensure content is fully scrollable above tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WarungkuColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: WarungkuColors.secondaryText,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
    flex: 1,
  },
  summaryIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValuePrimary: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.5,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.5,
  },
  warningValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningValue: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.secondary,
    letterSpacing: -0.5,
  },
  warningPill: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  warningPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: WarungkuColors.secondary,
  },
  summarySubtext: {
    fontSize: 11,
    color: WarungkuColors.secondaryText,
    marginTop: 6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  summaryCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  summaryLinkText: {
    fontSize: 10,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: WarungkuColors.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minHeight: 90,
    justifyContent: 'center',
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.text,
    textAlign: 'center',
  },
  transactionListCard: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 16,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: WarungkuColors.surfaceContainer,
  },
  trxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trxIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trxIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  trxTimeText: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  trxRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  trxAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  statusBadge: {
    backgroundColor: WarungkuColors.successContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeCancelled: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.success,
  },
  statusTextPending: {
    color: '#B45309',
  },
  statusTextCancelled: {
    color: '#6B7280',
  },
  stockListCard: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 16,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stockIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  stockCategoryText: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  stockBadgeOut: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondary,
  },
  stockTextOut: {
    color: WarungkuColors.error,
  },
  emptyInlineCard: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyInlineText: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
});
