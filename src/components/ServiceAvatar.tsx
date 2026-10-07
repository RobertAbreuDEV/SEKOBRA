import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { radius } from '../theme';

interface Brand {
  background: string;
  foreground: string;
}

// Colores propios de algunos servicios para el fondo cuando no hay logo.
const BRANDS: ReadonlyArray<[RegExp, Brand]> = [
  [/netflix/i, { background: '#0B0B0B', foreground: '#E50914' }],
];

// Dominios de servicios cuyo nombre no coincide con "<nombre>.com".
const DOMAINS: ReadonlyArray<[RegExp, string]> = [
  [/disney/i, 'disneyplus.com'],
  [/hbo|^max$/i, 'max.com'],
  [/prime|amazon/i, 'primevideo.com'],
  [/apple\s*tv/i, 'tv.apple.com'],
  [/apple\s*music/i, 'music.apple.com'],
  [/icloud/i, 'icloud.com'],
  [/youtube/i, 'youtube.com'],
  [/xbox|game\s*pass/i, 'xbox.com'],
  [/playstation|ps\s*plus/i, 'playstation.com'],
  [/chatgpt|openai/i, 'openai.com'],
  [/claude/i, 'claude.ai'],
  [/google\s*one/i, 'one.google.com'],
  [/office|microsoft\s*365/i, 'microsoft.com'],
  [/paramount/i, 'paramountplus.com'],
  [/crunchyroll/i, 'crunchyroll.com'],
];

const FALLBACK = ['#7C3AED', '#0EA5E9', '#F59E0B', '#10B981', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

function brandFor(name: string): Brand {
  const match = BRANDS.find(([pattern]) => pattern.test(name));
  if (match) return match[1];
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return { background: FALLBACK[Math.abs(hash) % FALLBACK.length], foreground: '#FFFFFF' };
}

function domainFor(name: string): string | null {
  const match = DOMAINS.find(([pattern]) => pattern.test(name));
  if (match) return match[1];
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]/g, '');
  return slug ? `${slug}.com` : null;
}

const logoUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

interface Props {
  name: string;
  size?: number;
}

export function ServiceAvatar({ name, size = 40 }: Props) {
  const { background, foreground } = brandFor(name);
  const domain = domainFor(name);
  const [failedDomain, setFailedDomain] = useState<string | null>(null);
  const showLogo = domain !== null && failedDomain !== domain;
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, backgroundColor: showLogo ? '#dfd9d901' : background },
      ]}
    >
      {showLogo ? (
        <Image
          source={{ uri: logoUrl(domain) }}
          style={{ width: size, height: size }}
          resizeMode="cover"
          onError={() => setFailedDomain(domain)}
        />
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
