export type CubeFace = { glyph: string; bg: string; fg: string; target?: string; label?: string };

const INK = '#0b0b0b';
const ACCENT = '#ff5a1f';
const WHITE = '#ffffff';

/** Three.js BoxGeometry malzeme sırasıyla: +x (sağ), -x (sol), +y (üst), -y (alt), +z (ön), -z (arka). */
export const CUBE_FACES: CubeFace[] = [
  { glyph: '★', bg: WHITE, fg: INK, target: '#isler', label: 'İŞLER' },
  { glyph: '↗', bg: WHITE, fg: INK, target: '#iletisim', label: 'İLETİŞİM' },
  { glyph: '', bg: ACCENT, fg: INK },
  { glyph: '', bg: INK, fg: ACCENT },
  { glyph: 'B', bg: ACCENT, fg: INK, target: '#hakkimda', label: 'HAKKIMDA' },
  { glyph: '▶', bg: INK, fg: ACCENT, target: '#oyun-alani', label: 'OYUN ALANI' },
];

export function faceForMaterial(index: number): CubeFace | undefined {
  return CUBE_FACES[index];
}
