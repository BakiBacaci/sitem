import { test, expect } from './fixtures';
import { site } from '../src/data/site';

test('YAZ BANA e-postayı panoya kopyalar ve bildirir', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const btn = page.locator('#iletisim [data-copy-email]');
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await expect(page.locator('#iletisim [data-copy-status]')).toHaveText(/kopyalandı/i);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email);
});

test('CV yayında değil: link yok, dosya yok', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="/cv/"], a[download]')).toHaveCount(0);
  expect((await request.get('/cv/Abdulbaki_Bacaci_CV_2026.pdf')).status()).toBe(404);
});

test('iletişimde sosyal linkler ve e-posta metni var', async ({ page }) => {
  await page.goto('/');
  const c = page.locator('#iletisim');
  await expect(c).toContainText(site.email);
  for (const s of site.socials) await expect(c.getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
});
