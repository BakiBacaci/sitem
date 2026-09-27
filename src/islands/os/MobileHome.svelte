<script lang="ts">
  import type { Component } from 'svelte';
  import { APPS, findApp } from '../../lib/os/apps';
  import type { AppId } from '../../lib/os/appIds';

  let current = $state<AppId | null>(null);
  let Comp = $state<Component<any> | null>(null);

  async function open(id: AppId) {
    const app = findApp(id);
    if (!app) return;
    Comp = null;
    current = id;
    Comp = (await app.load()).default;
  }
  const api = { open: (id: AppId) => void open(id) };
</script>

{#if current}
  {@const app = findApp(current)}
  <div class="app" data-mobile-app={current}>
    <header>
      <button type="button" onclick={() => (current = null)}>Geri</button>
      <span>{app?.icon} {app?.title}</span>
    </header>
    <div class="app__body" data-lenis-prevent>{#if Comp}<Comp {api} />{:else}<p>yükleniyor…</p>{/if}</div>
  </div>
{:else}
  <div class="home" data-mobile-home>
    <p class="home__title">BAKİ OS</p>
    <ul>
      {#each APPS as app (app.id)}
        <li>
          <button type="button" aria-label={app.title} onclick={() => open(app.id)}>
            <span class="ic" aria-hidden="true">{app.icon}</span>
            <span class="lb">{app.title}</span>
          </button>
        </li>
      {/each}
    </ul>
    <a class="home__back" href="/">← Siteye dön</a>
  </div>
{/if}

<style>
  .home { position: fixed; inset: 0; background: var(--ink); color: var(--paper); padding: 72px 20px 24px; display: flex; flex-direction: column; }
  .home__title { font: 900 2.2rem/1 var(--font-display); color: var(--accent); margin: 0 0 28px; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px 12px; }
  li button { width: 100%; display: grid; justify-items: center; gap: 8px; background: none; border: 0; color: var(--paper); font: 700 11px var(--font-mono); cursor: pointer; }
  .ic { width: 64px; height: 64px; display: grid; place-items: center; font-size: 30px; background: var(--paper); border: var(--border); border-color: var(--paper); border-radius: 16px; box-shadow: 4px 4px 0 var(--accent); }
  li button:active .ic { transform: scale(.9); }
  .home__back { margin-top: auto; color: var(--accent); font-weight: 800; }
  .app { position: fixed; inset: 0; background: var(--white); display: grid; grid-template-rows: 56px 1fr; z-index: 60; }
  .app header { display: flex; align-items: center; gap: 12px; padding: 0 12px; background: var(--accent); border-bottom: var(--border); font-weight: 800; }
  .app header button { border: var(--border); background: var(--white); padding: 6px 12px; font: 800 13px var(--font-mono); }
  .app__body { overflow: auto; min-height: 0; }
</style>
