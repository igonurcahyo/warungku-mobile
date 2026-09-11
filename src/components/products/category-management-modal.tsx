import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';
import { CategoryItem } from '@/api/categories';
import { useStore } from '@/context/store-context';

interface CategoryManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoryManagementModal({
  visible,
  onClose,
}: CategoryManagementModalProps) {
  const {
    categories,
    isLoadingCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useStore();

  const [newCatName, setNewCatName] = useState('');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [newError, setNewError] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Deleting state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAddCategory = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      setNewError('Nama kategori wajib diisi.');
      return;
    }
    if (trimmed.length < 2) {
      setNewError('Minimal 2 karakter.');
      return;
    }
    if (trimmed.length > 50) {
      setNewError('Maksimal 50 karakter.');
      return;
    }

    setNewError('');
    setIsSubmittingNew(true);
    const res = await addCategory(trimmed);
    setIsSubmittingNew(false);

    if (res.success) {
      setNewCatName('');
    } else {
      setNewError(res.error || 'Gagal menambahkan kategori.');
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditError('');
  };

  const handleSaveEdit = async (id: number) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditError('Nama kategori tidak boleh kosong.');
      return;
    }
    if (trimmed.length < 2) {
      setEditError('Minimal 2 karakter.');
      return;
    }
    if (trimmed.length > 50) {
      setEditError('Maksimal 50 karakter.');
      return;
    }

    setEditError('');
    setIsSubmittingEdit(true);
    const res = await updateCategory(id, trimmed);
    setIsSubmittingEdit(false);

    if (res.success) {
      setEditingId(null);
      setEditingName('');
    } else {
      setEditError(res.error || 'Gagal memperbarui kategori.');
    }
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    if (cat.productCount && cat.productCount > 0) {
      Alert.alert(
        'Kategori Masih Digunakan',
        `Kategori "${cat.name}" masih digunakan oleh ${cat.productCount} produk dan tidak dapat dihapus. Hapus atau pindahkan produk terkait terlebih dahulu.`,
        [{ text: 'Mengerti', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Hapus Kategori',
      `Yakin ingin menghapus kategori "${cat.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(cat.id);
            const res = await deleteCategory(cat.id);
            setDeletingId(null);
            if (!res.success) {
              Alert.alert('Gagal Menghapus', res.error || 'Terjadi kesalahan.');
            }
          },
        },
      ]
    );
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
                <Text style={styles.sheetTitle}>Kelola Kategori</Text>
                <Text style={styles.sheetSubtitle}>
                  Tambah, ubah, atau hapus kategori produk warung
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Tutup"
              >
                <AppIcon name="x" size={18} color={WarungkuColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.contentScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Card Tambah Kategori Baru */}
              <View style={styles.addCard}>
                <Text style={styles.addCardLabel}>Tambah Kategori Baru</Text>
                <View style={styles.addInputRow}>
                  <TextInput
                    style={styles.addInput}
                    placeholder="Contoh: Makanan Instan"
                    placeholderTextColor={WarungkuColors.outline}
                    value={newCatName}
                    onChangeText={(t) => {
                      setNewCatName(t);
                      if (newError) setNewError('');
                    }}
                    autoCapitalize="words"
                    maxLength={50}
                  />
                  <TouchableOpacity
                    style={[
                      styles.addSubmitButton,
                      (!newCatName.trim() || isSubmittingNew) && styles.buttonDisabled,
                    ]}
                    onPress={handleAddCategory}
                    disabled={!newCatName.trim() || isSubmittingNew}
                    activeOpacity={0.8}
                  >
                    {isSubmittingNew ? (
                      <ActivityIndicator size="small" color={WarungkuColors.onPrimary} />
                    ) : (
                      <>
                        <AppIcon name="plus" size={16} color={WarungkuColors.onPrimary} />
                        <Text style={styles.addSubmitText}>Tambah</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                {!!newError && <Text style={styles.errorText}>{newError}</Text>}
              </View>

              {/* Section Title */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Daftar Kategori</Text>
                <View style={styles.catCountBadge}>
                  <Text style={styles.catCountText}>
                    {categories.length} Kategori
                  </Text>
                </View>
              </View>

              {/* Category List */}
              {isLoadingCategories ? (
                <View style={styles.centerBox}>
                  <ActivityIndicator size="small" color={WarungkuColors.primary} />
                  <Text style={styles.loadingText}>Memuat kategori...</Text>
                </View>
              ) : categories.length === 0 ? (
                <View style={styles.emptyBox}>
                  <AppIcon name="box" size={32} color={WarungkuColors.outline} />
                  <Text style={styles.emptyText}>Belum ada kategori</Text>
                  <Text style={styles.emptySubtext}>
                    Tambahkan kategori pertama melalui formulir di atas.
                  </Text>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {categories.map((cat) => {
                    const isEditingThis = editingId === cat.id;
                    const isDeletingThis = deletingId === cat.id;

                    return (
                      <View key={cat.id} style={styles.categoryCard}>
                        {isEditingThis ? (
                          <View style={styles.editCardCol}>
                            <View style={styles.editRow}>
                              <TextInput
                                style={styles.editInput}
                                value={editingName}
                                onChangeText={(t) => {
                                  setEditingName(t);
                                  if (editError) setEditError('');
                                }}
                                autoFocus
                                maxLength={50}
                              />
                              <TouchableOpacity
                                style={styles.saveEditBtn}
                                onPress={() => handleSaveEdit(cat.id)}
                                disabled={isSubmittingEdit}
                              >
                                {isSubmittingEdit ? (
                                  <ActivityIndicator size="small" color={WarungkuColors.onPrimary} />
                                ) : (
                                  <AppIcon name="check" size={16} color={WarungkuColors.onPrimary} />
                                )}
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.cancelEditBtn}
                                onPress={handleCancelEdit}
                                disabled={isSubmittingEdit}
                              >
                                <AppIcon name="x" size={16} color={WarungkuColors.secondaryText} />
                              </TouchableOpacity>
                            </View>
                            {!!editError && (
                              <Text style={styles.errorText}>{editError}</Text>
                            )}
                          </View>
                        ) : (
                          <View style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                              <Text style={styles.itemName}>{cat.name}</Text>
                              <View style={styles.itemBadge}>
                                <Text style={styles.itemBadgeText}>
                                  {cat.productCount ?? 0} produk
                                </Text>
                              </View>
                            </View>

                            <View style={styles.itemActions}>
                              <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={() => handleStartEdit(cat)}
                                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                accessibilityRole="button"
                                accessibilityLabel={`Edit ${cat.name}`}
                              >
                                <AppIcon name="edit" size={16} color={WarungkuColors.primary} />
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[styles.actionBtn, styles.deleteBtn]}
                                onPress={() => handleDeleteCategory(cat)}
                                disabled={isDeletingThis}
                                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                accessibilityRole="button"
                                accessibilityLabel={`Hapus ${cat.name}`}
                              >
                                {isDeletingThis ? (
                                  <ActivityIndicator size="small" color={WarungkuColors.error} />
                                ) : (
                                  <AppIcon name="trash" size={16} color={WarungkuColors.error} />
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
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
    maxHeight: '85%',
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
  addCard: {
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    marginBottom: 18,
  },
  addCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 8,
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    backgroundColor: WarungkuColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.text,
  },
  addSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: WarungkuColors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
  },
  addSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.onPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: WarungkuColors.text,
  },
  catCountBadge: {
    backgroundColor: WarungkuColors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  listContainer: {
    gap: 10,
    paddingBottom: 24,
  },
  categoryCard: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  itemBadge: {
    backgroundColor: WarungkuColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  itemBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  deleteBtn: {
    backgroundColor: '#FFEDEA',
    borderColor: '#FFDAD6',
  },
  editCardCol: {
    gap: 8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: WarungkuColors.primary,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.text,
  },
  saveEditBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: WarungkuColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEditBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  centerBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: WarungkuColors.secondaryText,
    fontWeight: '600',
  },
  emptyBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  emptySubtext: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.error,
    marginTop: 6,
  },
});
