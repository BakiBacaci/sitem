import { test, expect } from './fixtures';

test('ana sayfa açılır, lang tr, kağıt zemin', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(244, 244, 240)');
});
