import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export type TabKey = 'home' | 'history' | 'more';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: ReadonlyArray<{ key: TabKey; label: string; icon: IconName; activeIcon: IconName }> = [
  { key: 'home', label: 'Inicio', icon: 'home-outline', activeIcon: 'home' },
  { key: 'history', label: 'Historial', icon: 'time-outline', activeIcon: 'time' },
  { key: 'more', label: 'Más', icon: 'menu-outline', activeIcon: 'menu' },
];

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function TabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {TABS.map((tab) => {
        const selected = tab.key === active;
        const color = selected ? colors.accent : colors.textSecondary;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Ionicons name={selected ? tab.activeIcon : tab.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 12, fontWeight: '500' },
});
