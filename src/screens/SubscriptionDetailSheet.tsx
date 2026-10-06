import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { ServiceAvatar } from '../components/ServiceAvatar';
import { daysUntil, formatDate, formatDaysUntil, monthlyCost, nextChargeDate } from '../dates';
import { formatCurrency } from '../format';
import { colors, spacing, typography } from '../theme';
import type { Subscription } from '../types';

interface Props {
  sub: Subscription | undefined;
  onClose: () => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (sub: Subscription) => void;
}

export function SubscriptionDetailSheet({ sub, onClose, onEdit, onDelete }: Props) {
  return (
    <BottomSheet visible={sub !== undefined} onClose={onClose}>
      {sub && <DetailContent sub={sub} onEdit={onEdit} onDelete={onDelete} />}
    </BottomSheet>
  );
}

function DetailContent({ sub, onEdit, onDelete }: { sub: Subscription } & Pick<Props, 'onEdit' | 'onDelete'>) {
  const now = new Date();
  const next = nextChargeDate(sub, now);
  const days = daysUntil(next, now);
  const remind = sub.remindDaysBefore;

  return (
    <View>
      <View style={styles.header}>
        <ServiceAvatar name={sub.name} size={44} />
        <Text style={styles.name} numberOfLines={1}>
          {sub.name}
        </Text>
        <View style={styles.headerRight}>
          <Text style={styles.price}>{formatCurrency(sub.price)}</Text>
          <Chip label={sub.cycle === 'monthly' ? 'mensual' : 'anual'} />
        </View>
      </View>

      <Row icon="calendar-outline" label="Próximo cobro" value={`${formatDate(next)}   ·   ${formatDaysUntil(days)}`} />
      <Row icon="sync-outline" label="Ciclo" value={sub.cycle === 'monthly' ? 'Mensual' : 'Anual'} />
      <Row icon="calculator-outline" label="Costo mensual equivalente" value={formatCurrency(monthlyCost(sub))} />
      <Row
        icon="notifications-outline"
        label="Avisar con"
        value={remind === 0 ? 'El mismo día del cobro' : `${remind} ${remind === 1 ? 'día' : 'días'} de anticipación`}
        last
      />

      <View style={styles.actions}>
        <Button label="Editar" icon="pencil-outline" variant="outline" size="sm" onPress={() => onEdit(sub)} style={styles.action} />
        <Button label="Eliminar" icon="trash-outline" size="sm" onPress={() => onDelete(sub)} style={styles.action} />
      </View>
    </View>
  );
}

interface RowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  last?: boolean;
}

function Row({ icon, label, value, last }: RowProps) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <Ionicons name={icon} size={24} color={colors.text} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md + 2,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  name: { ...typography.title, flex: 1, fontSize: 17 },
  headerRight: { alignItems: 'flex-end', gap: spacing.xs + 1 },
  price: typography.bodyStrong,
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.xs },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 12, color: colors.textSecondary },
  rowValue: { fontSize: 13, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1 },
});
