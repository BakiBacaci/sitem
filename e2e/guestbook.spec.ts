import { test, expect } from './fixtures';

async function openWall(page: import('@playwright/test').Page, isMobile: boolean) {
  await page.goto('/oyun');
  if (isMobile) await page.locator('[data-mobile-home]').getByRole('button', { name: 'duvar.exe' }).click();
  else await page.getByRole('list', { name: 'Masaüstü' }).getByRole('button', { name: 'duvar.exe' }).dblclick();
  return page.locator('[data-guestbook]');
}

test('Firebase yapılandırması yoksa duvar kapalı, diğer uygulamalar çalışır', async ({ page, isMobile }) => {
  const wall = await openWall(page, isMobile);
  await expect(wall).toContainText('şu an kapalı');
  if (!isMobile) {
    await page.getByRole('list', { name: 'Masaüstü' }).getByRole('button', { name: 'yilan.exe' }).dblclick();
    await expect(page.locator('[data-window="yilan"]')).toBeVisible();
  }
});

test('notlar düz metin olarak gösterilir, HTML çalışmaz', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    const notes: unknown[] = [];
    (window as any).__guestbookMock = {
      list: async () => notes,
      add: async (n: any) => { notes.unshift({ ...n, id: String(notes.length) }); },
    };
    (window as any).__alerted = false;
    window.alert = () => { (window as any).__alerted = true; };
  });
  const wall = await openWall(page, isMobile);
  const input = wall.getByRole('textbox', { name: 'Notun' });
  await input.fill('<img src=x onerror=alert(1)><script>alert(1)</script>');
  await wall.getByRole('button', { name: 'Yapıştır' }).click();
  await expect(wall.locator('[data-note]').first()).toContainText('<script>alert(1)</script>');
  await expect(wall.locator('[data-note] img, [data-note] script')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__alerted)).toBe(false);
});

test('çok uzun not reddedilir ve sayaç gösterilir', async ({ page, isMobile }) => {
  await page.addInitScript(() => { (window as any).__guestbookMock = { list: async () => [], add: async () => {} }; });
  const wall = await openWall(page, isMobile);
  await wall.getByRole('textbox', { name: 'Notun' }).fill('a'.repeat(85));
  await expect(wall).toContainText('85/80');
  await wall.getByRole('button', { name: 'Yapıştır' }).click();
  await expect(wall.getByRole('alert')).toContainText('80 karakter');
});
