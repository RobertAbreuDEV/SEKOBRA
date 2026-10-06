import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { radius } from '../theme';

interface Brand {
  background: string;
  foreground: string;
  /** Logo opcional, p. ej. require('../../assets/logos/netflix.png'). */
  logo?: ImageSourcePropType;
}

// Agrega aquí los logos de cada servicio. Netflix queda como ejemplo.
const BRANDS: ReadonlyArray<[RegExp, Brand]> = [
  [/netflix/i, { background: '#0B0B0B', foreground: '#E50914' }],
];

const FALLBACK = ['#7C3AED', '#0EA5E9', '#F59E0B', '#10B981', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

function brandFor(name: string): Brand {
  const match = BRANDS.find(([pattern]) => pattern.test(name));
  if (match) return match[1];
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return { background: FALLBACK[Math.abs(hash) % FALLBACK.length], foreground: '#FFFFFF' };
}

interface Props {
  name: string;
  size?: number;
}

export function ServiceAvatar({ name, size = 40 }: Props) {
  const { background, foreground, logo } = brandFor(name);
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.box, { width: size, height: size, backgroundColor: background }]}>
      {logo ? (
        <Image source={logo} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <Text style={[styles.initial, { color: foreground, fontSize: size * 0.55 }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initial: { fontWeight: '900' },
});
