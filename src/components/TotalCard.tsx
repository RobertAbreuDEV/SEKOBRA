import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '../format';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  total: number;
  count: number;
}

export function TotalCard({ total, count }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total mensual</Text>
      <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>
        {formatCurrency(total)}
      </Text>
      <Text style={styles.count}>
        {count} {count === 1 ? 'suscripción' : 'suscripciones'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  label: { ...typography.body, color: colors.textSecondary },
  amount: { ...typography.display, marginTop: spacing.xs },
  count: { ...typography.caption, marginTop: spacing.sm },
});
