import { Image, StyleSheet, Text, View } from 'react-native';
import { WORDMARK_RATIO, WORDMARK_SOURCE } from '../brand';
import { useResponsive } from '../hooks/useResponsive';
import { spacing, typography } from '../theme';

export function Logo() {
  const { isTablet } = useResponsive();
  const width = isTablet ? 176 : 136;
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="SEKOBRA. Tus cobros bajo control.">
      <Image source={WORDMARK_SOURCE} style={{ width, height: width * WORDMARK_RATIO }} resizeMode="contain" />
      <Text style={styles.tagline}>Tus cobros bajo control.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tagline: { ...typography.caption, marginTop: spacing.xs + 2 },
});
