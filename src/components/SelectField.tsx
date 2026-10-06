import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing, typography } from '../theme';
import { fieldStyles } from './TextField';

interface Option {
  value: number;
  label: string;
}

interface Props {
  label: string;
  value: number;
  options: ReadonlyArray<Option>;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const ROW_HEIGHT = 48;

export function SelectField({ label, value, options, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const { dialogMaxWidth } = useResponsive();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  return (
    <View style={styles.field}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      <Pressable
        style={[styles.box, disabled && styles.boxDisabled]}
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? ''}`}
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.value, disabled && styles.valueDisabled]}>{selected?.label}</Text>
        <Ionicons name="chevron-down" size={18} color={disabled ? colors.textDisabled : colors.text} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { maxWidth: Math.min(dialogMaxWidth, 420) }]}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              initialScrollIndex={selectedIndex}
              getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.rowLabel, isSelected && styles.rowSelected]}>{item.label}</Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.accent} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  label: typography.label,
  labelDisabled: { color: colors.text },
  box: {
    ...fieldStyles.box,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boxDisabled: { borderColor: colors.border },
  value: { color: colors.text, fontSize: 15 },
  valueDisabled: { color: colors.textDisabled },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  sheet: {
    width: '100%',
    maxHeight: '60%',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: spacing.sm,
  },
  sheetTitle: { ...typography.section, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  row: {
    height: ROW_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowPressed: { backgroundColor: colors.surface },
  rowLabel: { color: colors.text, fontSize: 15 },
  rowSelected: { color: colors.accent, fontWeight: '600' },
});
