import type { ImageSourcePropType } from 'react-native';

/** Alto / ancho del wordmark SEKOBRA (assets/brand/wordmark.png). */
export const WORDMARK_RATIO = 530 / 3702;

export interface WordmarkPiece {
  source: ImageSourcePropType;
  /** Posición y tamaño relativos al wordmark completo (0–1). */
  left: number;
  top: number;
  width: number;
  height: number;
}

// Generado por scripts/make_brand_assets.py.
export const WORDMARK_PIECES = {
  sek: { source: require('../assets/brand/wordmark-sek.png'), left: 0, top: 0, width: 0.39897, height: 1 },
  o: { source: require('../assets/brand/wordmark-o.png'), left: 0.39789, top: 0, width: 0.15316, height: 1 },
  bra: { source: require('../assets/brand/wordmark-bra.png'), left: 0.56753, top: 0.01887, width: 0.43247, height: 0.96226 },
} satisfies Record<'sek' | 'o' | 'bra', WordmarkPiece>;

export const WORDMARK_SOURCE: ImageSourcePropType = require('../assets/brand/wordmark.png');

/** Debe coincidir con `imageWidth` del plugin expo-splash-screen en app.json. */
export const NATIVE_SPLASH_IMAGE_WIDTH = 120;
