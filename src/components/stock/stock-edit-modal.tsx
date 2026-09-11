import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah, getStockStatus } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface StockEditModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSaveStock: (productId: string, newStock: number) => void;
}

export function StockEditModal({
  visible,
  product,
  onClose,
  onSaveStock,
}: StockEditModalProps) {
  const [stockInput, setStockInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setStockInput(product.stock.toString());
      setError('');
    } else {
      setStockInput('');
      setError('');
    }
  }, [product, visible]);

  if (!product) return null;

  const handleStockChange = (text: string) => {
    const rawDigits = text.replace(/[^0-9]/g, '');
    setStockInput(rawDigits);
    if (error) setError('');
  };

  const handleSave = () => {
    const trimmed = stockInput.trim();
    if (!trimmed) {
      setError('Jumlah stok wajib diisi');
      return;
    }

    const num = parseInt(trimmed, 10);
    if (isNaN(num)) {
      setError('Stok harus berupa angka bulat');
      return;
    }

    if (num < 0) {
      setError('Stok tidak boleh negatif');
      return;
    }

    onSaveStock(product.id, num);
    onClose();
  };

  const parsedNumber = stockInput.trim() ? parseInt(stockInput.trim(), 10) : NaN;
  const previewStatus = !isNaN(parsedNumber) && parsedNumber >= 0
    ? getStockStatus(parsedNumber)
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdropTouch} />
          </TouchableWithoutFeedback>

          <View style={styles.sheetContainer}>
            {/* Top Handle */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Ubah Stok</Text>
                <Text style={styles.sheetSubtitle}>Perbarui ketersediaan produk</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Tutup modal"
              >
                <AppIcon name="x" size={18} color={WarungkuColors.text} />
              </TouchableOpacity>
            </View>

            {/* Product Meta Card */}
            <View style={styles.productMetaCard}>
              <View style={styles.metaLeft}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {product.category} • {formatRupiah(product.price)}
                </Text>
              </View>
              <View style={styles.currentStockBadge}>
                <Text style={styles.currentStockLabel}>Saat ini</Text>
                <Text style={styles.currentStockNumber}>{product.stock}</Text>
              </View>
            </View>

            {/* Stock Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Jumlah Stok Baru</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !!error && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.numericInput}
                  placeholder="Masukkan jumlah stok"
                  placeholderTextColor={WarungkuColors.outline}
                  keyboardType="numeric"
                  value={stockInput}
                  onChangeText={handleStockChange}
                  autoFocus
                />
                {previewStatus && (
                  <View
                    style={[
                      styles.previewBadge,
                      previewStatus.type === 'out' && styles.previewBadgeOut,
                      previewStatus.type === 'low' && styles.previewBadgeLow,
                      previewStatus.type === 'available' && styles.previewBadgeAvailable,
                    ]}
                  >
                    <Text
                      style={[
                        styles.previewBadgeText,
                        previewStatus.type === 'out' && styles.previewTextOut,
                        previewStatus.type === 'low' && styles.previewTextLow,
                        previewStatus.type === 'available' && styles.previewTextAvailable,
                      ]}
                    >
                      {previewStatus.label}
                    </Text>
                  </View>
                )}
              </View>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Quick Adjustment Buttons */}
            <View style={styles.quickAddRow}>
              <Text style={styles.quickAddHint}>Atau tambah cepat:</Text>
              <View style={styles.quickChips}>
                {[5, 10, 20, 50].map((inc) => (
                  <TouchableOpacity
                    key={inc}
                    style={styles.quickChip}
                    onPress={() => {
                      const base = isNaN(parsedNumber) ? product.stock : parsedNumber;
                      const next = base + inc;
                      setStockInput(next.toString());
                      if (error) setError('');
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickChipText}>+{inc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.75}
                onPress={onClose}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.85}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Simpan</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingBottom: 28,
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
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productMetaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  metaLeft: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  productMeta: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    marginTop: 3,
  },
  currentStockBadge: {
    alignItems: 'center',
    backgroundColor: WarungkuColors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  currentStockLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    textTransform: 'uppercase',
  },
  currentStockNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.primary,
  },
  inputSection: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperError: {
    borderColor: WarungkuColors.error,
    backgroundColor: '#FFEDEA',
  },
  numericInput: {
    flex: 1,
    height: '100%',
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.text,
  },
  previewBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  previewBadgeOut: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  previewBadgeLow: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FFE0B2',
  },
  previewBadgeAvailable: {
    backgroundColor: '#D4F8E8',
    borderColor: '#A7F3D0',
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  previewTextOut: {
    color: WarungkuColors.error,
  },
  previewTextLow: {
    color: WarungkuColors.secondary,
  },
  previewTextAvailable: {
    color: WarungkuColors.success,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.error,
    marginTop: 6,
  },
  quickAddRow: {
    marginTop: 12,
  },
  quickAddHint: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    fontWeight: '600',
    marginBottom: 6,
  },
  quickChips: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  saveBtn: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    backgroundColor: WarungkuColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
  },
});
