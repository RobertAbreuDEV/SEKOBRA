import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.selected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md - 2 },
  selected: { backgroundColor: colors.accent },
  label: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  selectedLabel: { color: colors.text, fontWeight: '600' },
});
