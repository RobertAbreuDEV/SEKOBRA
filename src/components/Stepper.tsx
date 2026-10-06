import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { fieldStyles } from './TextField';

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
}

export function Stepper({ value, min, max, onChange, accessibilityLabel }: Props) {
  const canDecrement = value > min;
  const canIncrement = value < max;
  return (
    <View
      style={styles.box}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment' && canIncrement) onChange(value + 1);
        if (e.nativeEvent.actionName === 'decrement' && canDecrement) onChange(value - 1);
      }}
    >
      <Pressable style={styles.button} onPress={() => onChange(value - 1)} disabled={!canDecrement} hitSlop={8}>
        <Ionicons name="remove" size={22} color={canDecrement ? colors.text : colors.textDisabled} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable style={styles.button} onPress={() => onChange(value + 1)} disabled={!canIncrement} hitSlop={8}>
        <Ionicons name="add" size={22} color={canIncrement ? colors.text : colors.textDisabled} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    ...fieldStyles.box,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  button: { width: 44, height: '100%', alignItems: 'center', justifyContent: 'center' },
  value: { flex: 1, textAlign: 'center', color: colors.text, fontSize: 15, fontWeight: '500' },
});
