import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

async function curtainGone(page: Page) {
  await expect.poll(async () => page.evaluate(() => {
    const c = document.querySelector('.curtain');
    if (!c) return true;
    const r = c.getBoundingClientRect();
    return r.right <= 0 || r.left >= innerWidth;
  }), { timeout: 4000 }).toBe(true);
}

test('proje sayfasına gidince perde kalkar', async ({ page }) => {
  await page.goto('/');
  await page.locator('#isler .work-card').first().click();
  await expect(page).toHaveURL(/\/isler\//);
  await curtainGone(page);
});

test('geri gelince ve tekrar gidince perde kalkar', async ({ page }) => {
  await page.goto('/isler/blof');
  await page.getByRole('link', { name: '← Tüm işler' }).click();
  await expect(page).toHaveURL(/\/#isler$/);
  await curtainGone(page);
  await page.goBack();
  await curtainGone(page);
  await page.goForward();
  await curtainGone(page);
});

test('arka arkaya iki tıklamada perde takılı kalmaz', async ({ page }) => {
  await page.goto('/yazilar');
  const link = page.locator('a[href="/yazilar/merhaba-dunya"]');
  await link.click({ noWaitAfter: true });
  await page.waitForTimeout(100);
  await page.getByRole('link', { name: '← Ana sayfa' }).click({ noWaitAfter: true, force: true });
  await page.waitForTimeout(1500);
  await curtainGone(page);
});

test('Oyun Alanı kartından /oyun a gidince perde kalkar', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#oyun-alani [data-play-card]');
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page).toHaveURL(/\/oyun\/?$/);
  await curtainGone(page);
});
