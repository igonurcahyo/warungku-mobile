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
  onResumePayment?: (transaction: Transaction) => void;
  onCancelPayment?: (transaction: Transaction) => void;
}

export function TransactionDetailModal({
  visible,
  transaction,
  onClose,
  onResumePayment,
  onCancelPayment,
}: TransactionDetailModalProps) {
  const [showCancelModal, setShowCancelModal] = React.useState(false);

  if (!transaction) return null;

  const isLunas = transaction.paymentStatus === 'Lunas';
  const isPending = transaction.paymentStatus === 'Menunggu Pembayaran';
  const isCancelled = transaction.paymentStatus === 'Dibatalkan';
  const isQRIS = transaction.paymentMethod === 'QRIS';

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    if (onCancelPayment) {
      onCancelPayment(transaction);
    }
  };

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
                    isLunas && styles.statusBadgeLunas,
                    isPending && styles.statusBadgePending,
                    isCancelled && styles.statusBadgeCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isLunas && styles.statusTextLunas,
                      isPending && styles.statusTextPending,
                      isCancelled && styles.statusTextCancelled,
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
              <Text style={styles.sectionHeader}>
                Daftar Produk ({transaction.items.length})
              </Text>

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

            {/* Action Buttons */}
            {isPending ? (
              <View style={styles.pendingActionButtons}>
                <TouchableOpacity
                  style={styles.resumePaymentBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    onClose();
                    if (onResumePayment) onResumePayment(transaction);
                  }}
                  accessibilityRole="button"
                >
                  <AppIcon name="qr-code" size={18} color="#FFFFFF" />
                  <Text style={styles.resumePaymentBtnText}>
                    Lanjutkan Pembayaran
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelPaymentBtn}
                  activeOpacity={0.75}
                  onPress={() => setShowCancelModal(true)}
                  accessibilityRole="button"
                >
                  <AppIcon name="trash" size={16} color="#DC2626" />
                  <Text style={styles.cancelPaymentBtnText}>
                    Batalkan Pembayaran
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeBottomBtn}
                  activeOpacity={0.85}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.closeBottomBtnText}>Tutup</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Close Button for non-pending */
              <TouchableOpacity
                style={styles.closeBottomBtn}
                activeOpacity={0.85}
                onPress={onClose}
                accessibilityRole="button"
              >
                <Text style={styles.closeBottomBtnText}>Tutup</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Confirmation Dialog for Batalkan Pembayaran */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.cancelModalOverlay}>
          <View style={styles.cancelModalCard}>
            <View style={styles.cancelModalIconBox}>
              <AppIcon name="alert-triangle" size={24} color="#DC2626" />
            </View>
            <Text style={styles.cancelModalTitle}>Batalkan Pembayaran?</Text>
            <Text style={styles.cancelModalMessage}>
              Transaksi #{transaction.id} akan berstatus &quot;Dibatalkan&quot; dan tetap tersimpan di Riwayat.
            </Text>
            <View style={styles.cancelModalActions}>
              <TouchableOpacity
                style={styles.cancelModalBackBtn}
                activeOpacity={0.7}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.cancelModalBackText}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelModalConfirmBtn}
                activeOpacity={0.8}
                onPress={handleConfirmCancel}
              >
                <Text style={styles.cancelModalConfirmText}>Ya, Batalkan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  statusBadgeCancelled: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
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
  statusTextCancelled: {
    color: '#DC2626',
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
  pendingActionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  resumePaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: WarungkuColors.primary,
    height: 50,
    borderRadius: 14,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  resumePaymentBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelPaymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelPaymentBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  closeBottomBtn: {
    backgroundColor: '#F3F4F6',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  closeBottomBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  cancelModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cancelModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cancelModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cancelModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  cancelModalMessage: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  cancelModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelModalBackBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  cancelModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelModalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
