import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { NATIVE_SPLASH_IMAGE_WIDTH, WORDMARK_PIECES, WORDMARK_RATIO, type WordmarkPiece } from '../brand';
import { colors, spacing, typography } from '../theme';

interface Props {
  /** La app terminó de cargar; el splash puede salir cuando acabe la animación. */
  ready: boolean;
  onFinish: () => void;
}

const { sek, o, bra } = WORDMARK_PIECES;
const O_RATIO = (o.height * WORDMARK_RATIO) / o.width;

/**
 * Continúa el splash nativo (la "O" sola, centrada) con:
 * 1. la O gira una vuelta, 2. se encoge a su lugar mientras SEK y BRA salen de detrás,
 * 3. aparece el lema, 4. todo se desvanece y deja ver la app.
 */
export function AnimatedSplash({ ready, onFinish }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const wordmarkWidth = Math.min(screenWidth * 0.74, 460);
  const wordmarkHeight = wordmarkWidth * WORDMARK_RATIO;

  // La O se dibuja al tamaño del splash nativo y se encoge (escalar hacia abajo mantiene la nitidez).
  const bigOWidth = NATIVE_SPLASH_IMAGE_WIDTH;
  const bigOHeight = bigOWidth * O_RATIO;
  const finalOScale = (o.width * wordmarkWidth) / bigOWidth;
  const oCenterX = (o.left + o.width / 2) * wordmarkWidth;
  const startOffsetX = wordmarkWidth / 2 - oCenterX;

  const spin = useRef(new Animated.Value(0)).current;
  const assemble = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const [introDone, setIntroDone] = useState(false);
  const started = useRef(false);

  const start = async () => {
    if (started.current) return;
    started.current = true;
    await SplashScreen.hideAsync().catch(() => undefined);

    if (await AccessibilityInfo.isReduceMotionEnabled()) {
      spin.setValue(1);
      assemble.setValue(1);
      tagline.setValue(1);
      setIntroDone(true);
      return;
    }

    Animated.sequence([
      Animated.timing(spin, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(assemble, { toValue: 1, duration: 650, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      Animated.timing(tagline, { toValue: 1, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(450),
    ]).start(() => setIntroDone(true));
  };

  useEffect(() => {
    if (!introDone || !ready) return;
    Animated.timing(exit, { toValue: 1, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(
      ({ finished }) => finished && onFinish(),
    );
  }, [introDone, ready, exit, onFinish]);

  const oStyle = {
    left: oCenterX - bigOWidth / 2,
    top: (wordmarkHeight - bigOHeight) / 2,
    width: bigOWidth,
    height: bigOHeight,
    transform: [
      { translateX: assemble.interpolate({ inputRange: [0, 1], outputRange: [startOffsetX, 0] }) },
      {
        scale: Animated.add(
          assemble.interpolate({ inputRange: [0, 1], outputRange: [1, finalOScale] }),
          // Pequeño "latido" mientras gira.
          spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.08, 0] }),
        ),
      },
      { rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
    ],
  };

  const sideStyle = (piece: WordmarkPiece, from: number) => ({
    left: piece.left * wordmarkWidth,
    top: piece.top * wordmarkHeight,
    width: piece.width * wordmarkWidth,
    height: piece.height * wordmarkHeight,
    opacity: assemble.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 0.6, 1] }),
    transform: [{ translateX: assemble.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
  });

  return (
    <Animated.View
      style={[
        styles.root,
        {
          opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [{ scale: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
        },
      ]}
      pointerEvents={introDone && ready ? 'none' : 'auto'}
      accessible
      accessibilityLabel="SEKOBRA"
    >
      <View style={{ width: wordmarkWidth, height: wordmarkHeight }}>
        <Animated.Image source={sek.source} resizeMode="contain" style={[styles.piece, sideStyle(sek, wordmarkWidth * 0.18)]} />
        <Animated.Image source={bra.source} resizeMode="contain" style={[styles.piece, sideStyle(bra, -wordmarkWidth * 0.18)]} />
        {/* Arranca cuando la O ya está pintada, para relevar al splash nativo sin parpadeo. */}
        <Animated.Image source={o.source} resizeMode="contain" style={[styles.piece, oStyle]} onLoad={start} onError={start} />
        {/* Posicionado fuera del flujo para que la O quede en el centro exacto, como en el splash nativo. */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              top: wordmarkHeight + spacing.lg,
              opacity: tagline,
              transform: [{ translateY: tagline.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
            },
          ]}
        >
          Tus cobros bajo control.
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  piece: { position: 'absolute' },
  tagline: {
    ...typography.body,
    position: 'absolute',
    left: -spacing.xxl,
    right: -spacing.xxl,
    textAlign: 'center',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
});
