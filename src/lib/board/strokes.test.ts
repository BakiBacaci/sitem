import { describe, expect, it } from 'vitest';
import { decodeStrokes, encodeStrokes, MAX_DRAWING_CHARS, simplify, strokeToPath, type Stroke } from './strokes';

const s = (c: number, pts: [number, number][]): Stroke => ({ c, pts });

describe('çizim kodlama', () => {
  it('kodlayıp çözünce aynı çizgiler döner (0–255 ızgarasına yuvarlanmış)', () => {
    const strokes = [s(0, [[0, 0], [0.5, 0.5], [1, 1]]), s(2, [[0.1, 0.9], [0.2, 0.8]])];
    const back = decodeStrokes(encodeStrokes(strokes));
    expect(back).toHaveLength(2);
    expect(back[0].c).toBe(0);
    expect(back[0].pts[2]).toEqual([1, 1]);
    expect(back[1].c).toBe(2);
    expect(back[1].pts[0][0]).toBeCloseTo(0.1, 2);
  });

  it('boş çizim boş metne kodlanır', () => {
    expect(encodeStrokes([])).toBe('');
    expect(decodeStrokes('')).toEqual([]);
  });

  it('bozuk veri çökme yapmaz, geçersiz parçalar atlanır', () => {
    expect(decodeStrokes('çöp;;<script>|x,y')).toEqual([]);
    expect(decodeStrokes('1|10,10 20,20;9|5,5 6,6;0|300,1 2,2')).toEqual([s(1, [[10 / 255, 10 / 255], [20 / 255, 20 / 255]])]);
  });

  it('tek noktalı çizgi de korunur (nokta koymak)', () => {
    expect(decodeStrokes(encodeStrokes([s(0, [[0.5, 0.5]])]))).toHaveLength(1);
  });

  it('sınırdan uzun çizim sondan kırpılır ama geçerli kalır', () => {
    const many = Array.from({ length: 400 }, (_, i) => s(i % 3, Array.from({ length: 30 }, (_, j) => [(i % 17) / 17, j / 30] as [number, number])));
    const enc = encodeStrokes(many);
    expect(enc.length).toBeLessThanOrEqual(MAX_DRAWING_CHARS);
    expect(decodeStrokes(enc).length).toBeGreaterThan(0);
  });
});

describe('simplify', () => {
  it('birbirine çok yakın noktaları seyreltir, uçları korur', () => {
    const pts: [number, number][] = Array.from({ length: 100 }, (_, i) => [i / 1000, 0]);
    const out = simplify(pts, 0.01);
    expect(out.length).toBeLessThan(20);
    expect(out[0]).toEqual(pts[0]);
    expect(out.at(-1)).toEqual(pts.at(-1));
  });
});

describe('strokeToPath', () => {
  it('SVG yolu verilen boyuta ölçeklenir', () => {
    expect(strokeToPath(s(0, [[0, 0], [1, 0.5]]), 200)).toBe('M0 0L200 100');
  });
  it('tek nokta görünür küçük bir çizgi olur', () => {
    expect(strokeToPath(s(0, [[0.5, 0.5]]), 100)).toBe('M50 50l0.1 0');
  });
});
