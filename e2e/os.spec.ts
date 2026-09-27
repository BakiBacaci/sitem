import { test, expect } from './fixtures';

test.describe('masaüstü', () => {
  test.skip(({ isMobile }) => isMobile, 'masaüstü davranışı');

  test('terminal aç, komut çalıştır, yılanı aç, sürükle, kapat', async ({ page }) => {
    await page.goto('/oyun');
    const items = page.locator('[data-taskbar-item]');
    await expect(items.first()).toBeVisible(); // hakkimda.txt açılışta kendiliğinden açılır
    const base = await items.count();
    await page.getByRole('list', { name: 'Masaüstü' }).getByRole('button', { name: 'terminal.exe' }).dblclick();
    const term = page.locator('[data-window="terminal"]');
    await expect(term).toBeVisible();

    const input = term.getByRole('textbox');
    await input.fill('help');
    await input.press('Enter');
    await expect(term).toContainText('whoami');

    await input.fill('oyna');
    await input.press('Enter');
    const snake = page.locator('[data-window="yilan"]');
    await expect(snake).toBeVisible();
    await expect(items).toHaveCount(base + 2);

    const bar = snake.locator('[data-titlebar]');
    const before = (await snake.boundingBox())!;
    const b = (await bar.boundingBox())!;
    await page.mouse.move(b.x + 60, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + 260, b.y + 120, { steps: 8 });
    await page.mouse.up();
    const after = (await snake.boundingBox())!;
    expect(after.x - before.x).toBeGreaterThan(150);

    await snake.getByRole('button', { name: 'Kapat' }).click();
    await expect(snake).toHaveCount(0);
    await expect(items).toHaveCount(base + 1);
  });
});

test.describe('telefon', () => {
  test.skip(({ isMobile }) => !isMobile, 'telefon davranışı');

  test('uygulama ızgarası, tam ekran uygulama ve geri', async ({ page }) => {
    await page.goto('/oyun');
    const grid = page.locator('[data-mobile-home]');
    await expect(grid).toBeVisible();
    await grid.getByRole('button', { name: 'yilan.exe' }).click();
    const app = page.locator('[data-mobile-app="yilan"]');
    await expect(app).toBeVisible();
    await app.getByRole('button', { name: 'Geri' }).click();
    await expect(grid).toBeVisible();
  });
});

test('ana sayfadaki Oyun Alanı kartı /oyun sayfasına götürür', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('#oyun-alani [data-play-card]');
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page).toHaveURL(/\/oyun\/?$/);
});

test('BAKİ OS’ta cv.pdf uygulaması yok', async ({ page, isMobile }) => {
  await page.goto('/oyun');
  const scope = isMobile ? page.locator('[data-mobile-home]') : page.getByRole('list', { name: 'Masaüstü' });
  await expect(scope.getByRole('button', { name: 'terminal.exe' })).toBeVisible();
  await expect(scope.getByRole('button', { name: 'cv.pdf' })).toHaveCount(0);
});
