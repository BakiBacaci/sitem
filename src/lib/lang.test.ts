import { expect, it } from 'vitest';
import { titleLang } from './lang';

it('Latin adlar en, Türkçe karakterli adlar tr', () => {
  expect(titleLang('Plip')).toBe('en');
  expect(titleLang('Thermal Drift')).toBe('en');
  expect(titleLang('Blöf')).toBe('tr');
  expect(titleLang('Ders Programı Otomasyonu')).toBe('tr');
});
