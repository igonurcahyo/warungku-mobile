import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Transaction, formatRupiahCompact } from '@/constants/transaction-data';
import { AppIcon } from '@/components/ui/app-icon';

interface TransactionDetailModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailModal({
  visible,
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const isLunas = transaction.paymentStatus === 'Lunas';
  const isQRIS = transaction.paymentMethod === 'QRIS';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouch} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Detail Transaksi</Text>
              <Text style={styles.sheetSubtitle}>Rincian nota penjualan</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Tutup detail transaksi"
            >
              <AppIcon name="x" size={18} color={WarungkuColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Overview Card */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewTop}>
                <View>
                  <Text style={styles.trxNumber}>#{transaction.id}</Text>
                  <Text style={styles.trxDate}>{transaction.dateDisplay}</Text>
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

              {/* Payment Method Row */}
              <View style={styles.methodRow}>
                <Text style={styles.metaLabel}>Metode Pembayaran:</Text>
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
              </View>
            </View>

            {/* Products Breakdown Table */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionHeader}>Daftar Produk</Text>

              <View style={styles.itemsCard}>
                {transaction.items.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.itemRow,
                      idx < transaction.items.length - 1 && styles.itemRowBorder,
                    ]}
                  >
                    <View style={styles.itemLeft}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemCalculation}>
                        {item.quantity} × {formatRupiahCompact(item.price)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtotal}>
                      {formatRupiahCompact(item.subtotal)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Total Section */}
            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
                <Text style={styles.totalValue}>
                  {formatRupiahCompact(transaction.total)}
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBottomBtn}
              activeOpacity={0.85}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.closeBottomBtnText}>Tutup</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: WarungkuColors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: WarungkuColors.outlineVariant,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WarungkuColors.surfaceContainer,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  overviewCard: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    marginBottom: 16,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trxNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  trxDate: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
    fontWeight: '500',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: WarungkuColors.outlineVariant,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: WarungkuColors.card,
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
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
  itemsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  itemsCard: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 16,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: WarungkuColors.surfaceContainer,
  },
  itemLeft: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  itemCalculation: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
    fontWeight: '500',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  totalCard: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: WarungkuColors.primary,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.4,
  },
  closeBottomBtn: {
    backgroundColor: WarungkuColors.primary,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBottomBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.2,
  },
});
