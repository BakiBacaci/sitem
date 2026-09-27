import { expect, it } from 'vitest';
import { CUBE_FACES, faceForMaterial } from './cubeFaces';

it('dört yan yüz birer bölüme gider, üst/alt süstür', () => {
  const targets = CUBE_FACES.filter((f) => f.target).map((f) => f.target);
  expect(new Set(targets)).toEqual(new Set(['#hakkimda', '#isler', '#oyun-alani', '#iletisim']));
  expect(CUBE_FACES).toHaveLength(6);
});

it('Three.js malzeme sırası (+x,-x,+y,-y,+z,-z) doğru yüze eşlenir', () => {
  expect(faceForMaterial(4)!.glyph).toBe('B'); // +z ön yüz
  expect(faceForMaterial(4)!.target).toBe('#hakkimda');
  expect(faceForMaterial(2)!.target).toBeUndefined(); // +y üst
  expect(faceForMaterial(99)).toBeUndefined();
});
