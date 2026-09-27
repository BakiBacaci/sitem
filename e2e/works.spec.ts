import { test, expect } from './fixtures';

test('İşler bölümünde sıralı 6 kart, ilki bu site', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#isler .work-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.first().locator('h3')).toHaveText('Bu Site');
});

test('Blöf kartı detay sayfasına götürür', async ({ page }) => {
  await page.goto('/');
  await page.locator('#isler .work-card', { hasText: 'Blöf' }).click();
  await expect(page).toHaveURL(/\/isler\/blof\/?$/);
  await expect(page.locator('h1')).toHaveText('Blöf');
});

test('detay sayfasında Ne/Neden/Nasıl ve geri linki', async ({ page }) => {
  await page.goto('/isler/blof');
  for (const h of ['Ne', 'Neden', 'Nasıl']) await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
  await page.getByRole('link', { name: '← Tüm işler' }).click();
  await expect(page).toHaveURL(/\/#isler$/);
});

test('arşiv listesi dolu ve Canavar yok', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#isler .archive li').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/canavar/i);
});
