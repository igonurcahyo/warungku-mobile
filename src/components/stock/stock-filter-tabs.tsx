import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { WarungkuColors } from '@/constants/colors';

export type StockFilterType = 'Semua' | 'Tersedia' | 'Menipis' | 'Habis';

interface StockFilterTabsProps {
  selectedFilter: StockFilterType;
  onSelectFilter: (filter: StockFilterType) => void;
  counts: {
    semua: number;
    tersedia: number;
    menipis: number;
    habis: number;
  };
}

const FILTERS: StockFilterType[] = ['Semua', 'Tersedia', 'Menipis', 'Habis'];

export function StockFilterTabs({
  selectedFilter,
  onSelectFilter,
  counts,
}: StockFilterTabsProps) {
  const getCount = (filter: StockFilterType): number => {
    switch (filter) {
      case 'Semua':
        return counts.semua;
      case 'Tersedia':
        return counts.tersedia;
      case 'Menipis':
        return counts.menipis;
      case 'Habis':
        return counts.habis;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => {
          const isActive = selectedFilter === filter;
          const count = getCount(filter);
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
              onPress={() => onSelectFilter(filter)}
              activeOpacity={0.75}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {filter}
              </Text>
              <View
                style={[
                  styles.badgeCount,
                  isActive ? styles.badgeCountActive : styles.badgeCountInactive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeCountText,
                    isActive ? styles.badgeCountTextActive : styles.badgeCountTextInactive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: WarungkuColors.primary,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chipInactive: {
    backgroundColor: WarungkuColors.card,
    borderWidth: 1,
    borderColor: WarungkuColors.outlineVariant,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: WarungkuColors.onPrimary,
  },
  chipTextInactive: {
    color: WarungkuColors.secondaryText,
  },
  badgeCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeCountInactive: {
    backgroundColor: WarungkuColors.surfaceContainer,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeCountTextActive: {
    color: WarungkuColors.onPrimary,
  },
  badgeCountTextInactive: {
    color: WarungkuColors.secondaryText,
  },
});
