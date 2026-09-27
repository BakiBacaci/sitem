import { test, expect } from './fixtures';

test('açılan pano tüm ekranı kaplar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Panoyu aç' }).click();
  const box = (await page.getByRole('dialog', { name: 'Post-it panosu' }).boundingBox())!;
  const vp = page.viewportSize()!;
  expect(box.width).toBeGreaterThanOrEqual(vp.width - 1);
  expect(box.height).toBeGreaterThanOrEqual(vp.height - 1);
  expect(box.x).toBeLessThanOrEqual(1);
});

test('pano mantar zemini ve arka planı opak (arkadaki sayfa görünmez)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Panoyu aç' }).click();
  const cork = page.locator('[data-board-surface]');
  await expect(cork).toHaveCSS('background-color', 'rgb(200, 155, 98)');
  await expect(page.getByRole('dialog', { name: 'Post-it panosu' })).toHaveCSS('background-color', 'rgb(20, 18, 16)');
});
