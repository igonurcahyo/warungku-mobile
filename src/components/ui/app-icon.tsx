import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';

export type AppIconName =
  | 'home'
  | 'pos'
  | 'products'
  | 'stock'
  | 'transactions'
  | 'bell'
  | 'user'
  | 'wallet'
  | 'receipt'
  | 'box'
  | 'alert-triangle'
  | 'chevron-right'
  | 'arrow-right'
  | 'check'
  | 'search'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'x'
  | 'cart'
  | 'check-circle';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: ColorValue | string;
  focused?: boolean;
}

export function AppIcon({ name, size = 22, color = '#181C1A', focused = false }: AppIconProps) {
  const s = size;
  const stroke = 1.75;

  switch (name) {
    case 'home':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Roof triangle */}
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: s * 0.44,
              borderRightWidth: s * 0.44,
              borderBottomWidth: s * 0.36,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          {/* House body */}
          <View
            style={{
              width: s * 0.64,
              height: s * 0.42,
              backgroundColor: focused ? color : 'transparent',
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Door */}
            <View
              style={{
                width: s * 0.22,
                height: s * 0.26,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          </View>
        </View>
      );

    case 'pos':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Screen / Monitor */}
          <View
            style={{
              width: s * 0.78,
              height: s * 0.48,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
              padding: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Inner screen line */}
            <View
              style={{
                width: '70%',
                height: 2,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
          </View>
          {/* Stand pole */}
          <View
            style={{
              width: 2.5,
              height: s * 0.14,
              backgroundColor: color,
            }}
          />
          {/* Register base */}
          <View
            style={{
              width: s * 0.85,
              height: s * 0.16,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
        </View>
      );

    case 'products':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Box outline */}
          <View
            style={{
              width: s * 0.75,
              height: s * 0.75,
              borderRadius: 4,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 2,
            }}
          >
            {/* Top box lid flap indicator */}
            <View
              style={{
                width: '60%',
                height: stroke,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
            {/* Front tape line */}
            <View
              style={{
                width: stroke,
                height: '50%',
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      );

    case 'stock':
      return (
        <View style={[styles.center, { width: s, height: s, justifyContent: 'center', gap: 2.5 }]}>
          {/* 3 stack layers representing inventory shelves / layers */}
          <View
            style={{
              width: s * 0.8,
              height: s * 0.18,
              borderRadius: 2.5,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              width: s * 0.8,
              height: s * 0.18,
              borderRadius: 2.5,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
            }}
          />
          <View
            style={{
              width: s * 0.8,
              height: s * 0.18,
              borderRadius: 2.5,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
        </View>
      );

    case 'transactions':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Receipt container */}
          <View
            style={{
              width: s * 0.65,
              height: s * 0.82,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
              paddingHorizontal: 3,
              paddingVertical: 4,
              justifyContent: 'space-between',
            }}
          >
            {/* Receipt lines */}
            <View
              style={{
                width: '80%',
                height: stroke,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
            <View
              style={{
                width: '100%',
                height: stroke,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
            <View
              style={{
                width: '60%',
                height: stroke,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
            <View
              style={{
                width: '85%',
                height: stroke,
                backgroundColor: focused ? '#FFFFFF' : color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      );

    case 'bell':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Bell top dot */}
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: color,
              marginBottom: 1,
            }}
          />
          {/* Bell dome */}
          <View
            style={{
              width: s * 0.62,
              height: s * 0.54,
              borderTopLeftRadius: s * 0.31,
              borderTopRightRadius: s * 0.31,
              borderWidth: stroke,
              borderColor: color,
              borderBottomWidth: 0,
              backgroundColor: 'transparent',
            }}
          />
          {/* Bell rim */}
          <View
            style={{
              width: s * 0.78,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
          {/* Bell clapper dot */}
          <View
            style={{
              width: 4,
              height: 2.5,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: color,
              marginTop: 1,
            }}
          />
        </View>
      );

    case 'user':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Head */}
          <View
            style={{
              width: s * 0.38,
              height: s * 0.38,
              borderRadius: (s * 0.38) / 2,
              borderWidth: stroke,
              borderColor: color,
              marginBottom: 2,
            }}
          />
          {/* Body/Shoulders */}
          <View
            style={{
              width: s * 0.7,
              height: s * 0.32,
              borderTopLeftRadius: s * 0.35,
              borderTopRightRadius: s * 0.35,
              borderWidth: stroke,
              borderColor: color,
              borderBottomWidth: 0,
            }}
          />
        </View>
      );

    case 'wallet':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.85,
              height: s * 0.64,
              borderRadius: 4,
              borderWidth: stroke,
              borderColor: color,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 2,
            }}
          >
            {/* Clasp */}
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );

    case 'receipt':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.65,
              height: s * 0.8,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
              padding: 3,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ width: '80%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: '100%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: '60%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );

    case 'box':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.78,
              height: s * 0.78,
              borderRadius: 4,
              borderWidth: stroke,
              borderColor: color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: '60%', height: stroke, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );

    case 'alert-triangle':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderLeftWidth: s * 0.42,
              borderRightWidth: s * 0.42,
              borderBottomWidth: s * 0.72,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          />
          {/* Exclamation dot overlay */}
          <View
            style={{
              position: 'absolute',
              bottom: s * 0.16,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 2,
                height: s * 0.22,
                backgroundColor: '#FFFFFF',
                borderRadius: 1,
                marginBottom: 2,
              }}
            />
            <View
              style={{
                width: 2,
                height: 2,
                borderRadius: 1,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        </View>
      );

    case 'chevron-right':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.4,
              height: s * 0.4,
              borderTopWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginLeft: -s * 0.1,
            }}
          />
        </View>
      );

    case 'arrow-right':
      return (
        <View style={[styles.center, { width: s, height: s, flexDirection: 'row' }]}>
          <View
            style={{
              width: s * 0.5,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: s * 0.3,
              height: s * 0.3,
              borderTopWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginLeft: -s * 0.15,
            }}
          />
        </View>
      );

    case 'check':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.55,
              height: s * 0.3,
              borderBottomWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              marginTop: -s * 0.1,
            }}
          />
        </View>
      );

    case 'search':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.52,
              height: s * 0.52,
              borderRadius: (s * 0.52) / 2,
              borderWidth: stroke,
              borderColor: color,
              marginTop: -s * 0.1,
              marginLeft: -s * 0.1,
            }}
          />
          <View
            style={{
              width: s * 0.28,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              right: s * 0.14,
              bottom: s * 0.16,
            }}
          />
        </View>
      );

    case 'plus':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.65,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              position: 'absolute',
            }}
          />
          <View
            style={{
              width: stroke,
              height: s * 0.65,
              backgroundColor: color,
              borderRadius: 1,
              position: 'absolute',
            }}
          />
        </View>
      );

    case 'minus':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.65,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        </View>
      );

    case 'trash':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Lid */}
          <View
            style={{
              width: s * 0.65,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              marginBottom: 1.5,
            }}
          />
          {/* Can */}
          <View
            style={{
              width: s * 0.5,
              height: s * 0.55,
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <View style={{ width: stroke * 0.8, height: '60%', backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: stroke * 0.8, height: '60%', backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );

    case 'x':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.6,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              position: 'absolute',
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              width: s * 0.6,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              position: 'absolute',
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );

    case 'cart':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          {/* Basket */}
          <View
            style={{
              width: s * 0.68,
              height: s * 0.45,
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              backgroundColor: focused ? color : 'transparent',
              marginBottom: 2,
            }}
          />
          {/* Handle */}
          <View
            style={{
              width: s * 0.44,
              height: s * 0.28,
              borderWidth: stroke,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              position: 'absolute',
              top: s * 0.12,
            }}
          />
          {/* Wheels */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: s * 0.5,
              marginTop: 1,
            }}
          >
            <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
            <View style={{ width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: color }} />
          </View>
        </View>
      );

    case 'check-circle':
      return (
        <View style={[styles.center, { width: s, height: s }]}>
          <View
            style={{
              width: s * 0.85,
              height: s * 0.85,
              borderRadius: (s * 0.85) / 2,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: s * 0.38,
                height: s * 0.22,
                borderBottomWidth: stroke,
                borderLeftWidth: stroke,
                borderColor: focused ? '#FFFFFF' : color,
                transform: [{ rotate: '-45deg' }],
                marginTop: -s * 0.05,
              }}
            />
          </View>
        </View>
      );

    default:
      return <View style={{ width: s, height: s }} />;
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
