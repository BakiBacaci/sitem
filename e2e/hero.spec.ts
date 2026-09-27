import { test, expect } from './fixtures';

test('başlık ve rozet görünür, polaroid yok', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('#giris h1');
  await expect(h1).toContainText('KOD');
  await expect(h1).toContainText('YAZARIM.');
  await expect(page.locator('#giris .polaroid')).toHaveCount(0);
  await expect(page.locator('#giris [data-intro="badge"]')).toBeVisible();
});

test('sayfa başlığında kısa isim var', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Baki Bacacı/);
  await expect(page).not.toHaveTitle(/Abdulbaki/);
});

test('küpe tıklamak bir bölüme götürür', async ({ page, isMobile }) => {
  test.skip(isMobile, 'masaüstü davranışı');
  await page.goto('/');
  const cube = page.locator('canvas[data-cube]');
  await expect(cube).toBeVisible({ timeout: 15_000 });
  const b = (await cube.boundingBox())!;
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await expect(page).toHaveURL(/#(hakkimda|isler|oyun-alani|iletisim)$/, { timeout: 5000 });
});

test('küpün üzerine gelince hedef etiketi çıkar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'masaüstü davranışı');
  await page.goto('/');
  const cube = page.locator('canvas[data-cube]');
  await expect(cube).toBeVisible({ timeout: 15_000 });
  const b = (await cube.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await expect(page.locator('[data-cube-label]')).toHaveText(/→ (HAKKIMDA|İŞLER|OYUN ALANI|İLETİŞİM)/);
});

test('masaüstünde 3D küp canvas olarak çizilir', async ({ page, isMobile }) => {
  test.skip(isMobile, 'masaüstü davranışı');
  await page.goto('/');
  await expect(page.locator('canvas[data-cube]')).toBeVisible({ timeout: 15_000 });
});

test('reduced motion: küp yerine statik görsel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('img[data-cube-fallback]')).toBeVisible();
  await expect(page.locator('canvas[data-cube]')).toHaveCount(0);
});

test('WebGL yoksa statik görsel, konsol hatası yok', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text()) && !/ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error test stub
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      if (/webgl/i.test(type)) return null;
      return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest);
    };
  });
  await page.goto('/');
  await expect(page.locator('img[data-cube-fallback]')).toBeVisible();
  expect(errors).toEqual([]);
});
