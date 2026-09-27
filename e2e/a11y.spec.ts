import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

for (const path of ['/', '/isler/blof', '/yazilar', '/yazilar/merhaba-dunya', '/oyun']) {
  test(`${path} ciddi erişilebilirlik ihlali yok`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.waitForTimeout(800);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });
}

test('klavye: Tab ile İŞLER linkine gidip Enter ile bölüme atlar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'masaüstü menüsü');
  await page.goto('/');
  const link = page.getByRole('link', { name: 'İŞLER', exact: true });
  for (let i = 0; i < 10 && !(await link.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#isler h2')).toBeInViewport();
});
