import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, children }: Props) {
  const insets = useSafeAreaInsets();
  const { isTablet, dialogMaxWidth } = useResponsive();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar" />
        <View
          style={[
            styles.sheet,
            { maxWidth: dialogMaxWidth, paddingBottom: Math.max(insets.bottom, spacing.lg) },
            isTablet && styles.sheetTablet,
          ]}
        >
          <View style={styles.handle} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: colors.overlay },
  sheet: {
    width: '100%',
    backgroundColor: colors.surfaceRaised,
    borderTopLeftRadius: radius.lg + 6,
    borderTopRightRadius: radius.lg + 6,
    borderColor: colors.border,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  sheetTablet: { marginBottom: spacing.xxl, borderRadius: radius.lg + 6, borderBottomWidth: 1 },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.handle,
    marginBottom: spacing.md,
  },
});
