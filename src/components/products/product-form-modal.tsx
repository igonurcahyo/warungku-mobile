import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';
import { useStore } from '@/context/store-context';

export interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category: string;
  unit?: string;
}

interface ProductFormModalProps {
  visible: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (productData: ProductFormData) => Promise<boolean | void> | void;
  isSaving?: boolean;
}

export function ProductFormModal({
  visible,
  productToEdit,
  onClose,
  onSave,
  isSaving = false,
}: ProductFormModalProps) {
  const isEditing = !!productToEdit;
  const { categories } = useStore();

  // Form states
  const [name, setName] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Validation errors
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [stockError, setStockError] = useState('');

  // Populate or reset form when modal opens or productToEdit changes
  useEffect(() => {
    if (visible) {
      setSubmitError('');
      if (productToEdit) {
        setName(productToEdit.name);
        setPriceInput(productToEdit.price.toString());
        setStockInput(productToEdit.stock.toString());

        // Find matched category in categories list
        const matched = categories.find(
          (c) =>
            (productToEdit.categoryId && c.id === productToEdit.categoryId) ||
            c.name.toLowerCase() === (productToEdit.category || '').toLowerCase()
        );
        if (matched) {
          setSelectedCategoryId(matched.id);
          setSelectedCategoryName(matched.name);
        } else if (categories.length > 0) {
          setSelectedCategoryId(categories[0].id);
          setSelectedCategoryName(categories[0].name);
        } else {
          setSelectedCategoryId(null);
          setSelectedCategoryName(productToEdit.category || '');
        }
      } else {
        setName('');
        setPriceInput('');
        setStockInput('');
        if (categories.length > 0) {
          setSelectedCategoryId(categories[0].id);
          setSelectedCategoryName(categories[0].name);
        } else {
          setSelectedCategoryId(null);
          setSelectedCategoryName('');
        }
      }

      // Clear errors
      setNameError('');
      setPriceError('');
      setCategoryError('');
      setStockError('');
    }
  }, [productToEdit, visible, categories]);

  const handlePriceChange = (text: string) => {
    const rawDigits = text.replace(/[^0-9]/g, '');
    setPriceInput(rawDigits);
    if (priceError) setPriceError('');
  };

  const handleStockChange = (text: string) => {
    const rawDigits = text.replace(/[^0-9]/g, '');
    setStockInput(rawDigits);
    if (stockError) setStockError('');
  };

  const validateAndSubmit = async () => {
    let isValid = true;

    // Validate Name
    if (!name.trim()) {
      setNameError('Nama produk wajib diisi.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate Price
    if (!priceInput.trim()) {
      setPriceError('Harga wajib diisi.');
      isValid = false;
    } else {
      const numPrice = parseInt(priceInput, 10);
      if (isNaN(numPrice) || numPrice < 0) {
        setPriceError('Harga harus bernilai 0 atau lebih.');
        isValid = false;
      } else {
        setPriceError('');
      }
    }

    // Validate Category
    if (!selectedCategoryId) {
      setCategoryError('Kategori wajib dipilih.');
      isValid = false;
    } else {
      setCategoryError('');
    }

    // Validate Stock
    if (!stockInput.trim()) {
      setStockError('Stok wajib diisi.');
      isValid = false;
    } else {
      const numStock = parseInt(stockInput, 10);
      if (isNaN(numStock) || numStock < 0) {
        setStockError('Stok tidak boleh kurang dari 0.');
        isValid = false;
      } else {
        setStockError('');
      }
    }

    if (!isValid || !selectedCategoryId) return;

    try {
      setSubmitError('');
      const res = await onSave({
        id: productToEdit ? productToEdit.id : undefined,
        name: name.trim(),
        price: parseInt(priceInput, 10),
        categoryId: selectedCategoryId,
        category: selectedCategoryName,
        stock: parseInt(stockInput, 10),
        unit: 'Pcs',
      });

      // If onSave returns false, keep modal open
      if (res !== false) {
        onClose();
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Gagal menyimpan produk.');
    }
  };

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
                <Text style={styles.sheetTitle}>
                  {isEditing ? 'Edit Produk' : 'Tambah Produk'}
                </Text>
                <Text style={styles.sheetSubtitle}>
                  Lengkapi informasi produk warung
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Tutup form"
              >
                <AppIcon name="x" size={18} color={WarungkuColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Field: Nama Produk */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nama Produk <Text style={styles.requiredMark}>*</Text>
                </Text>
                <View
                  style={[
                    styles.textInputWrapper,
                    !!nameError && styles.inputErrorBorder,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan nama produk"
                    placeholderTextColor={WarungkuColors.outline}
                    value={name}
                    onChangeText={(val) => {
                      setName(val);
                      if (nameError) setNameError('');
                    }}
                  />
                </View>
                {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
              </View>

              {/* Field: Harga Jual */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Harga Jual <Text style={styles.requiredMark}>*</Text>
                </Text>
                <View
                  style={[
                    styles.textInputWrapper,
                    styles.priceInputWrapper,
                    !!priceError && styles.inputErrorBorder,
                  ]}
                >
                  <Text style={styles.currencyPrefix}>Rp</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan harga jual"
                    placeholderTextColor={WarungkuColors.outline}
                    keyboardType="numeric"
                    value={priceInput}
                    onChangeText={handlePriceChange}
                  />
                  {priceInput.length > 0 && !isNaN(parseInt(priceInput, 10)) && (
                    <Text style={styles.formattedPreview}>
                      {formatRupiah(parseInt(priceInput, 10))}
                    </Text>
                  )}
                </View>
                {!!priceError && (
                  <Text style={styles.errorText}>{priceError}</Text>
                )}
              </View>

              {/* Field: Kategori */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Kategori <Text style={styles.requiredMark}>*</Text>
                </Text>

                {categories.length === 0 ? (
                  <View style={styles.noCategoryBox}>
                    <Text style={styles.noCategoryText}>
                      Belum ada kategori di warung Anda. Tambahkan kategori terlebih dahulu melalui menu Kelola Kategori.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.categoryChipsRow}>
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryId === cat.id;
                      return (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.catChip,
                            isSelected && styles.catChipSelected,
                          ]}
                          activeOpacity={0.75}
                          onPress={() => {
                            setSelectedCategoryId(cat.id);
                            setSelectedCategoryName(cat.name);
                            if (categoryError) setCategoryError('');
                          }}
                        >
                          <Text
                            style={[
                              styles.catChipText,
                              isSelected && styles.catChipTextSelected,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {!!categoryError && (
                  <Text style={styles.errorText}>{categoryError}</Text>
                )}
              </View>

              {/* Field: Stok */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Jumlah Stok <Text style={styles.requiredMark}>*</Text>
                </Text>
                <View
                  style={[
                    styles.textInputWrapper,
                    !!stockError && styles.inputErrorBorder,
                  ]}
                >
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan jumlah stok"
                    placeholderTextColor={WarungkuColors.outline}
                    keyboardType="numeric"
                    value={stockInput}
                    onChangeText={handleStockChange}
                  />
                </View>
                {!!stockError && (
                  <Text style={styles.errorText}>{stockError}</Text>
                )}
              </View>

              {/* General submit error */}
              {!!submitError && (
                <View style={styles.submitErrorBox}>
                  <AppIcon name="alert-triangle" size={16} color={WarungkuColors.error} />
                  <Text style={styles.submitErrorText}>{submitError}</Text>
                </View>
              )}

              {/* Action Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.submitButton, isSaving && styles.buttonDisabled]}
                  activeOpacity={0.85}
                  onPress={validateAndSubmit}
                  disabled={isSaving}
                  accessibilityRole="button"
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={WarungkuColors.onPrimary} />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isEditing ? 'Simpan Perubahan' : 'Simpan Produk'}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                  onPress={onClose}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 8,
  },
  requiredMark: {
    color: WarungkuColors.error,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 14,
    height: 50,
  },
  priceInputWrapper: {
    paddingLeft: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.primary,
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '600',
    color: WarungkuColors.text,
  },
  formattedPreview: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    backgroundColor: WarungkuColors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inputErrorBorder: {
    borderColor: WarungkuColors.error,
    backgroundColor: '#FFEDEA',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.error,
    marginTop: 6,
  },
  noCategoryBox: {
    padding: 12,
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  noCategoryText: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    lineHeight: 18,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catChipSelected: {
    backgroundColor: WarungkuColors.primary,
    borderColor: WarungkuColors.primary,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  catChipTextSelected: {
    color: WarungkuColors.onPrimary,
  },
  submitErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEDEA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  submitErrorText: {
    flex: 1,
    fontSize: 12,
    color: WarungkuColors.error,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 24,
    gap: 10,
  },
  submitButton: {
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
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
    letterSpacing: 0.2,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
});
