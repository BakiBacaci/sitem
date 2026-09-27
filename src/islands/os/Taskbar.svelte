<script lang="ts">
  import { onMount } from 'svelte';
  import { findApp } from '../../lib/os/apps';
  import type { Win } from '../../lib/os/windowManager';

  let { windows, activeId, onpick }: { windows: Win[]; activeId?: string; onpick: (id: string) => void } = $props();

  let time = $state('');
  let menuOpen = $state(false);

  onMount(() => {
    const tick = () => (time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 10_000);
    return () => clearInterval(t);
  });
</script>

<footer class="taskbar">
  <div class="start">
    <button type="button" class="start__btn" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}>★ BAKİ</button>
    {#if menuOpen}
      <nav class="start__menu" aria-label="Başlat menüsü">
        <a href="/">← Siteye dön</a>
        <a href="/#isler">İşlerim</a>
        <a href="/#iletisim">Yaz bana</a>
      </nav>
    {/if}
  </div>
  <ul class="items">
    {#each windows as w (w.id)}
      <li>
        <button type="button" data-taskbar-item class:active={w.id === activeId && !w.minimized} onclick={() => onpick(w.id)}>
          {findApp(w.appId)?.icon} {findApp(w.appId)?.title}
        </button>
      </li>
    {/each}
  </ul>
  <span class="clock">{time}</span>
</footer>

<style>
  .taskbar { display: flex; align-items: center; gap: 10px; padding: 0 10px; background: var(--white); border-top: var(--border); z-index: 10000; position: relative; font-weight: 800; }
  .start { position: relative; }
  .start__btn { background: var(--accent); border: var(--border); box-shadow: 3px 3px 0 var(--ink); padding: 5px 12px; font: 800 14px var(--font-mono); cursor: pointer; }
  .start__menu { position: absolute; bottom: 48px; left: 0; display: grid; min-width: 200px; background: var(--white); border: var(--border); box-shadow: var(--shadow); }
  .start__menu a { padding: 10px 14px; text-decoration: none; border-bottom: 2px solid var(--ink); }
  .start__menu a:last-child { border-bottom: 0; }
  .start__menu a:hover { background: var(--accent); }
  .items { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; overflow-x: auto; flex: 1; }
  .items button { border: 2px solid var(--ink); background: var(--paper); padding: 4px 10px; font: 700 12px var(--font-mono); cursor: pointer; white-space: nowrap; }
  .items button.active { background: var(--ink); color: var(--accent); }
  .clock { font-size: 13px; }
</style>
