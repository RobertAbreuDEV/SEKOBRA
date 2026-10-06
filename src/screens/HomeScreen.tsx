import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { Logo } from '../components/Logo';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { TotalCard } from '../components/TotalCard';
import { monthlyTotal } from '../dates';
import { useResponsive } from '../hooks/useResponsive';
import { colors, spacing, typography } from '../theme';
import type { Subscription } from '../types';

interface Props {
  subs: Subscription[];
  loading: boolean;
  onAdd: () => void;
  onOpen: (sub: Subscription) => void;
  onMenu: () => void;
}

const GRID_GAP = spacing.sm + 2;

export function HomeScreen({ subs, loading, onAdd, onOpen, onMenu }: Props) {
  const { gutter, contentWidth, columns } = useResponsive();
  const total = useMemo(() => monthlyTotal(subs), [subs]);
  // Se recalcula con cada cambio de la lista para que "hoy"/"en N días" no queden viejos.
  const now = useMemo(() => new Date(), [subs]);
  const cardWidth = columns === 2 ? (contentWidth - GRID_GAP) / 2 : contentWidth;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingHorizontal: gutter }]}>
        <Logo />
        <Pressable onPress={onMenu} hitSlop={12} accessibilityRole="button" accessibilityLabel="Más opciones">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : subs.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}>
          <TotalCard total={total} count={subs.length} />
          <Text style={styles.section}>Próximos cobros</Text>
          <View style={styles.grid}>
            {subs.map((sub) => (
              <View key={sub.id} style={{ width: cardWidth }}>
                <SubscriptionCard sub={sub} now={now} onPress={onOpen} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <Fab onPress={onAdd} style={{ right: gutter, bottom: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 96 },
  section: { ...typography.section, marginTop: spacing.xxl, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
});
