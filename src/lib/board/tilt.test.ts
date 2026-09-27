import { expect, it } from 'vitest';
import { tiltFor } from './tilt';

it('aynı kimlik hep aynı açıyı verir, açılar -6..6 derece arasında', () => {
  expect(tiltFor('abc')).toBe(tiltFor('abc'));
  for (const id of ['a', 'x9Kd02LmQpWz71aBcDeF', 'n0', 'n1']) {
    expect(Math.abs(tiltFor(id))).toBeLessThanOrEqual(6);
  }
});

it('aynı uzunluktaki farklı Firestore kimlikleri farklı açılar alır', () => {
  const ids = ['x9Kd02LmQpWz71aBcDeF', 'Qm81ZpLr0aXv5TcWbN2e', 'b7Hq3VnRkY0sLp9MdC1u', 'Z0yXwVuTsRqPoNmLkJiH'];
  expect(new Set(ids.map(tiltFor)).size).toBeGreaterThan(1);
});
