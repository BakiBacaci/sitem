import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

function mockBoard(page: Page) {
  return page.addInitScript(() => {
    const notes: any[] = [];
    (window as any).__added = [];
    (window as any).__guestbookMock = {
      list: async () => notes,
      add: async (n: any) => { (window as any).__added.push(n); notes.unshift({ ...n, id: 'n' + notes.length }); },
    };
    (window as any).__alerted = false;
    window.alert = () => { (window as any).__alerted = true; };
  });
}

async function openBoard(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Panoyu aç' }).click();
  const board = page.getByRole('dialog', { name: 'Post-it panosu' });
  await expect(board).toBeVisible();
  return board;
}

test('girişte pano var; Firebase yoksa pano kapalı yazar ve Esc ile kapanır', async ({ page }) => {
  const board = await openBoard(page);
  await expect(board).toContainText('şu an kapalı');
  await page.keyboard.press('Escape');
  await expect(board).toBeHidden();
});

test('kağıt al, yaz, çiz, yapıştır', async ({ page }) => {
  await mockBoard(page);
  const board = await openBoard(page);
  await board.getByRole('button', { name: 'Kağıt al' }).click();
  const editor = board.locator('[data-editor]');
  await expect(editor).toBeVisible();
  await editor.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished))); // kağıt yerine otursun
  await editor.getByRole('textbox', { name: 'Yazı' }).fill('selam Baki!');
  await board.getByRole('button', { name: 'pembe' }).click();

  const canvas = editor.locator('[data-draw]');
  const b = (await canvas.boundingBox())!;
  await page.mouse.move(b.x + 20, b.y + 20);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width - 20, b.y + b.height - 20, { steps: 10 });
  await page.mouse.up();

  await editor.getByRole('button', { name: 'Yapıştır' }).click();
  const surface = board.locator('[data-board-surface]');
  await expect(board).toContainText('Panoda bir yere tıkla');
  const s = (await surface.boundingBox())!;
  await page.mouse.click(s.x + s.width * 0.3, s.y + s.height * 0.4);

  const note = board.locator('[data-note]').first();
  await expect(note).toContainText('selam Baki!');
  await expect(note.locator('svg path')).toHaveCount(1);
  const added = await page.evaluate(() => (window as any).__added[0]);
  expect(added.paper).toBe('pembe');
  expect(added.drawing).toMatch(/^0\|/);
  expect(added.x).toBeGreaterThan(0.2);
  expect(added.x).toBeLessThan(0.4);
});

test('yazısız sadece çizim de yapıştırılabilir; HTML çalışmaz', async ({ page }) => {
  await mockBoard(page);
  const board = await openBoard(page);
  await board.getByRole('button', { name: 'Kağıt al' }).click();
  const editor = board.locator('[data-editor]');
  await editor.getByRole('textbox', { name: 'Yazı' }).fill('<img src=x onerror=alert(1)>');
  await editor.getByRole('button', { name: 'Yapıştır' }).click();
  const s = (await board.locator('[data-board-surface]').boundingBox())!;
  await page.mouse.click(s.x + s.width / 2, s.y + s.height / 2);
  await expect(board.locator('[data-note]').first()).toContainText('<img src=x onerror=alert(1)>');
  await expect(board.locator('[data-note] img')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).__alerted)).toBe(false);
});

test('boş kağıt yapıştırılamaz', async ({ page }) => {
  await mockBoard(page);
  const board = await openBoard(page);
  await board.getByRole('button', { name: 'Kağıt al' }).click();
  await board.locator('[data-editor]').getByRole('button', { name: 'Yapıştır' }).click();
  await expect(board.getByRole('alert')).toContainText('Boş');
});
