import type { AppDef } from './apps';
import type { AppId } from './appIds';

export type Win = { id: string; appId: AppId; x: number; y: number; w: number; h: number; z: number; minimized: boolean };
export type Viewport = { w: number; h: number };
export type OsState = { windows: Win[]; nextZ: number; viewport: Viewport };

const TITLE_H = 32;
const TITLE_VISIBLE = 64; // başlık çubuğunun en az bu kadarı ekranda kalır
const CASCADE = 24;
const MARGIN = 8;

export function createOs(viewport: Viewport): OsState {
  return { windows: [], nextZ: 1, viewport };
}

function clamp(win: Win, vp: Viewport): Win {
  const x = Math.min(vp.w - TITLE_VISIBLE, Math.max(TITLE_VISIBLE - win.w, win.x));
  const y = Math.min(vp.h - TITLE_H, Math.max(0, win.y));
  return x === win.x && y === win.y ? win : { ...win, x, y };
}

function update(s: OsState, id: string, fn: (w: Win) => Win): OsState {
  return { ...s, windows: s.windows.map((w) => (w.id === id ? fn(w) : w)) };
}

export function focusWindow(s: OsState, id: string): OsState {
  const z = s.nextZ;
  return { ...update(s, id, (w) => ({ ...w, z, minimized: false })), nextZ: z + 1 };
}

export function openApp(s: OsState, app: AppDef): OsState {
  const existing = s.windows.find((w) => w.appId === app.id);
  if (existing) return focusWindow(s, existing.id);

  const { w: vw, h: vh } = s.viewport;
  const w = Math.min(app.width, vw - MARGIN * 2);
  const h = Math.min(app.height, vh - MARGIN * 2);
  const n = s.windows.length;
  const win = clamp(
    { id: `${app.id}-${s.nextZ}`, appId: app.id, x: Math.round((vw - w) / 2) + n * CASCADE, y: Math.max(MARGIN, Math.round((vh - h) / 2)) + n * CASCADE, w, h, z: s.nextZ, minimized: false },
    s.viewport,
  );
  return { ...s, windows: [...s.windows, win], nextZ: s.nextZ + 1 };
}

export function closeWindow(s: OsState, id: string): OsState {
  return { ...s, windows: s.windows.filter((w) => w.id !== id) };
}

export function minimizeWindow(s: OsState, id: string): OsState {
  return update(s, id, (w) => ({ ...w, minimized: true }));
}

export function moveWindow(s: OsState, id: string, x: number, y: number): OsState {
  return update(s, id, (w) => clamp({ ...w, x, y }, s.viewport));
}

export function resizeViewport(s: OsState, viewport: Viewport): OsState {
  return { ...s, viewport, windows: s.windows.map((w) => clamp(w, viewport)) };
}

export function topWindow(s: OsState): Win | undefined {
  return s.windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
}
