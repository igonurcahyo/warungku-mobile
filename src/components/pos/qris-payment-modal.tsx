import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Transaction, formatRupiahCompact } from '@/constants/transaction-data';
import { AppIcon } from '@/components/ui/app-icon';
import { useStore } from '@/context/store-context';

interface QrisPaymentModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onPaidSuccess: (transaction: Transaction) => void;
}

export function QrisPaymentModal({
  visible,
  transaction,
  onClose,
  onPaidSuccess,
}: QrisPaymentModalProps) {
  const { markTransactionPaid } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when modal opens
  useEffect(() => {
    if (visible) {
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [visible]);

  if (!transaction) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Mark transaction as paid in store (single stock deduction guaranteed)
      markTransactionPaid(transaction.id);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 750);
  };

  const handleFinishSuccess = () => {
    setIsSuccess(false);
    onPaidSuccess(transaction);
  };

  const handleCancel = () => {
    // Closing keeps transaction pending and safely in store
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.backdropTouch} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          {isSuccess ? (
            /* SUCCESS VIEW */
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <AppIcon name="check-circle" size={44} color="#059669" />
              </View>

              <Text style={styles.successTitle}>Pembayaran Berhasil</Text>
              <Text style={styles.successSubtitle}>
                Transaksi #{transaction.id} telah lunas
              </Text>

              {/* Receipt Summary Card */}
              <View style={styles.receiptCard}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Total Pembayaran</Text>
                  <Text style={styles.receiptValueBold}>
                    {formatRupiahCompact(transaction.total)}
                  </Text>
                </View>

                <View style={styles.receiptDivider} />

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Metode</Text>
                  <View style={styles.methodPill}>
                    <AppIcon name="qr-code" size={12} color={WarungkuColors.primary} />
                    <Text style={styles.methodPillText}>QRIS</Text>
                  </View>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Status</Text>
                  <View style={styles.statusLunasPill}>
                    <Text style={styles.statusLunasText}>Lunas</Text>
                  </View>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Waktu</Text>
                  <Text style={styles.receiptValue}>{transaction.dateDisplay}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handleFinishSuccess}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Selesai</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* QRIS PAYMENT VIEW */
            <ScrollView
              style={styles.paymentScroll}
              contentContainerStyle={styles.paymentContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.sheetTitle}>Pembayaran QRIS</Text>
                  <Text style={styles.sheetSubtitle}>
                    Transaksi #{transaction.id}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={handleCancel}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Tutup QRIS"
                >
                  <AppIcon name="x" size={18} color={WarungkuColors.text} />
                </TouchableOpacity>
              </View>

              {/* Total Amount Hero */}
              <View style={styles.amountHero}>
                <Text style={styles.amountLabel}>Total Tagihan</Text>
                <Text style={styles.amountValue}>
                  {formatRupiahCompact(transaction.total)}
                </Text>
                <View style={styles.pendingBadge}>
                  <View style={styles.pendingDot} />
                  <Text style={styles.pendingBadgeText}>Menunggu Pembayaran</Text>
                </View>
              </View>

              {/* Simulated QR Code Card */}
              <View style={styles.qrCard}>
                <View style={styles.qrHeader}>
                  <Text style={styles.qrHeaderText}>QRIS WARUNGKU</Text>
                  <Text style={styles.qrSubheaderText}>Simulasi Pembayaran Digital</Text>
                </View>

                {/* The QR Matrix Pattern */}
                <View style={styles.qrFrame}>
                  {/* Top-Left Finder */}
                  <View style={[styles.finderBox, styles.finderTL]}>
                    <View style={styles.finderInner} />
                  </View>

                  {/* Top-Right Finder */}
                  <View style={[styles.finderBox, styles.finderTR]}>
                    <View style={styles.finderInner} />
                  </View>

                  {/* Bottom-Left Finder */}
                  <View style={[styles.finderBox, styles.finderBL]}>
                    <View style={styles.finderInner} />
                  </View>

                  {/* Center QR Matrix Grid Graphics */}
                  <View style={styles.qrCenterGraphic}>
                    <View style={styles.qrPatternRow}>
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                    </View>
                    <View style={styles.qrPatternRow}>
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                    </View>
                    <View style={styles.qrPatternRow}>
                      <View style={styles.qrDot} />
                      <View style={styles.qrDot} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={styles.qrDot} />
                    </View>
                    <View style={styles.qrPatternRow}>
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                      <View style={[styles.qrDot, styles.qrDotEmpty]} />
                      <View style={styles.qrDot} />
                    </View>
                  </View>

                  {/* Center Logo Stamp */}
                  <View style={styles.qrCenterStamp}>
                    <AppIcon name="qr-code" size={20} color={WarungkuColors.primary} />
                  </View>
                </View>

                <Text style={styles.qrFooterText}>NMID: ID1029384756 (Simulasi)</Text>
              </View>

              <Text style={styles.scanInstruction}>
                Scan QRIS untuk menyelesaikan pembayaran.
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionButtonsCol}>
                <TouchableOpacity
                  style={[styles.primaryButton, isProcessing && styles.buttonDisabled]}
                  activeOpacity={0.8}
                  onPress={handlePayNow}
                  disabled={isProcessing}
                  accessibilityRole="button"
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <AppIcon name="check" size={18} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Saya Sudah Bayar</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.75}
                  onPress={handleCancel}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Batalkan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  paymentScroll: {
    maxHeight: '100%',
  },
  paymentContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountHero: {
    alignItems: 'center',
    backgroundColor: '#F7FAF6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: WarungkuColors.secondaryContainer,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryContainer,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  qrHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: 0.5,
  },
  qrSubheaderText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  qrFrame: {
    width: 170,
    height: 170,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  finderBox: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderWidth: 4,
    borderColor: '#1F2937',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finderInner: {
    width: 18,
    height: 18,
    backgroundColor: '#1F2937',
    borderRadius: 3,
  },
  finderTL: {
    top: 8,
    left: 8,
  },
  finderTR: {
    top: 8,
    right: 8,
  },
  finderBL: {
    bottom: 8,
    left: 8,
  },
  qrCenterGraphic: {
    width: 90,
    gap: 6,
  },
  qrPatternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrDot: {
    width: 8,
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
  qrDotEmpty: {
    backgroundColor: 'transparent',
  },
  qrCenterStamp: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: WarungkuColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrFooterText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 10,
    fontWeight: '600',
  },
  scanInstruction: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },
  actionButtonsCol: {
    gap: 10,
  },
  primaryButton: {
    height: 48,
    backgroundColor: WarungkuColors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  /* SUCCESS STYLES */
  successContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  receiptLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  receiptValue: {
    fontSize: 13,
    color: WarungkuColors.text,
    fontWeight: '600',
  },
  receiptValueBold: {
    fontSize: 16,
    color: WarungkuColors.primary,
    fontWeight: '800',
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  methodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  statusLunasPill: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusLunasText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
