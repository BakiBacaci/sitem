<script lang="ts">
  import type { Component } from 'svelte';
  import type { AppDef } from '../../lib/os/apps';
  import type { AppId } from '../../lib/os/appIds';
  import type { Win } from '../../lib/os/windowManager';

  let {
    win, app, api, active, onfocus, onclose, onminimize, onmove,
  }: {
    win: Win;
    app: AppDef;
    api: { open: (id: AppId) => void };
    active: boolean;
    onfocus: () => void;
    onclose: () => void;
    onminimize: () => void;
    onmove: (x: number, y: number) => void;
  } = $props();

  let Comp = $state<Component<any> | null>(null);
  $effect(() => { app.load().then((m) => (Comp = m.default)); });

  let drag: { dx: number; dy: number } | null = null;
  function down(e: PointerEvent) {
    if ((e.target as Element).closest('button')) return;
    onfocus();
    drag = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) { if (drag) onmove(e.clientX - drag.dx, e.clientY - drag.dy); }
  function up() { drag = null; }
</script>

<section
  class="win"
  class:active
  class:hidden={win.minimized}
  data-window={win.appId}
  aria-label={app.title}
  style={`left:${win.x}px;top:${win.y}px;width:${win.w}px;height:${win.h}px;z-index:${win.z}`}
  onpointerdown={onfocus}
  onkeydown={(e) => { if (e.key === 'Escape') onclose(); }}
>
  <header class="bar" data-titlebar onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}>
    <span class="bar__title"><span aria-hidden="true">{app.icon}</span> {app.title}</span>
    <span class="bar__btns">
      <button type="button" aria-label="Küçült" onclick={onminimize}>_</button>
      <button type="button" aria-label="Kapat" onclick={onclose}>✕</button>
    </span>
  </header>
  <div class="body" data-lenis-prevent>
    {#if Comp}<Comp {api} />{:else}<p class="loading">yükleniyor…</p>{/if}
  </div>
</section>

<style>
  .win {
    position: absolute; display: grid; grid-template-rows: 32px 1fr;
    background: var(--white); border: var(--border); box-shadow: var(--shadow);
    animation: pop .35s var(--ease-spring);
  }
  .win.active { box-shadow: var(--shadow-lg); }
  .win.hidden { display: none; }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 4px 0 10px; background: var(--paper); border-bottom: var(--border); cursor: grab; touch-action: none; font-weight: 800; font-size: 13px; }
  .win.active .bar { background: var(--accent); }
  .bar:active { cursor: grabbing; }
  .bar__title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar__btns { display: flex; gap: 4px; }
  .bar__btns button { width: 24px; height: 22px; border: 2px solid var(--ink); background: var(--white); font: 800 12px/1 var(--font-mono); cursor: pointer; padding: 0; }
  .bar__btns button:hover { background: var(--ink); color: var(--accent); }
  .body { overflow: auto; min-height: 0; user-select: text; }
  .loading { padding: 16px; }
  @keyframes pop { from { transform: scale(.85); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .win { animation: none; } }
</style>
