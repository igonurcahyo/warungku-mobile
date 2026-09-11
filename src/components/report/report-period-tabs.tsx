import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { ReportPeriod } from '@/constants/report-data';

interface ReportPeriodTabsProps {
  selectedPeriod: ReportPeriod;
  onSelectPeriod: (period: ReportPeriod) => void;
}

const PERIODS: ReportPeriod[] = ['Hari Ini', '7 Hari', '30 Hari'];

export function ReportPeriodTabs({ selectedPeriod, onSelectPeriod }: ReportPeriodTabsProps) {
  return (
    <View style={styles.container}>
      {PERIODS.map((period) => {
        const isSelected = selectedPeriod === period;
        return (
          <TouchableOpacity
            key={period}
            style={[styles.tabButton, isSelected && styles.tabButtonActive]}
            activeOpacity={0.7}
            onPress={() => onSelectPeriod(period)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
              {period}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EAEFE9',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minHeight: 44,
  },
  tabButtonActive: {
    backgroundColor: WarungkuColors.primary,
    shadowColor: WarungkuColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
