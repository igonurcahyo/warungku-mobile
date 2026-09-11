import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WarungkuColors } from '@/constants/colors';
import { AppIcon } from '@/components/ui/app-icon';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Calculate bottom padding based on platform and safe area
  const bottomPadding = Platform.OS === 'ios'
    ? insets.bottom
    : Math.max(insets.bottom, 6);

  const tabBarHeight = 58 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: WarungkuColors.primary,
        tabBarInactiveTintColor: WarungkuColors.secondaryText,
        tabBarStyle: {
          backgroundColor: WarungkuColors.card,
          borderTopColor: WarungkuColors.outlineVariant,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        },
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 1. Beranda */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="home" size={22} color={color} focused={focused} />
          ),
        }}
      />

      {/* 2. Kasir */}
      <Tabs.Screen
        name="pos"
        options={{
          title: 'Kasir',
          tabBarLabel: 'Kasir',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="pos" size={22} color={color} focused={focused} />
          ),
        }}
      />

      {/* 3. Produk */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produk',
          tabBarLabel: 'Produk',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="products" size={22} color={color} focused={focused} />
          ),
        }}
      />

      {/* 4. Stok */}
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Stok',
          tabBarLabel: 'Stok',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="stock" size={22} color={color} focused={focused} />
          ),
        }}
      />

      {/* 5. Riwayat */}
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Riwayat',
          tabBarLabel: 'Riwayat',
          tabBarIcon: ({ color, focused }) => (
            <AppIcon name="transactions" size={22} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    minHeight: 46,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
