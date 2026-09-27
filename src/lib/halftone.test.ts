import { describe, expect, it } from 'vitest';
import { computeDots, displace } from './halftone';

describe('computeDots', () => {
  it('tamamen siyah 4x4, step 2 → yarıçapı 1 olan 4 nokta', () => {
    const dots = computeDots(new Uint8ClampedArray(16).fill(0), 4, 4, 2);
    expect(dots).toHaveLength(4);
    for (const d of dots) expect(d.r).toBe(1);
    expect(dots.map((d) => [d.x, d.y])).toEqual([[1, 1], [3, 1], [1, 3], [3, 3]]);
  });

  it('tamamen beyaz → nokta yok', () => {
    expect(computeDots(new Uint8ClampedArray(16).fill(255), 4, 4, 2)).toEqual([]);
  });
});

describe('displace', () => {
  const dot = { x: 100, y: 100, r: 3 };

  it('imleç uzaktayken nokta yerinde kalır', () => {
    expect(displace(dot, 500, 500, 60, 20)).toEqual({ x: 100, y: 100 });
  });

  it('imleç yarıçap içindeyken nokta imleçten uzaklaşır', () => {
    const p = displace(dot, 90, 100, 60, 20);
    expect(Math.hypot(p.x - 90, p.y - 100)).toBeGreaterThan(10);
    expect(p.x).toBeGreaterThan(100);
  });
});
