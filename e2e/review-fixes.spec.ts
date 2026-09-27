import { test, expect } from './fixtures';

test('BAKİ OS: pencere içeriği fare tekerleğiyle kayar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'masaüstü penceresi');
  await page.goto('/oyun');
  await page.getByRole('list', { name: 'Masaüstü' }).getByRole('button', { name: 'plip.exe' }).dblclick();
  const body = page.locator('[data-window="plip"] .body');
  await expect(body.locator('h2')).toBeVisible();
  // Kapak görseli yüklenip içerik pencereden taşana kadar bekle.
  await expect.poll(() => body.evaluate((el) => el.scrollHeight - el.clientHeight), { timeout: 10_000 }).toBeGreaterThan(200);
  const box = (await body.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => body.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
});

test('telefonda yılan alanı tarayıcı hareketlerini engeller', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'telefon');
  await page.goto('/oyun');
  await page.locator('[data-mobile-home]').getByRole('button', { name: 'yilan.exe' }).click();
  const snake = page.locator('.snake');
  await expect(snake).toBeVisible();
  await expect(snake).toHaveCSS('touch-action', 'none');
  expect(await page.evaluate(() => getComputedStyle(document.body).overscrollBehaviorY)).toBe('none');
});

test('Hakkımda: yayındaki projeler adıyla sayılır', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#hakkimda');
  for (const name of ['Blöf', 'Draw The Suspect', 'Elver', 'Memento']) await expect(about).toContainText(name);
});

test('sayfa yana taşmaz (yatay kaydırma yok)', async ({ page }) => {
  for (const path of ['/', '/isler/blof', '/yazilar']) {
    await page.goto(path);
    await page.waitForTimeout(1500);
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    expect(sw, path).toBeLessThanOrEqual(iw);
  }
});
