import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { ChartBarData } from '@/constants/report-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ReportSalesChartProps {
  data: ChartBarData[];
}

export function ReportSalesChart({ data }: ReportSalesChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const CHART_HEIGHT = 110;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Tren Penjualan</Text>
          <Text style={styles.cardSubtitle}>Pergerakan nilai penjualan</Text>
        </View>
        <View style={styles.badge}>
          <AppIcon name="bar-chart" size={14} color={WarungkuColors.primary} />
          <Text style={styles.badgeText}>Grafik</Text>
        </View>
      </View>

      {/* Chart Canvas */}
      <View style={[styles.chartContainer, { height: CHART_HEIGHT + 45 }]}>
        {/* Background guideline lines */}
        <View style={styles.guidelines}>
          <View style={styles.guideline} />
          <View style={styles.guideline} />
          <View style={styles.guideline} />
        </View>

        {/* Bars Row */}
        <View style={styles.barsRow}>
          {data.map((bar, index) => {
            const isMax = bar.value === maxValue;
            const barHeight = Math.max(
              Math.round((bar.value / maxValue) * CHART_HEIGHT),
              8
            );

            return (
              <View key={`${bar.label}-${index}`} style={styles.barColumn}>
                {/* Bar Value Tooltip */}
                <Text
                  style={[styles.barValueText, isMax && styles.barValueTextHighlight]}
                  numberOfLines={1}
                >
                  {bar.displayValue}
                </Text>

                {/* The Bar Track & Bar */}
                <View style={[styles.barTrack, { height: CHART_HEIGHT }]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight },
                      isMax ? styles.barFillMax : styles.barFillStandard,
                    ]}
                  />
                </View>

                {/* Label */}
                <Text
                  style={[styles.barLabelText, isMax && styles.barLabelTextHighlight]}
                  numberOfLines={1}
                >
                  {bar.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: WarungkuColors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: WarungkuColors.primary,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'flex-end',
  },
  guidelines: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    bottom: 25,
    justifyContent: 'space-between',
  },
  guideline: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 4,
    textAlign: 'center',
  },
  barValueTextHighlight: {
    color: WarungkuColors.primary,
    fontWeight: '700',
  },
  barTrack: {
    width: '100%',
    maxWidth: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barFillStandard: {
    backgroundColor: WarungkuColors.primaryContainer,
  },
  barFillMax: {
    backgroundColor: WarungkuColors.primary,
  },
  barLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  barLabelTextHighlight: {
    color: WarungkuColors.primary,
    fontWeight: '700',
  },
});
