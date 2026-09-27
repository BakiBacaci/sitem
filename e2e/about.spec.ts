import { test, expect } from './fixtures';

test('Hakkımda: halftone portre ve isim', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#hakkimda');
  await about.scrollIntoViewIfNeeded();
  await expect(about.locator('canvas[data-halftone]')).toBeVisible();
  await expect(about).toContainText('Baki Bacacı');
  await expect(about).not.toContainText('Abdulbaki');
});

test('Hakkımda: portre gerçekten çizildi (boş değil)', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#hakkimda canvas[data-halftone]');
  await canvas.scrollIntoViewIfNeeded();
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  }), { timeout: 8000 }).toBeGreaterThan(1000);
});
