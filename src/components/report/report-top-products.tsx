import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarungkuColors } from '@/constants/colors';
import { TopProductItem, formatRupiahCompact } from '@/constants/report-data';
import { AppIcon } from '@/components/ui/app-icon';

interface ReportTopProductsProps {
  products: TopProductItem[];
}

export function ReportTopProducts({ products }: ReportTopProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Produk Terlaris</Text>
          <Text style={styles.cardSubtitle}>Paling banyak terjual periode ini</Text>
        </View>
        <View style={styles.badge}>
          <AppIcon name="award" size={14} color={WarungkuColors.secondaryContainer} />
          <Text style={styles.badgeText}>Top 5</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        {products.map((item, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < products.length - 1 && styles.itemSeparator,
              ]}
            >
              {/* Rank Number Badge */}
              <View
                style={[
                  styles.rankBadge,
                  rank === 1 && styles.rankBadge1,
                  rank === 2 && styles.rankBadge2,
                  rank === 3 && styles.rankBadge3,
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    isTop3 && styles.rankTextTop3,
                  ]}
                >
                  {rank}
                </Text>
              </View>

              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.productName}
                </Text>
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.revenueText}>{formatRupiahCompact(item.revenue)}</Text>
                </View>
              </View>

              {/* Sold Count */}
              <View style={styles.soldBadge}>
                <Text style={styles.soldCountText}>{item.soldCount}</Text>
                <Text style={styles.soldLabelText}>terjual</Text>
              </View>
            </View>
          );
        })}
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
    marginBottom: 14,
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
    backgroundColor: '#FEF3E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: WarungkuColors.secondaryContainer,
  },
  listContainer: {
    gap: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge1: {
    backgroundColor: WarungkuColors.primary,
  },
  rankBadge2: {
    backgroundColor: WarungkuColors.primaryContainer,
  },
  rankBadge3: {
    backgroundColor: WarungkuColors.secondaryContainer,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  rankTextTop3: {
    color: '#FFFFFF',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: WarungkuColors.text,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  dotSeparator: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  revenueText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  soldBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#EAEFE9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  soldCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: WarungkuColors.primary,
  },
  soldLabelText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: -1,
  },
});
