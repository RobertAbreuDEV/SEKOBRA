import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from './Button';

interface Props {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.icon}>
        <Ionicons name="calendar-outline" size={76} color={colors.accent} />
        <View style={styles.badge}>
          <Ionicons name="add" size={22} color={colors.text} />
        </View>
      </View>
      <Text style={styles.title}>{'Aún no tienes\nsuscripciones'}</Text>
      <Text style={styles.body}>
        Agrega tus suscripciones y lleva un control de tus cobros mensuales y anuales.
      </Text>
      <Button label="Agregar la primera" onPress={onAdd} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, maxWidth: 400, alignSelf: 'center' },
  icon: { marginBottom: spacing.xxl },
  badge: {
    position: 'absolute',
    right: -6,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: typography.emptyTitle,
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.lg,
  },
  button: { marginTop: spacing.xxl, minWidth: 240 },
});
