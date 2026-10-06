import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Logo } from '../components/Logo';
import { useResponsive } from '../hooks/useResponsive';
import { colors, spacing, typography } from '../theme';

interface Props {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
}

/** Historial y Más aparecen en la barra del diseño, pero aún no tienen pantalla definida. */
export function PlaceholderScreen({ icon, title }: Props) {
  const { gutter } = useResponsive();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingHorizontal: gutter }]}>
        <Logo />
      </View>
      <View style={styles.center}>
        <Ionicons name={icon} size={56} color={colors.textDisabled} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>Próximamente</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.md, paddingBottom: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  title: { ...typography.title, marginTop: spacing.sm },
  body: typography.caption,
});
