import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';

interface DashboardHeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  notificationCount?: number;
}

export function DashboardHeader({
  onNotificationPress,
  onProfilePress,
  notificationCount = 0,
}: DashboardHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {/* Left Brand Area */}
      <View style={styles.brandContainer}>
        {/* Compact Logo Mark */}
        <View style={styles.logoMark}>
          <View style={styles.roofStripes}>
            <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.stripe, { backgroundColor: WarungkuColors.secondaryContainer }]} />
            <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.stripe, { backgroundColor: WarungkuColors.secondaryContainer }]} />
          </View>
          <View style={styles.storeBody}>
            <View style={styles.pillar} />
            <View style={styles.door} />
            <View style={styles.pillar} />
          </View>
        </View>

        <View style={styles.brandTextGroup}>
          <Text style={styles.brandTitle}>WarungKu</Text>
          <Text style={styles.brandSubtitle}>POS & STOK</Text>
        </View>
      </View>

      {/* Right Action Icons */}
      <View style={styles.actionsContainer}>
        {/* Notification Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={onNotificationPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={notificationCount > 0 ? `Notifikasi (${notificationCount})` : 'Notifikasi'}
          accessibilityRole="button"
        >
          <AppIcon name="bell" size={20} color={WarungkuColors.text} />
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile / Settings Icon */}
        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={onProfilePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Profil dan Pengaturan"
          accessibilityRole="button"
        >
          <AppIcon name="user" size={18} color={WarungkuColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: WarungkuColors.background,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: WarungkuColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  roofStripes: {
    flexDirection: 'row',
    width: 24,
    height: 7,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    overflow: 'hidden',
  },
  stripe: {
    flex: 1,
    height: '100%',
  },
  storeBody: {
    flexDirection: 'row',
    width: 22,
    height: 9,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 2,
    marginTop: 1,
  },
  pillar: {
    width: 2.5,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  door: {
    width: 8,
    height: 6,
    backgroundColor: WarungkuColors.secondaryContainer,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: WarungkuColors.primary,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    letterSpacing: 0.6,
    marginTop: -2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WarungkuColors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WarungkuColors.secondaryContainer,
    borderWidth: 1.5,
    borderColor: WarungkuColors.card,
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
});
