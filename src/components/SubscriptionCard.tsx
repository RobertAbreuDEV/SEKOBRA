import { Pressable, StyleSheet, Text, View } from 'react-native';
import { daysUntil, formatChargeDate, formatDaysUntil, nextChargeDate } from '../dates';
import { formatCurrency } from '../format';
import { colors, radius, spacing, typography, URGENT_DAYS } from '../theme';
import type { Subscription } from '../types';
import { Chip } from './Chip';
import { ServiceAvatar } from './ServiceAvatar';

interface Props {
  sub: Subscription;
  now: Date;
  onPress: (sub: Subscription) => void;
}

export function SubscriptionCard({ sub, now, onPress }: Props) {
  const next = nextChargeDate(sub, now);
  const days = daysUntil(next, now);
  const urgent = days < URGENT_DAYS;

  return (
    <Pressable
      onPress={() => onPress(sub)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${sub.name}, ${formatCurrency(sub.price)}, ${formatDaysUntil(days)}`}
    >
      {urgent && <View style={styles.urgentBar} />}
      <ServiceAvatar name={sub.name} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {sub.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{formatChargeDate(next, now)}</Text>
          <Text style={styles.dot}>·</Text>
          {days === 0 ? <Chip label="hoy" tone="accent" /> : <Text style={styles.meta}>{formatDaysUntil(days)}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{formatCurrency(sub.price)}</Text>
        <Chip label={sub.cycle === 'monthly' ? 'mensual' : 'anual'} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md + 2,
    paddingRight: spacing.md,
    gap: spacing.md + 2,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.8 },
  urgentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
  },
  info: { flex: 1, gap: spacing.xs + 1 },
  name: typography.bodyStrong,
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm - 2 },
  meta: { ...typography.caption, color: colors.textSecondary },
  dot: { ...typography.caption, color: colors.textSecondary },
  right: { alignItems: 'flex-end', gap: spacing.xs + 1 },
  price: typography.bodyStrong,
});
