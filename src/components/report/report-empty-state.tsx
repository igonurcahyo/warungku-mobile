import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';

export function ReportEmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <AppIcon name="bar-chart" size={32} color="#9CA3AF" />
      </View>
      <Text style={styles.title}>Belum ada penjualan</Text>
      <Text style={styles.subtitle}>
        Belum ada transaksi pada periode ini.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: WarungkuColors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
