import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WarungkuColors } from '@/constants/colors';
import {
  DUMMY_TRANSACTIONS,
  Transaction,
  DateFilterType,
} from '@/constants/transaction-data';
import { AppIcon } from '@/components/ui/app-icon';
import { TransactionSummaryCard } from '@/components/transactions/transaction-summary-card';
import { TransactionFilterTabs } from '@/components/transactions/transaction-filter-tabs';
import { TransactionCard } from '@/components/transactions/transaction-card';
import { TransactionDetailModal } from '@/components/transactions/transaction-detail-modal';

export default function TransactionsScreen() {
  // Local state for transactions
  const [transactions] = useState<Transaction[]>(DUMMY_TRANSACTIONS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<DateFilterType>('Semua');

  // Detail modal state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Reference date: 11 September 2026
  const REFERENCE_DATE = useMemo(() => new Date('2026-09-11T23:59:59'), []);

  // Filter helper by date
  const isWithinFilterDate = (dateISO: string, filter: DateFilterType): boolean => {
    if (filter === 'Semua') return true;

    const trxDate = new Date(dateISO);
    const diffMs = REFERENCE_DATE.getTime() - trxDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (filter === 'Hari Ini') {
      return diffDays >= 0 && diffDays < 1;
    }
    if (filter === '7 Hari') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (filter === '30 Hari') {
      return diffDays >= 0 && diffDays <= 30;
    }
    return true;
  };

  // Counts per filter tab
  const filterCounts = useMemo(() => {
    let hariIniCount = 0;
    let tujuhHariCount = 0;
    let tigaPuluhHariCount = 0;

    transactions.forEach((trx) => {
      if (isWithinFilterDate(trx.dateISO, 'Hari Ini')) hariIniCount += 1;
      if (isWithinFilterDate(trx.dateISO, '7 Hari')) tujuhHariCount += 1;
      if (isWithinFilterDate(trx.dateISO, '30 Hari')) tigaPuluhHariCount += 1;
    });

    return {
      semua: transactions.length,
      hariIni: hariIniCount,
      tujuhHari: tujuhHariCount,
      tigaPuluhHari: tigaPuluhHariCount,
    };
  }, [transactions]);

  // Realtime search & date filtered transactions
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return transactions.filter((trx) => {
      // Date filter check
      if (!isWithinFilterDate(trx.dateISO, selectedFilter)) {
        return false;
      }

      // Search filter check
      if (!query) return true;

      // 1. Check ID (e.g. TRX-00125 or 00125)
      const matchesId = trx.id.toLowerCase().includes(query);

      // 2. Check payment method (e.g. Tunai or QRIS)
      const matchesMethod = trx.paymentMethod.toLowerCase().includes(query);

      // 3. Check product names in items
      const matchesProduct = trx.items.some((item) =>
        item.productName.toLowerCase().includes(query)
      );

      return matchesId || matchesMethod || matchesProduct;
    });
  }, [transactions, searchQuery, selectedFilter]);

  // Aggregate metrics for currently filtered list
  const totalSales = useMemo(() => {
    return filteredTransactions.reduce((acc, trx) => acc + trx.total, 0);
  }, [filteredTransactions]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Riwayat Transaksi</Text>
          <Text style={styles.headerSubtitle}>Lihat transaksi penjualan</Text>
        </View>
      </View>

      {/* Summary Cards */}
      <TransactionSummaryCard
        totalTransactions={filteredTransactions.length}
        totalSales={totalSales}
      />

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={18} color={WarungkuColors.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transaksi..."
            placeholderTextColor={WarungkuColors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Hapus pencarian"
              accessibilityRole="button"
            >
              <AppIcon name="x" size={14} color={WarungkuColors.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date Filter Tabs */}
      <TransactionFilterTabs
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        counts={filterCounts}
      />

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onPress={(trx) => setSelectedTransaction(trx)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <AppIcon name="receipt" size={32} color={WarungkuColors.secondaryText} />
              </View>
              <Text style={styles.emptyTitle}>Transaksi tidak ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Coba ubah pencarian atau filter.
              </Text>
              {(searchQuery.length > 0 || selectedFilter !== 'Semua') && (
                <TouchableOpacity
                  style={styles.resetFilterBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedFilter('Semua');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetFilterBtnText}>Reset Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        }
      />

      {/* Detail Transaksi Modal */}
      <TransactionDetailModal
        visible={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WarungkuColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 14,
    color: WarungkuColors.text,
    fontWeight: '500',
  },
  clearSearchButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  resetFilterBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
});
