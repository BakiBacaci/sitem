/**
 * Post-it çizimleri resim olarak değil, küçük bir metin olarak saklanır:
 *   "renk|x,y x,y ...;renk|x,y ..."   (koordinatlar 0–255 ızgarasında)
 * Böylece Firestore'da hafif kalır, kurallarla boyutu sınırlanır ve SVG olarak güvenle çizilir.
 */
export type Stroke = { c: number; pts: [number, number][] }; // pts: 0–1 aralığında
export const PEN_COLORS = ['#0b0b0b', '#ff5a1f', '#2b4bff'] as const;
export const MAX_DRAWING_CHARS = 12_000;

const q = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);

function encodeOne(s: Stroke): string {
  return `${s.c}|${s.pts.map(([x, y]) => `${q(x)},${q(y)}`).join(' ')}`;
}

export function encodeStrokes(strokes: Stroke[]): string {
  let out = '';
  for (const s of strokes) {
    if (s.pts.length === 0) continue;
    const part = encodeOne(s);
    const next = out ? `${out};${part}` : part;
    if (next.length > MAX_DRAWING_CHARS) break; // sınırı aşan çizgiler kırpılır
    out = next;
  }
  return out;
}

export function decodeStrokes(text: string): Stroke[] {
  if (!text) return [];
  const out: Stroke[] = [];
  for (const part of text.split(';')) {
    const m = /^(\d)\|([\d, ]+)$/.exec(part);
    if (!m) continue;
    const c = Number(m[1]);
    if (c >= PEN_COLORS.length) continue;
    const pts: [number, number][] = [];
    let ok = true;
    for (const p of m[2].trim().split(/\s+/)) {
      const [x, y] = p.split(',').map(Number);
      if (!Number.isInteger(x) || !Number.isInteger(y) || x > 255 || y > 255) { ok = false; break; }
      pts.push([x / 255, y / 255]);
    }
    if (ok && pts.length) out.push({ c, pts });
  }
  return out;
}

/** Bir öncekine `minDist`'ten yakın noktaları atar; ilk ve son nokta her zaman kalır. */
export function simplify(pts: [number, number][], minDist: number): [number, number][] {
  if (pts.length <= 2) return pts;
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [lx, ly] = out[out.length - 1];
    if (Math.hypot(pts[i][0] - lx, pts[i][1] - ly) >= minDist) out.push(pts[i]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const r = (v: number) => Math.round(v * 10) / 10;

export function strokeToPath(s: Stroke, size: number): string {
  const [[x0, y0], ...rest] = s.pts;
  const start = `M${r(x0 * size)} ${r(y0 * size)}`;
  if (rest.length === 0) return `${start}l0.1 0`;
  return start + rest.map(([x, y]) => `L${r(x * size)} ${r(y * size)}`).join('');
}
