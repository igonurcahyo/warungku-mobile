import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { Product, formatRupiah } from '@/constants/pos-data';
import { AppIcon } from '@/components/ui/app-icon';

interface DeleteConfirmModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirmDelete: (productId: string) => void;
}

export function DeleteConfirmModal({
  visible,
  product,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdropTouch} />
        </TouchableWithoutFeedback>

        <View style={styles.dialogCard}>
          {/* Icon Circle */}
          <View style={styles.iconCircle}>
            <AppIcon name="trash" size={28} color={WarungkuColors.error} />
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>Hapus Produk?</Text>
          <Text style={styles.description}>
            Apakah Anda yakin ingin menghapus produk ini?
          </Text>

          {/* Product Details Box */}
          <View style={styles.productBox}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.productMetaRow}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.productPrice}>{formatRupiah(product.price)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {/* Batal Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.75}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            {/* Hapus Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.85}
              onPress={() => {
                onConfirmDelete(product.id);
                onClose();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFill,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: WarungkuColors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEDEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FFDAD6',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: WarungkuColors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  productBox: {
    width: '100%',
    backgroundColor: WarungkuColors.surfaceLow,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    marginBottom: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
    textAlign: 'center',
  },
  productMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  productCategory: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
  },
  metaDot: {
    fontSize: 12,
    color: WarungkuColors.secondaryText,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: WarungkuColors.surfaceLow,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: WarungkuColors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: WarungkuColors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
