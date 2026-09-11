import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon, AppIconName } from '@/components/ui/app-icon';

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
  placeholderText: string;
  iconName: AppIconName;
  stageName?: string;
}

export function PlaceholderScreen({
  title,
  subtitle,
  placeholderText,
  iconName,
  stageName = 'Tahap Selanjutnya',
}: PlaceholderScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Card Placeholder */}
        <View style={styles.card}>
          {/* Decorative Icon Circle */}
          <View style={styles.iconCircle}>
            <AppIcon name={iconName} size={36} color={WarungkuColors.primary} focused />
          </View>

          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{stageName}</Text>
          </View>

          {/* Main Notice */}
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{placeholderText}</Text>

          {/* Navigation Action */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.navigate('/(tabs)')}
          >
            <AppIcon name="home" size={16} color={WarungkuColors.onPrimary} />
            <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WarungkuColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: WarungkuColors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: WarungkuColors.secondaryText,
    marginTop: 4,
    lineHeight: 20,
  },
  card: {
    backgroundColor: WarungkuColors.card,
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginTop: 12,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: WarungkuColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: WarungkuColors.surfaceContainer,
    marginBottom: 18,
  },
  badge: {
    backgroundColor: WarungkuColors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: WarungkuColors.secondaryText,
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: WarungkuColors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 280,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WarungkuColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 46,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.onPrimary,
  },
});
