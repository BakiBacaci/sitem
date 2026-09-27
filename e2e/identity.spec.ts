import { test, expect } from './fixtures';

test('giriş web tasarım ve yapay zekâyı öne çıkarır', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#giris');
  await expect(hero.locator('.hero__role')).toContainText('Web tasarım');
  await expect(hero.locator('.hero__role')).toContainText('yapay zekâ');
});

test('İşler: ilk kart bu site, Draw The Suspect öne çıkan işlerde', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#isler .work-card h3');
  await expect(cards.first()).toHaveText('Bu Site');
  await expect(cards.filter({ hasText: 'Draw The Suspect' })).toHaveCount(1);
  await expect(page.locator('#isler .archive')).not.toContainText('Draw The Suspect');
});

test('Hakkımda: dört alan listelenir', async ({ page }) => {
  await page.goto('/');
  const services = page.locator('#hakkimda [data-services] li');
  await expect(services).toHaveCount(4);
  for (const s of ['Web tasarım', 'Mobil', 'Oyun', 'Yapay zekâ']) await expect(page.locator('#hakkimda [data-services]')).toContainText(s);
  await expect(services.first()).toHaveCSS('display', 'grid'); // kart görünümü, düz liste değil
});

test('Yetenekler: ilk bant web ve yapay zekâ', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('#yetenekler [data-marquee]').first();
  await expect(first).toContainText('Astro');
  await expect(first).toContainText('Yapay zekâ');
});
