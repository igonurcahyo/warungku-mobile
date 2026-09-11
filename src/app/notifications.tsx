import React from 'react';
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
import { useStore, StockNotification } from '@/context/store-context';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, stockNotificationEnabled } = useStore();

  const handleNotificationPress = (_item: StockNotification) => {
    // Navigate to stock management screen to fix stock
    router.navigate('/(tabs)/stock');
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
          <Text style={styles.headerTitle}>Notifikasi</Text>
          <Text style={styles.headerSubtitle}>Peringatan stok produk</Text>
        </View>

        {notifications.length > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{notifications.length}</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Toggle Disabled Notice (if turned off from Settings) */}
        {!stockNotificationEnabled && (
          <View style={styles.disabledNotice}>
            <AppIcon name="info" size={16} color="#B45309" />
            <Text style={styles.disabledNoticeText}>
              Notifikasi stok sedang dimatikan di Pengaturan.
            </Text>
          </View>
        )}

        {notifications.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <AppIcon name="bell" size={32} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Tidak ada notifikasi</Text>
            <Text style={styles.emptySubtitle}>
              Stok semua produk dalam kondisi aman.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              activeOpacity={0.75}
              onPress={() => router.navigate('/(tabs)/stock')}
            >
              <Text style={styles.emptyActionBtnText}>Lihat Stok Produk</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Notifications List */
          <View style={styles.listContainer}>
            <View style={styles.listHeaderRow}>
              <Text style={styles.listSectionTitle}>Peringatan Stok</Text>
              <Text style={styles.listSectionCount}>
                {notifications.length} produk perlu perhatian
              </Text>
            </View>

            {notifications.map((item) => {
              const isOutOfStock = item.type === 'out';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notifCard,
                    isOutOfStock ? styles.notifCardOut : styles.notifCardLow,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleNotificationPress(item)}
                  accessibilityRole="button"
                >
                  {/* Status Icon */}
                  <View
                    style={[
                      styles.iconBadge,
                      isOutOfStock ? styles.iconBadgeOut : styles.iconBadgeLow,
                    ]}
                  >
                    <AppIcon
                      name="alert-triangle"
                      size={18}
                      color={isOutOfStock ? '#DC2626' : WarungkuColors.secondaryContainer}
                    />
                  </View>

                  {/* Body Content */}
                  <View style={styles.cardBody}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.cardTitle,
                          isOutOfStock ? styles.cardTitleOut : styles.cardTitleLow,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    <Text style={styles.descText} numberOfLines={2}>
                      {item.message}
                    </Text>

                    <View style={styles.actionPromptRow}>
                      <Text style={styles.actionPromptText}>
                        Ketuk untuk ubah stok
                      </Text>
                      <AppIcon
                        name="chevron-right"
                        size={12}
                        color={WarungkuColors.primary}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  headerBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  disabledNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disabledNoticeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyActionBtn: {
    backgroundColor: WarungkuColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  listSectionCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    gap: 12,
  },
  notifCardOut: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  notifCardLow: {
    borderLeftWidth: 4,
    borderLeftColor: WarungkuColors.secondaryContainer,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeOut: {
    backgroundColor: '#FEE2E2',
  },
  iconBadgeLow: {
    backgroundColor: '#FEF3E6',
  },
  cardBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardTitleOut: {
    color: '#DC2626',
  },
  cardTitleLow: {
    color: '#B45309',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  descText: {
    fontSize: 13,
    color: WarungkuColors.text,
    fontWeight: '500',
    marginBottom: 6,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionPromptText: {
    fontSize: 11,
    fontWeight: '600',
    color: WarungkuColors.primary,
  },
});
