import { test, expect } from './fixtures';

const TRACK = '5bvxbR8NGYTJIZqBfqZvPt';

test('müzik düğmesi var, tıklamadan Spotify yüklenmez', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Borderline/ })).toBeVisible();
  await expect(page.locator('iframe[src*="spotify"]')).toHaveCount(0);
});

test('tıklayınca Spotify oynatıcısı açılır ve sayfa değişince kalır', async ({ page }) => {
  await page.route(/open\.spotify\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>spotify</p>' }));
  await page.goto('/');
  await page.getByRole('button', { name: /Borderline/ }).click();
  const frame = page.locator(`iframe[src*="open.spotify.com/embed/track/${TRACK}"]`);
  await expect(frame).toBeVisible();
  const handle = await frame.elementHandle();
  await page.locator('#isler .work-card').first().click();
  await expect(page).toHaveURL(/\/isler\//);
  expect(await handle!.evaluate((el) => el.isConnected)).toBe(true);
});
