import { describe, expect, it } from 'vitest';
import { archive } from './archive';
import { journey } from './journey';
import { site } from './site';
import { skills } from './skills';

describe('içerik verisi', () => {
  it('yolculukta en az 3 durak var ve yıllar artan sırada', () => {
    expect(journey.length).toBeGreaterThanOrEqual(3);
    const years = journey.map((j) => parseInt(j.year, 10));
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('en az 2 yetenek bandı var, hiçbiri boş değil', () => {
    expect(skills.length).toBeGreaterThanOrEqual(2);
    for (const band of skills) expect(band.length).toBeGreaterThan(0);
  });

  it('arşivde Canavar yok', () => {
    expect(archive.some((a) => /canavar/i.test(a.title))).toBe(false);
  });

  it('sitede telefon numarası yok', () => {
    expect(JSON.stringify(site)).not.toMatch(/\d{3}\s?\d{3}\s?\d{2}\s?\d{2}/);
    expect('cvPath' in site).toBe(false); // CV şimdilik yayında değil (telefon/doğum tarihi içeriyor)
  });
});
