import { test, expect } from './fixtures';

test('ana sayfada en fazla 3 yazı kartı', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#yazilar .post-card');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeLessThanOrEqual(3);
});

test('yazılar listesi ve yazı sayfası', async ({ page }) => {
  await page.goto('/yazilar');
  const link = page.locator('a[href="/yazilar/merhaba-dunya"]');
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/yazilar\/merhaba-dunya\/?$/);
  await expect(page.locator('h1')).toHaveText('Merhaba, dünya');
});
