import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme';

interface Props {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Fab({ onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Agregar suscripción"
      style={({ pressed }) => [styles.fab, pressed && styles.pressed, style]}
    >
      <Ionicons name="add" size={32} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: { backgroundColor: colors.accentPressed },
});
