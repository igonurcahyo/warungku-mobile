import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';
import {
  ReportPeriod,
  DUMMY_REPORT_DATA,
} from '@/constants/report-data';
import { ReportPeriodTabs } from '@/components/report/report-period-tabs';
import { ReportSummaryCards } from '@/components/report/report-summary-cards';
import { ReportSalesChart } from '@/components/report/report-sales-chart';
import { ReportTopProducts } from '@/components/report/report-top-products';
import { ReportPaymentMethods } from '@/components/report/report-payment-methods';
import { ReportRecentTransactions } from '@/components/report/report-recent-transactions';
import { ReportEmptyState } from '@/components/report/report-empty-state';

export default function ReportScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('Hari Ini');
  const [showEmptySim, setShowEmptySim] = useState(false);

  const reportData = DUMMY_REPORT_DATA[selectedPeriod];
  const isEmpty = showEmptySim || !reportData || reportData.transactionCount === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Mobile Ringkas */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Kembali"
          accessibilityRole="button"
        >
          <AppIcon name="arrow-left" size={20} color={WarungkuColors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Laporan Penjualan</Text>
          <Text style={styles.headerSubtitle}>Pantau penjualan warung</Text>
        </View>

        {/* Simulasi Empty State Button */}
        <TouchableOpacity
          style={[styles.simButton, showEmptySim && styles.simButtonActive]}
          activeOpacity={0.7}
          onPress={() => setShowEmptySim((prev) => !prev)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Toggle Empty State"
          accessibilityRole="button"
        >
          <Text style={[styles.simButtonText, showEmptySim && styles.simButtonTextActive]}>
            {showEmptySim ? 'Isi' : 'Kosong'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Periode */}
        <View style={styles.periodContainer}>
          <ReportPeriodTabs
            selectedPeriod={selectedPeriod}
            onSelectPeriod={(period) => {
              setSelectedPeriod(period);
              if (showEmptySim) setShowEmptySim(false);
            }}
          />
        </View>

        {/* Konten Utama / Empty State */}
        {isEmpty ? (
          <ReportEmptyState />
        ) : (
          <View style={styles.contentSections}>
            {/* 1. Summary Penjualan */}
            <ReportSummaryCards
              totalSales={reportData.totalSales}
              transactionCount={reportData.transactionCount}
              averageTransaction={reportData.averageTransaction}
            />

            {/* 2. Grafik Penjualan */}
            <ReportSalesChart data={reportData.chartBars} />

            {/* 3. Produk Terlaris */}
            <ReportTopProducts products={reportData.topProducts} />

            {/* 4. Metode Pembayaran */}
            <ReportPaymentMethods methods={reportData.paymentMethods} />

            {/* 5. Transaksi Terbaru */}
            <ReportRecentTransactions transactions={reportData.recentTransactions} />
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: Platform.OS === 'ios' ? 40 : 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  simButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  simButtonActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  simButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  simButtonTextActive: {
    color: '#DC2626',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  periodContainer: {
    marginBottom: 4,
  },
  contentSections: {
    gap: 16,
  },
});
