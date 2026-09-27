import { test, expect } from './fixtures';
import { journey } from '../src/data/journey';
import { skills } from '../src/data/skills';

test('Yetenekler: her bant bir marquee, tek numaralılar ters', async ({ page }) => {
  await page.goto('/');
  const bands = page.locator('#yetenekler [data-marquee]');
  await expect(bands).toHaveCount(skills.length);
  await expect(bands.nth(1)).toHaveAttribute('data-reverse');
  await expect(bands.nth(0)).not.toHaveAttribute('data-reverse');
});

test('Yolculuk: scroll edince son durak görünür', async ({ page, isMobile }) => {
  await page.goto('/');
  const last = page.locator('#yolculuk .stop').last();
  await expect(last).toContainText(journey.at(-1)!.title);
  // Mobilde çizelge dikey: normal kaydırma yeterli. Masaüstünde sabitlenip yatay kayar.
  if (isMobile) await last.scrollIntoViewIfNeeded();
  for (let i = 0; i < 40 && !isMobile; i++) {
    if (await last.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
      const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      return (w * h) / (r.width * r.height) >= 0.9;
    })) break;
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(120);
  }
  await expect(last).toBeInViewport({ ratio: 0.9 });
});

test('reduced motion: duraklar dikey liste', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const stops = page.locator('#yolculuk .stop');
  const a = await stops.nth(0).boundingBox();
  const b = await stops.nth(1).boundingBox();
  expect(b!.y).toBeGreaterThan(a!.y);
  expect(Math.abs(b!.x - a!.x)).toBeLessThan(40);
});
