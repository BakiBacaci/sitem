import { describe, expect, it } from 'vitest';
import type { AppDef } from './apps';
import { closeWindow, createOs, focusWindow, minimizeWindow, moveWindow, openApp, resizeViewport, topWindow } from './windowManager';

const app = (id: AppDef['id'], width = 400, height = 300): AppDef => ({ id, title: id, icon: '■', width, height, load: async () => ({ default: null as never }) });
const TITLE_VISIBLE = 64;

describe('pencere yöneticisi', () => {
  it('aynı uygulama iki kez açılınca tek pencere olur ve en üste gelir', () => {
    let s = createOs({ w: 1400, h: 900 });
    s = openApp(s, app('terminal'));
    s = openApp(s, app('yilan'));
    s = openApp(s, app('terminal'));
    expect(s.windows.filter((w) => w.appId === 'terminal')).toHaveLength(1);
    expect(topWindow(s)?.appId).toBe('terminal');
  });

  it('küçültülmüş uygulama yeniden açılınca görünür olur', () => {
    let s = openApp(createOs({ w: 1400, h: 900 }), app('terminal'));
    s = minimizeWindow(s, s.windows[0].id);
    s = openApp(s, app('terminal'));
    expect(s.windows[0].minimized).toBe(false);
  });

  it('focusWindow pencereyi en yüksek z değerine taşır', () => {
    let s = createOs({ w: 1400, h: 900 });
    s = openApp(s, app('terminal'));
    s = openApp(s, app('yilan'));
    const term = s.windows.find((w) => w.appId === 'terminal')!;
    s = focusWindow(s, term.id);
    expect(Math.max(...s.windows.map((w) => w.z))).toBe(s.windows.find((w) => w.id === term.id)!.z);
  });

  it('ekran dışına sürüklenen pencerenin başlığı görünür kalır', () => {
    let s = openApp(createOs({ w: 1400, h: 900 }), app('terminal'));
    const id = s.windows[0].id;
    s = moveWindow(s, id, -5000, -5000);
    let w = s.windows[0];
    expect(w.y).toBeGreaterThanOrEqual(0);
    expect(w.x + w.w).toBeGreaterThanOrEqual(TITLE_VISIBLE);
    s = moveWindow(s, id, 99999, 99999);
    w = s.windows[0];
    expect(w.x).toBeLessThanOrEqual(1400 - TITLE_VISIBLE);
    expect(w.y).toBeLessThanOrEqual(900 - 32);
  });

  it('ekran küçülünce bütün pencereler yeniden sınırlanır', () => {
    let s = createOs({ w: 1400, h: 900 });
    s = openApp(s, app('terminal'));
    s = openApp(s, app('yilan'));
    s = moveWindow(s, s.windows[1].id, 1200, 800);
    s = resizeViewport(s, { w: 400, h: 700 });
    for (const w of s.windows) {
      expect(w.x).toBeLessThanOrEqual(400 - TITLE_VISIBLE);
      expect(w.y).toBeLessThanOrEqual(700 - 32);
      expect(w.x + w.w).toBeGreaterThanOrEqual(TITLE_VISIBLE);
    }
  });

  it('küçültünce topWindow diğer pencereyi döner, kapatınca pencere silinir', () => {
    let s = createOs({ w: 1400, h: 900 });
    s = openApp(s, app('terminal'));
    s = openApp(s, app('yilan'));
    const yilan = topWindow(s)!;
    s = minimizeWindow(s, yilan.id);
    expect(topWindow(s)?.appId).toBe('terminal');
    s = closeWindow(s, yilan.id);
    expect(s.windows.map((w) => w.appId)).toEqual(['terminal']);
  });

  it('yeni pencereler kademeli açılır', () => {
    let s = createOs({ w: 1400, h: 900 });
    s = openApp(s, app('terminal'));
    s = openApp(s, app('yilan'));
    expect(s.windows[1].x - s.windows[0].x).toBe(24);
  });
});
