import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { CartItem, formatRupiah } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

type ModalStep = 'cart' | 'summary' | 'processing' | 'success';

interface CartModalProps {
  visible: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  onClose: () => void;
  onIncrementQuantity: (productId: string) => void;
  onDecrementQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const QUICK_NOMINALS = [10000, 20000, 50000, 100000];

export function CartModal({
  visible,
  cartItems,
  totalPrice,
  totalQuantity,
  onClose,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemoveItem,
  onClearCart,
}: CartModalProps) {
  const [step, setStep] = useState<ModalStep>('cart');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [cashInput, setCashInput] = useState<string>('');

  // Calculations for cash payment & change
  const change = cashGiven - totalPrice;
  const isShort = cashGiven > 0 && cashGiven < totalPrice;
  const isValidPayment = cashGiven >= totalPrice;
  const shortage = totalPrice - cashGiven;

  // Reset modal step and cash inputs when closing
  const handleClose = () => {
    setStep('cart');
    setCashGiven(0);
    setCashInput('');
    onClose();
  };

  // Handle manual input of buyer cash
  const handleCashInputChange = (text: string) => {
    const cleanDigits = text.replace(/[^0-9]/g, '');
    if (!cleanDigits) {
      setCashGiven(0);
      setCashInput('');
      return;
    }
    const numericVal = parseInt(cleanDigits, 10);
    setCashGiven(numericVal);
    setCashInput(formatRupiah(numericVal));
  };

  // Handle quick nominal tap (Uang Pas, 10k, 20k, 50k, 100k)
  const handleSelectNominal = (amount: number) => {
    setCashGiven(amount);
    setCashInput(formatRupiah(amount));
  };

  // Process simulated payment
  const handleConfirmPayment = () => {
    if (!isValidPayment) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 1000);
  };

  // Finish transaction and clean up
  const handleFinishTransaction = () => {
    onClearCart();
    setCashGiven(0);
    setCashInput('');
    setStep('cart');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback
            onPress={step === 'processing' ? undefined : handleClose}
          >
            <View style={styles.backdropTouch} />
          </TouchableWithoutFeedback>

          <View style={styles.sheetContainer}>
            {/* Top Handle Drag Indicator */}
            <View style={styles.handleBar} />

            {/* STEP 1: CART LIST VIEW */}
            {step === 'cart' && (
              <>
                {/* Header */}
                <View style={styles.sheetHeader}>
                  <View>
                    <Text style={styles.sheetTitle}>Keranjang Belanja</Text>
                    <Text style={styles.sheetSubtitle}>
                      {totalQuantity} produk dipilih
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeIconButton}
                    onPress={handleClose}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel="Tutup keranjang"
                    accessibilityRole="button"
                  >
                    <AppIcon name="x" size={18} color={WarungkuColors.text} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                {cartItems.length === 0 ? (
                  /* Empty Cart State */
                  <View style={styles.emptyCartContainer}>
                    <View style={styles.emptyIconCircle}>
                      <AppIcon
                        name="cart"
                        size={32}
                        color={WarungkuColors.secondaryText}
                      />
                    </View>
                    <Text style={styles.emptyCartTitle}>
                      Keranjang masih kosong
                    </Text>
                    <Text style={styles.emptyCartSubtitle}>
                      Tambahkan produk untuk memulai transaksi.
                    </Text>
                    <TouchableOpacity
                      style={styles.selectProductButton}
                      onPress={handleClose}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.selectProductButtonText}>
                        Pilih Produk
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Cart Items List */
                  <>
                    <ScrollView
                      style={styles.itemListScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {cartItems.map((item) => (
                        <View key={item.product.id} style={styles.itemRow}>
                          {/* Left: Product Info */}
                          <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>
                              {item.product.name}
                            </Text>
                            <Text style={styles.itemCategory}>
                              {item.product.category}
                            </Text>
                            <Text style={styles.itemPrice}>
                              {formatRupiah(item.product.price)}
                            </Text>
                          </View>

                          {/* Right: Quantity Control */}
                          <View style={styles.quantityControlGroup}>
                            {/* Subtotal for this item */}
                            <Text style={styles.itemSubtotal}>
                              {formatRupiah(item.product.price * item.quantity)}
                            </Text>

                            <View style={styles.quantityButtons}>
                              {/* Minus Button */}
                              <TouchableOpacity
                                style={styles.qtyButton}
                                onPress={() =>
                                  onDecrementQuantity(item.product.id)
                                }
                                hitSlop={{
                                  top: 6,
                                  bottom: 6,
                                  left: 6,
                                  right: 6,
                                }}
                                accessibilityLabel={`Kurangi ${item.product.name}`}
                                accessibilityRole="button"
                              >
                                {item.quantity === 1 ? (
                                  <AppIcon
                                    name="trash"
                                    size={16}
                                    color={WarungkuColors.error}
                                  />
                                ) : (
                                  <AppIcon
                                    name="minus"
                                    size={16}
                                    color={WarungkuColors.text}
                                  />
                                )}
                              </TouchableOpacity>

                              {/* Quantity display */}
                              <View style={styles.qtyDisplay}>
                                <Text style={styles.qtyText}>
                                  {item.quantity}
                                </Text>
                              </View>

                              {/* Plus Button */}
                              <TouchableOpacity
                                style={styles.qtyButton}
                                onPress={() =>
                                  onIncrementQuantity(item.product.id)
                                }
                                hitSlop={{
                                  top: 6,
                                  bottom: 6,
                                  left: 6,
                                  right: 6,
                                }}
                                accessibilityLabel={`Tambah ${item.product.name}`}
                                accessibilityRole="button"
                              >
                                <AppIcon
                                  name="plus"
                                  size={16}
                                  color={WarungkuColors.text}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    {/* Footer with Subtotal and Bayar Button */}
                    <View style={styles.footerContainer}>
                      <View style={styles.subtotalRow}>
                        <Text style={styles.subtotalLabel}>Subtotal</Text>
                        <Text style={styles.subtotalValue}>
                          {formatRupiah(totalPrice)}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.payButton}
                        activeOpacity={0.85}
                        onPress={() => setStep('summary')}
                        accessibilityRole="button"
                        accessibilityLabel={`Bayar ${formatRupiah(totalPrice)}`}
                      >
                        <Text style={styles.payButtonText}>
                          Bayar ({formatRupiah(totalPrice)})
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}

            {/* STEP 2: PAYMENT SUMMARY & CASH PAYMENT WITH CHANGE CALCULATION */}
            {step === 'summary' && (
              <>
                <View style={styles.sheetHeader}>
                  <View>
                    <Text style={styles.sheetTitle}>Ringkasan Pembayaran</Text>
                    <Text style={styles.sheetSubtitle}>
                      Pembayaran tunai & hitung kembalian
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeIconButton}
                    onPress={() => setStep('cart')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <AppIcon name="x" size={18} color={WarungkuColors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.summaryScroll}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Total Pembayaran Box */}
                  <View style={styles.totalBox}>
                    <Text style={styles.totalBoxLabel}>Total Pembayaran</Text>
                    <Text style={styles.totalBoxValue}>
                      {formatRupiah(totalPrice)}
                    </Text>
                  </View>

                  {/* Cash Payment Input Section */}
                  <View style={styles.cashSection}>
                    <Text style={styles.cashSectionLabel}>Uang Pembeli</Text>
                    <View
                      style={[
                        styles.cashInputContainer,
                        isShort && styles.cashInputContainerError,
                        isValidPayment && cashGiven > 0 && styles.cashInputContainerSuccess,
                      ]}
                    >
                      <Text style={styles.cashInputCurrencyPrefix}>Rp</Text>
                      <TextInput
                        style={styles.cashTextInput}
                        placeholder="Masukkan uang pembeli"
                        placeholderTextColor={WarungkuColors.outline}
                        keyboardType="numeric"
                        value={
                          cashInput
                            ? cashInput.replace(/^Rp\s?/, '')
                            : ''
                        }
                        onChangeText={handleCashInputChange}
                        autoFocus={false}
                      />
                      {cashInput.length > 0 && (
                        <TouchableOpacity
                          style={styles.clearCashButton}
                          onPress={() => {
                            setCashGiven(0);
                            setCashInput('');
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <AppIcon
                            name="x"
                            size={14}
                            color={WarungkuColors.secondaryText}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Quick Nominal Buttons */}
                    <Text style={styles.quickNominalsHeader}>
                      Pilihan Cepat Nominal:
                    </Text>
                    <View style={styles.quickNominalsRow}>
                      {/* Uang Pas Button */}
                      <TouchableOpacity
                        style={[
                          styles.quickNominalChip,
                          styles.quickNominalUangPas,
                          cashGiven === totalPrice &&
                            styles.quickNominalChipActive,
                        ]}
                        activeOpacity={0.75}
                        onPress={() => handleSelectNominal(totalPrice)}
                      >
                        <Text
                          style={[
                            styles.quickNominalText,
                            styles.quickNominalTextUangPas,
                            cashGiven === totalPrice &&
                              styles.quickNominalTextActive,
                          ]}
                        >
                          Uang Pas
                        </Text>
                      </TouchableOpacity>

                      {/* Common Denominations */}
                      {QUICK_NOMINALS.map((nominal) => {
                        const isSelected = cashGiven === nominal;
                        return (
                          <TouchableOpacity
                            key={nominal}
                            style={[
                              styles.quickNominalChip,
                              isSelected && styles.quickNominalChipActive,
                            ]}
                            activeOpacity={0.75}
                            onPress={() => handleSelectNominal(nominal)}
                          >
                            <Text
                              style={[
                                styles.quickNominalText,
                                isSelected && styles.quickNominalTextActive,
                              ]}
                            >
                              {formatRupiah(nominal)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Change / Shortage Realtime Display */}
                    {cashGiven > 0 && (
                      <View style={styles.changeFeedbackContainer}>
                        {isShort ? (
                          /* Shortage Error State */
                          <View style={styles.shortageCard}>
                            <View style={styles.feedbackHeaderRow}>
                              <AppIcon
                                name="alert-triangle"
                                size={18}
                                color={WarungkuColors.error}
                              />
                              <Text style={styles.shortageTitle}>
                                Uang pembeli kurang {formatRupiah(shortage)}
                              </Text>
                            </View>
                            <Text style={styles.shortageSubtitle}>
                              Nominal pembayaran belum mencukupi total belanja.
                            </Text>
                          </View>
                        ) : (
                          /* Valid Payment (Exact or Excess Change) */
                          <View
                            style={[
                              styles.changeCard,
                              change === 0
                                ? styles.changeCardExact
                                : styles.changeCardExcess,
                            ]}
                          >
                            <View style={styles.changeHeaderRow}>
                              <Text style={styles.changeLabel}>
                                {change === 0
                                  ? 'Uang Pas'
                                  : 'Kembalian'}
                              </Text>
                              <View
                                style={[
                                  styles.changeStatusBadge,
                                  change === 0
                                    ? styles.badgeExact
                                    : styles.badgeExcess,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.changeStatusBadgeText,
                                    change === 0
                                      ? styles.badgeExactText
                                      : styles.badgeExcessText,
                                  ]}
                                >
                                  {change === 0
                                    ? 'Pas'
                                    : 'Perlu Kembalian'}
                                </Text>
                              </View>
                            </View>

                            <Text
                              style={[
                                styles.changeValue,
                                change === 0
                                  ? styles.changeValueExact
                                  : styles.changeValueExcess,
                              ]}
                            >
                              {formatRupiah(change)}
                            </Text>

                            <Text style={styles.changeNote}>
                              {change === 0
                                ? 'Tidak ada uang kembalian yang harus diberikan.'
                                : 'Berikan uang kembalian sejumlah nominal di atas ke pembeli.'}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>

                  {/* Items Summary Accordion/Table */}
                  <View style={styles.summaryTable}>
                    <Text style={styles.summaryTableTitle}>
                      Rincian ({cartItems.length} Produk)
                    </Text>
                    {cartItems.map((item) => (
                      <View key={item.product.id} style={styles.summaryTableRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.summaryItemName}>
                            {item.product.name}
                          </Text>
                          <Text style={styles.summaryItemDetail}>
                            {item.quantity} x {formatRupiah(item.product.price)}
                          </Text>
                        </View>
                        <Text style={styles.summaryItemTotal}>
                          {formatRupiah(item.product.price * item.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Actions */}
                <View style={styles.footerContainer}>
                  <TouchableOpacity
                    style={[
                      styles.payButton,
                      !isValidPayment && styles.payButtonDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={!isValidPayment}
                    onPress={handleConfirmPayment}
                    accessibilityRole="button"
                    accessibilityLabel="Konfirmasi Pembayaran"
                  >
                    <Text style={styles.payButtonText}>
                      Konfirmasi Pembayaran
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryBackButton}
                    activeOpacity={0.7}
                    onPress={() => setStep('cart')}
                  >
                    <Text style={styles.secondaryBackText}>
                      Kembali ke Keranjang
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* STEP 3: PROCESSING STATE */}
            {step === 'processing' && (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={WarungkuColors.primary} />
                <Text style={styles.processingTitle}>
                  Memproses Pembayaran...
                </Text>
                <Text style={styles.processingSubtitle}>
                  Mohon tunggu sebentar
                </Text>
              </View>
            )}

            {/* STEP 4: SUCCESS STATE */}
            {step === 'success' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <AppIcon
                    name="check-circle"
                    size={48}
                    color={WarungkuColors.success}
                    focused
                  />
                </View>

                <Text style={styles.successTitle}>Pembayaran Berhasil</Text>
                <Text style={styles.successSubtitle}>
                  Transaksi tunai berhasil diproses.
                </Text>

                {/* Full Receipt Breakdown */}
                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Total</Text>
                    <Text style={styles.receiptValue}>
                      {formatRupiah(totalPrice)}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Dibayar (Uang Pembeli)</Text>
                    <Text style={styles.receiptValue}>
                      {formatRupiah(cashGiven)}
                    </Text>
                  </View>
                  <View style={[styles.receiptRow, styles.receiptRowHighlight]}>
                    <Text style={styles.receiptHighlightLabel}>Kembalian</Text>
                    <Text style={styles.receiptHighlightValue}>
                      {formatRupiah(change)}
                    </Text>
                  </View>
                  <View style={styles.receiptDivider} />
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Metode Pembayaran</Text>
                    <Text style={styles.receiptStatus}>Tunai (Cash)</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.payButton}
                  activeOpacity={0.95}
                  onPress={handleFinishTransaction}
                  accessibilityRole="button"
                  accessibilityLabel="Selesai transaksi"
                >
                  <Text style={styles.payButtonText}>Selesai</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: WarungkuColors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
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
  closeIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemListScroll: {
    maxHeight: 320,
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: WarungkuColors.surfaceContainer,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  itemCategory: {
    fontSize: 11,
    color: WarungkuColors.secondaryText,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.primary,
    marginTop: 4,
  },
  quantityControlGroup: {
    alignItems: 'flex-end',
    gap: 6,
  },
  itemSubtotal: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: WarungkuColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qtyDisplay: {
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: WarungkuColors.text,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: WarungkuColors.surfaceContainer,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.4,
  },
  payButton: {
    backgroundColor: WarungkuColors.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonDisabled: {
    backgroundColor: WarungkuColors.outlineVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.2,
  },
  emptyCartContainer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  emptyCartSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
  },
  selectProductButton: {
    backgroundColor: WarungkuColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 46,
    justifyContent: 'center',
  },
  selectProductButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
  },
  summaryScroll: {
    maxHeight: 440,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  totalBox: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: WarungkuColors.primary,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  totalBoxLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  totalBoxValue: {
    fontSize: 24,
    fontWeight: '800',
    color: WarungkuColors.primary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  cashSection: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    marginBottom: 16,
  },
  cashSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 8,
  },
  cashInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 14,
    height: 50,
  },
  cashInputContainerError: {
    borderColor: WarungkuColors.error,
    backgroundColor: WarungkuColors.errorContainer,
  },
  cashInputContainerSuccess: {
    borderColor: WarungkuColors.success,
    backgroundColor: WarungkuColors.successContainer,
  },
  cashInputCurrencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.primary,
    marginRight: 6,
  },
  cashTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  clearCashButton: {
    padding: 6,
  },
  quickNominalsHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
    marginTop: 12,
    marginBottom: 8,
  },
  quickNominalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickNominalChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickNominalUangPas: {
    backgroundColor: WarungkuColors.surfaceContainer,
    borderColor: WarungkuColors.primaryContainer,
  },
  quickNominalChipActive: {
    backgroundColor: WarungkuColors.primary,
    borderColor: WarungkuColors.primary,
  },
  quickNominalText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  quickNominalTextUangPas: {
    color: WarungkuColors.primary,
    fontWeight: '800',
  },
  quickNominalTextActive: {
    color: WarungkuColors.onPrimary,
  },
  changeFeedbackContainer: {
    marginTop: 14,
  },
  shortageCard: {
    backgroundColor: WarungkuColors.errorContainer,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.error,
    gap: 4,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shortageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.error,
  },
  shortageSubtitle: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginLeft: 26,
  },
  changeCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  changeCardExact: {
    backgroundColor: WarungkuColors.successContainer,
    borderColor: WarungkuColors.success,
  },
  changeCardExcess: {
    backgroundColor: '#E6F4EA',
    borderColor: WarungkuColors.success,
  },
  changeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  changeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  changeStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  changeStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeExact: {
    backgroundColor: WarungkuColors.surfaceLow,
  },
  badgeExactText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  badgeExcess: {
    backgroundColor: WarungkuColors.success,
  },
  badgeExcessText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changeValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  changeValueExact: {
    color: WarungkuColors.success,
  },
  changeValueExcess: {
    color: WarungkuColors.success,
  },
  changeNote: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 4,
  },
  summaryTable: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  summaryTableTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: WarungkuColors.outlineVariant,
  },
  summaryItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  summaryItemDetail: {
    fontSize: 11,
    color: WarungkuColors.secondaryText,
    marginTop: 1,
  },
  summaryItemTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  secondaryBackButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryBackText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  processingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  processingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  processingSubtitle: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
  },
  successContainer: {
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: WarungkuColors.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.4,
  },
  successSubtitle: {
    fontSize: 14,
    color: WarungkuColors.secondaryText,
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptRowHighlight: {
    backgroundColor: WarungkuColors.successContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginVertical: 2,
  },
  receiptLabel: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
  },
  receiptValue: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  receiptHighlightLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.success,
  },
  receiptHighlightValue: {
    fontSize: 16,
    fontWeight: '800',
    color: WarungkuColors.success,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: WarungkuColors.outlineVariant,
    marginVertical: 2,
  },
  receiptStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.success,
  },
});
