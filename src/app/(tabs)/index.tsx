import React from 'react';
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

// Static Dummy Data for Recent Transactions
const RECENT_TRANSACTIONS = [
  {
    id: 'TRX-001',
    time: '11 Sep 2026 • 10:30',
    amount: 'Rp 45.000',
    status: 'Lunas',
  },
  {
    id: 'TRX-002',
    time: '11 Sep 2026 • 09:15',
    amount: 'Rp 120.000',
    status: 'Lunas',
  },
  {
    id: 'TRX-003',
    time: '11 Sep 2026 • 08:40',
    amount: 'Rp 32.500',
    status: 'Lunas',
  },
];

// Static Dummy Data for Low Stock Items
const LOW_STOCK_ITEMS = [
  {
    id: '1',
    name: 'Indomie Goreng',
    category: 'Makanan Instan',
    stock: 3,
  },
  {
    id: '2',
    name: 'Aqua 600ml',
    category: 'Minuman',
    stock: 2,
  },
  {
    id: '3',
    name: 'Teh Pucuk',
    category: 'Minuman',
    stock: 4,
  },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Mobile Top Header */}
      <DashboardHeader />

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
          <TouchableOpacity
            style={[styles.summaryCard, styles.salesCard]}
            activeOpacity={0.8}
            onPress={() => router.navigate('/report')}
            accessibilityLabel="Lihat Laporan Penjualan"
            accessibilityRole="button"
          >
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Penjualan Hari Ini</Text>
              <View style={styles.summaryIconBadge}>
                <AppIcon name="wallet" size={16} color={WarungkuColors.primary} />
              </View>
            </View>
            <Text style={styles.summaryValuePrimary}>Rp 1.250.000</Text>
            <View style={styles.summaryCardFooter}>
              <Text style={styles.summarySubtext}>Ringkasan kasir hari ini</Text>
              <Text style={styles.summaryLinkText}>Laporan →</Text>
            </View>
          </TouchableOpacity>

          {/* Transaksi Hari Ini */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Transaksi Hari Ini</Text>
              <View style={styles.summaryIconBadge}>
                <AppIcon name="receipt" size={16} color={WarungkuColors.primaryContainer} />
              </View>
            </View>
            <Text style={styles.summaryValue}>24</Text>
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
            <Text style={styles.summaryValue}>128</Text>
            <Text style={styles.summarySubtext}>Item terdaftar aktif</Text>
          </View>

          {/* Stok Menipis */}
          <View style={[styles.summaryCard, styles.warningCardBorder]}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Stok Menipis</Text>
              <View style={styles.warningIconBadge}>
                <AppIcon name="alert-triangle" size={15} color={WarungkuColors.secondaryContainer} />
              </View>
            </View>
            <View style={styles.warningValueRow}>
              <Text style={styles.warningValue}>5</Text>
              <View style={styles.warningPill}>
                <Text style={styles.warningPillText}>Perlu Restock</Text>
              </View>
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
            {RECENT_TRANSACTIONS.map((trx, index) => (
              <View
                key={trx.id}
                style={[
                  styles.transactionItem,
                  index < RECENT_TRANSACTIONS.length - 1 && styles.itemSeparator,
                ]}
              >
                <View style={styles.trxLeft}>
                  <View style={styles.trxIconWrapper}>
                    <AppIcon name="receipt" size={18} color={WarungkuColors.primary} />
                  </View>
                  <View>
                    <Text style={styles.trxIdText}>{trx.id}</Text>
                    <Text style={styles.trxTimeText}>{trx.time}</Text>
                  </View>
                </View>

                <View style={styles.trxRight}>
                  <Text style={styles.trxAmountText}>{trx.amount}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{trx.status}</Text>
                  </View>
                </View>
              </View>
            ))}
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
            {LOW_STOCK_ITEMS.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.stockItem,
                  index < LOW_STOCK_ITEMS.length - 1 && styles.itemSeparator,
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

                <View style={styles.stockBadge}>
                  <AppIcon name="alert-triangle" size={12} color={WarungkuColors.secondaryContainer} />
                  <Text style={styles.stockBadgeText}>Stok {item.stock}</Text>
                </View>
              </View>
            ))}
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
  salesCard: {
    borderColor: WarungkuColors.outlineVariant,
    borderLeftWidth: 3.5,
    borderLeftColor: WarungkuColors.primary,
  },
  warningCardBorder: {
    borderLeftWidth: 3.5,
    borderLeftColor: WarungkuColors.secondaryContainer,
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
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.success,
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
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondary,
  },
  bottomSpacer: {
    height: 32,
  },
});
