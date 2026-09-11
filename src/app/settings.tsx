import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';
import { useStore } from '@/context/store-context';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    storeInfo,
    stockNotificationEnabled,
    setStockNotificationEnabled,
    logoutUser,
  } = useStore();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await logoutUser();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <Text style={styles.headerSubtitle}>Kelola informasi WarungKu</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: TOKO */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Toko</Text>
          <View style={styles.card}>
            {/* Nama Warung */}
            <View style={styles.settingItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon name="store" size={18} color={WarungkuColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Nama Warung</Text>
                <Text style={styles.itemValue}>{storeInfo.name}</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            {/* Nama Pemilik */}
            <View style={styles.settingItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon name="user" size={18} color={WarungkuColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Nama Pemilik</Text>
                <Text style={styles.itemValue}>{storeInfo.owner}</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            {/* Email */}
            <View style={styles.settingItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon name="receipt" size={18} color={WarungkuColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Email</Text>
                <Text style={styles.itemValue}>{storeInfo.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 2: APLIKASI */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Aplikasi</Text>
          <View style={styles.card}>
            {/* Notifikasi Stok Toggle */}
            <View style={styles.settingToggleItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon
                  name="bell"
                  size={18}
                  color={stockNotificationEnabled ? WarungkuColors.primary : '#9CA3AF'}
                />
              </View>
              <View style={styles.toggleInfo}>
                <Text style={styles.itemLabel}>Notifikasi Stok</Text>
                <Text style={styles.itemHelper}>
                  {stockNotificationEnabled
                    ? 'Peringatan aktif saat stok menipis (≤5) atau habis'
                    : 'Peringatan stok sedang dimatikan'}
                </Text>
              </View>
              <Switch
                value={stockNotificationEnabled}
                onValueChange={setStockNotificationEnabled}
                trackColor={{
                  false: '#D1D5DB',
                  true: WarungkuColors.primaryContainer,
                }}
                thumbColor={
                  stockNotificationEnabled ? WarungkuColors.primary : '#F4F3F4'
                }
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>

        {/* SECTION 3: TENTANG */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Tentang</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon name="info" size={18} color={WarungkuColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>{storeInfo.appTitle}</Text>
                <Text style={styles.itemHelper}>{storeInfo.appSubtitle}</Text>
              </View>
            </View>

            <View style={styles.itemDivider} />

            <View style={styles.settingItem}>
              <View style={styles.itemIconContainer}>
                <AppIcon name="award" size={18} color={WarungkuColors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Versi Aplikasi</Text>
                <Text style={styles.itemValue}>{storeInfo.version}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 4: LOGOUT */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.75}
            onPress={() => setIsLogoutModalVisible(true)}
            accessibilityRole="button"
          >
            <AppIcon name="log-out" size={18} color="#DC2626" />
            <Text style={styles.logoutButtonText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 40 : 24 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <AppIcon name="log-out" size={24} color="#DC2626" />
            </View>

            <Text style={styles.modalTitle}>Keluar dari WarungKu?</Text>
            <Text style={styles.modalMessage}>
              Anda dapat masuk kembali kapan saja dengan akun pemilik warung.
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                activeOpacity={0.7}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalConfirmText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  sectionContainer: {
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  settingToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EAEFE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.text,
  },
  itemValue: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  itemHelper: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    lineHeight: 15,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    minHeight: 48,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
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
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: WarungkuColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
