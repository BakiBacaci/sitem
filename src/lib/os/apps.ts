import type { Component } from 'svelte';
import type { AppId } from './appIds';

export type AppDef = {
  id: AppId;
  title: string;
  icon: string;
  width: number;
  height: number;
  load: () => Promise<{ default: Component<any> }>;
};

// Yeni bir uygulama eklemek: apps/ altına bileşeni koy, buraya bir satır ekle.
export const APPS: AppDef[] = [
  { id: 'hakkimda', title: 'hakkimda.txt', icon: '📄', width: 460, height: 380, load: () => import('../../islands/os/apps/Notes.svelte') },
  { id: 'terminal', title: 'terminal.exe', icon: '⌨️', width: 620, height: 400, load: () => import('../../islands/os/apps/Terminal.svelte') },
  { id: 'yilan', title: 'yilan.exe', icon: '🐍', width: 440, height: 540, load: () => import('../../islands/os/apps/Snake.svelte') },
  { id: 'plip', title: 'plip.exe', icon: '🟢', width: 720, height: 520, load: () => import('../../islands/os/apps/Plip.svelte') },
  { id: 'blof', title: 'blof.exe', icon: '🃏', width: 480, height: 420, load: () => import('../../islands/os/apps/Blof.svelte') },
];

export function findApp(id: AppId): AppDef | undefined {
  return APPS.find((a) => a.id === id);
}
