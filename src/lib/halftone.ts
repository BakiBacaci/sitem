export type Dot = { x: number; y: number; r: number };

/**
 * Tek kanallı parlaklık görüntüsünden (0–255) gazete baskısı noktaları üretir.
 * Her `step` hücresinin merkezinde bir nokta; koyu piksel = büyük nokta.
 */
export function computeDots(lum: Uint8ClampedArray, width: number, height: number, step: number): Dot[] {
  const dots: Dot[] = [];
  const half = step / 2;
  for (let y = half; y < height; y += step) {
    for (let x = half; x < width; x += step) {
      const v = lum[Math.floor(y) * width + Math.floor(x)];
      const r = (1 - v / 255) * step * 0.5;
      if (r >= 0.3) dots.push({ x, y, r });
    }
  }
  return dots;
}

/** İmleç `radius` içindeyse noktayı imleçten dışa doğru iter. */
export function displace(dot: Dot, px: number, py: number, radius: number, strength: number): { x: number; y: number } {
  const dx = dot.x - px;
  const dy = dot.y - py;
  const d = Math.hypot(dx, dy);
  if (d >= radius) return { x: dot.x, y: dot.y };
  const push = (1 - d / radius) * strength;
  const nx = d === 0 ? 1 : dx / d;
  const ny = d === 0 ? 0 : dy / d;
  return { x: dot.x + nx * push, y: dot.y + ny * push };
}
