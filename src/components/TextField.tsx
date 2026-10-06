import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface Props extends Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'autoFocus' | 'returnKeyType' | 'onSubmitEditing'> {
  label: string;
  error?: string;
}

export function TextField({ label, error, ...input }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export const fieldStyles = StyleSheet.create({
  box: {
    height: 44,
    backgroundColor: colors.input,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg - 2,
  },
});

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  label: typography.label,
  input: { ...fieldStyles.box, color: colors.text, fontSize: 15 },
  inputError: { borderColor: colors.accent },
  error: { fontSize: 12, color: colors.accent },
});
