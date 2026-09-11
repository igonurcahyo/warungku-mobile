import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';

export function WarungkuLogo() {
  return (
    <View style={styles.container}>
      {/* Icon Badge */}
      <View style={styles.iconContainer}>
        {/* Canopy / Warung Awning Stylized Shapes */}
        <View style={styles.roofRow}>
          <View style={[styles.roofSegment, { backgroundColor: '#ffffff' }]} />
          <View style={[styles.roofSegment, { backgroundColor: WarungkuColors.secondaryContainer }]} />
          <View style={[styles.roofSegment, { backgroundColor: '#ffffff' }]} />
          <View style={[styles.roofSegment, { backgroundColor: WarungkuColors.secondaryContainer }]} />
        </View>
        <View style={styles.pillarRow}>
          <View style={styles.pillar} />
          <View style={styles.storeDoor} />
          <View style={styles.pillar} />
        </View>
        <View style={styles.storeBase} />
      </View>

      {/* Brand Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>WarungKu</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.subtitle}>POS & Inventory</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: WarungkuColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  roofRow: {
    flexDirection: 'row',
    width: 40,
    height: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  roofSegment: {
    flex: 1,
    height: '100%',
  },
  pillarRow: {
    flexDirection: 'row',
    width: 36,
    height: 14,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 3,
  },
  pillar: {
    width: 4,
    height: '100%',
    backgroundColor: '#ffffff',
  },
  storeDoor: {
    width: 14,
    height: 10,
    backgroundColor: WarungkuColors.secondaryContainer,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  storeBase: {
    width: 42,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    marginTop: 1,
  },
  textContainer: {
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: WarungkuColors.primary,
  },
  badgeContainer: {
    backgroundColor: WarungkuColors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: WarungkuColors.secondaryText,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
