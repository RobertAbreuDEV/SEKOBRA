import { useWindowDimensions } from 'react-native';
import { spacing } from '../theme';

const TABLET_MIN_SIDE = 600;
const CONTENT_MAX_WIDTH = 760;
const TWO_COLUMN_MIN_WIDTH = 700;
const DIALOG_MAX_WIDTH = 560;

export interface Responsive {
  isTablet: boolean;
  /** Ancho de la columna de contenido centrada. */
  contentWidth: number;
  /** Margen lateral para centrar el contenido. */
  gutter: number;
  columns: 1 | 2;
  /** Ancho máximo de formularios y bottom sheets. */
  dialogMaxWidth: number;
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_SIDE;
  const basePadding = isTablet ? spacing.xxl : spacing.lg;
  const contentWidth = Math.min(width - basePadding * 2, CONTENT_MAX_WIDTH);

  return {
    isTablet,
    contentWidth,
    gutter: (width - contentWidth) / 2,
    columns: contentWidth >= TWO_COLUMN_MIN_WIDTH ? 2 : 1,
    dialogMaxWidth: isTablet ? DIALOG_MAX_WIDTH : width,
  };
}
