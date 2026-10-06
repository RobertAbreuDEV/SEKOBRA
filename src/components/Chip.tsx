import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  label: string;
  tone?: 'neutral' | 'accent';
}

export function Chip({ label, tone = 'neutral' }: Props) {
  const accent = tone === 'accent';
  return (
    <View style={[styles.chip, accent && styles.accentChip]}>
      <Text style={[styles.text, accent && styles.accentText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  accentChip: { backgroundColor: colors.accent, paddingHorizontal: spacing.sm },
  text: { fontSize: 11, color: colors.chipText, fontWeight: '500' },
  accentText: { color: colors.text, fontWeight: '600' },
});
