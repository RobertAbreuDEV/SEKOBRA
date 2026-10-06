import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Variant = 'primary' | 'outline';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  size?: 'md' | 'sm';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, size = 'md', disabled, style }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        primary ? styles.primary : styles.outline,
        pressed && (primary ? styles.primaryPressed : styles.outlinePressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={colors.text} />}
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
  },
  md: { height: 46 },
  sm: { height: 38 },
  primary: { backgroundColor: colors.accent },
  primaryPressed: { backgroundColor: colors.accentPressed },
  outline: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: 'transparent' },
  outlinePressed: { backgroundColor: colors.surface },
  disabled: { opacity: 0.5 },
  label: { color: colors.text, fontSize: 15, fontWeight: '600' },
  labelSm: { fontSize: 13 },
});
