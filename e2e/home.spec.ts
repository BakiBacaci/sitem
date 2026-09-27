import { test, expect } from './fixtures';

const SECTIONS = ['giris', 'isler', 'hakkimda', 'yetenekler', 'yolculuk', 'oyun-alani', 'yazilar', 'iletisim'];

test('8 bölüm sabit id ile sayfada', async ({ page }) => {
  await page.goto('/');
  for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toHaveCount(1);
});

test('menüden İŞLER bölüme kaydırır', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Menü' }).click();
  await page.getByRole('link', { name: 'İŞLER', exact: true }).click();
  await expect(page.locator('#isler h2')).toBeInViewport();
});

test('reduced motion: bütün bölüm başlıkları görünür', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const id of SECTIONS) {
    const h = page.locator(`#${id} h2, #${id} h1`).first();
    await h.scrollIntoViewIfNeeded();
    await expect(h).toBeVisible();
    await expect(h).toHaveCSS('opacity', '1');
  }
});

test.describe('JS kapalı', () => {
  test.use({ javaScriptEnabled: false });
  test('bütün bölüm başlıkları görünür', async ({ page }) => {
    await page.goto('/');
    for (const id of SECTIONS) {
      const h = page.locator(`#${id} h2, #${id} h1`).first();
      await expect(h).toBeVisible();
      await expect(h).toHaveCSS('opacity', '1');
    }
  });
});
