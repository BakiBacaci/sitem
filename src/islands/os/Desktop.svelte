<script lang="ts">
  import { onMount } from 'svelte';
  import { APPS, findApp } from '../../lib/os/apps';
  import type { AppId } from '../../lib/os/appIds';
  import { closeWindow, createOs, focusWindow, minimizeWindow, moveWindow, openApp, resizeViewport, topWindow } from '../../lib/os/windowManager';
  import Window from './Window.svelte';
  import Taskbar from './Taskbar.svelte';

  const TASKBAR_H = 52;
  let area: HTMLDivElement;
  let os = $state(createOs({ w: 1200, h: 800 }));
  let selected = $state<AppId | null>(null);

  const api = { open: (id: AppId) => open(id) };

  function open(id: AppId) {
    const app = findApp(id);
    if (app) os = openApp(os, app);
  }

  onMount(() => {
    const measure = () => (os = resizeViewport(os, { w: area.clientWidth, h: area.clientHeight }));
    measure();
    window.addEventListener('resize', measure);
    open('hakkimda');
    return () => window.removeEventListener('resize', measure);
  });

  const top = $derived(topWindow(os));
</script>

<div class="desktop" style={`--taskbar:${TASKBAR_H}px`}>
  <div class="area" bind:this={area}>
    <ul class="icons" aria-label="Masaüstü">
      {#each APPS as app (app.id)}
        <li>
          <button
            class="icon"
            class:selected={selected === app.id}
            aria-label={app.title}
            onclick={() => (selected = app.id)}
            ondblclick={() => open(app.id)}
            onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); open(app.id); } }}
          >
            <span class="icon__img" aria-hidden="true">{app.icon}</span>
            <span class="icon__label">{app.title}</span>
          </button>
        </li>
      {/each}
    </ul>
    <p class="hint">İpucu: simgelere çift tıkla. Terminale <code>help</code> yaz.</p>

    {#each os.windows as win (win.id)}
      {@const app = findApp(win.appId)}
      {#if app}
        <Window
          {win}
          {app}
          {api}
          active={top?.id === win.id}
          onfocus={() => (os = focusWindow(os, win.id))}
          onclose={() => (os = closeWindow(os, win.id))}
          onminimize={() => (os = minimizeWindow(os, win.id))}
          onmove={(x, y) => (os = moveWindow(os, win.id, x, y))}
        />
      {/if}
    {/each}
  </div>
  <Taskbar windows={os.windows} activeId={top?.id} onpick={(id) => (os = focusWindow(os, id))} />
</div>

<style>
  .desktop {
    position: fixed; inset: 0; display: grid; grid-template-rows: 1fr var(--taskbar);
    background: var(--paper) radial-gradient(rgba(11, 11, 11, .14) 1.5px, transparent 1.5px) 0 0 / 18px 18px;
    overflow: hidden; user-select: none;
  }
  .area { position: relative; overflow: hidden; }
  .icons { list-style: none; margin: 0; padding: 20px; display: grid; grid-auto-flow: column; grid-template-rows: repeat(auto-fill, 104px); gap: 8px; height: 100%; width: max-content; }
  .icon { width: 96px; display: grid; justify-items: center; gap: 6px; background: none; border: 2px solid transparent; padding: 6px 4px; cursor: pointer; font: 700 12px/1.2 var(--font-mono); color: var(--ink); }
  .icon__img { width: 52px; height: 52px; display: grid; place-items: center; font-size: 26px; background: var(--white); border: var(--border); box-shadow: 4px 4px 0 var(--ink); transition: transform .3s var(--ease-spring); }
  .icon:hover .icon__img { transform: translateY(-4px) rotate(-4deg); }
  .icon.selected .icon__label, .icon:focus-visible .icon__label { background: var(--accent); }
  .icon__label { padding: 1px 4px; }
  .hint { position: absolute; right: 20px; bottom: 12px; margin: 0; font-size: 12px; opacity: .6; }
</style>
