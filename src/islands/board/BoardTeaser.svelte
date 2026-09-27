<script lang="ts">
  import type { Component } from 'svelte';
  import { currentLenis } from '../../lib/motion';
  import { PAPER_COLORS } from './papers';

  let Board = $state<Component<{ onclose: () => void }> | null>(null);
  let open = $state(false);
  let opener: HTMLButtonElement;

  // Pano, dönüşüm (transform) almış giriş kutusunun içinde kalırsa "fixed" konumu ekrana değil kutuya göre hesaplanır.
  // Bu yüzden panoyu sayfanın köküne taşıyoruz.
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  async function show() {
    Board ??= (await import('./Board.svelte')).default;
    open = true;
    currentLenis()?.stop();
    document.documentElement.style.overflow = 'hidden';
  }
  function hide() {
    open = false;
    currentLenis()?.start();
    document.documentElement.style.overflow = '';
    opener?.focus();
  }
</script>

<button type="button" class="teaser" bind:this={opener} aria-label="Panoyu aç" aria-haspopup="dialog" onclick={show} data-board-teaser data-cursor-hover>
  <span class="teaser__cork" aria-hidden="true">
    <i style={`--c:${PAPER_COLORS.sari};--x:14%;--y:16%;--r:-6deg`}></i>
    <i style={`--c:${PAPER_COLORS.pembe};--x:54%;--y:10%;--r:5deg`}></i>
    <i style={`--c:${PAPER_COLORS.mavi};--x:30%;--y:52%;--r:3deg`}></i>
  </span>
  <span class="teaser__label">POST-IT PANOSU →</span>
</button>

{#if open && Board}<div use:portal><Board onclose={hide} /></div>{/if}

<style>
  .teaser { display: grid; gap: 8px; justify-items: center; background: none; border: 0; padding: 0; cursor: pointer; font: inherit; color: var(--ink); }
  .teaser__cork {
    position: relative; width: clamp(130px, 13vw, 180px); aspect-ratio: 4 / 3; rotate: 4deg;
    border: 7px solid #7a4a25; outline: 3px solid var(--ink); box-shadow: 6px 6px 0 var(--ink);
    background: #c89b62 radial-gradient(rgba(90, 50, 20, .35) 1.2px, transparent 1.4px) 0 0 / 7px 7px;
    transition: rotate .35s var(--ease-spring), transform .35s var(--ease-spring);
  }
  .teaser:hover .teaser__cork, .teaser:focus-visible .teaser__cork { rotate: -2deg; transform: scale(1.06); }
  .teaser__cork i {
    position: absolute; left: var(--x); top: var(--y); width: 34%; aspect-ratio: 1; background: var(--c);
    border: 1.5px solid var(--ink); rotate: var(--r); transition: transform .4s var(--ease-spring);
  }
  .teaser__cork i::before { content: ''; position: absolute; top: -5px; left: 50%; translate: -50% 0; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); border: 1.5px solid var(--ink); }
  .teaser:hover .teaser__cork i:nth-child(2) { transform: translateY(-5px) rotate(-8deg); }
  .teaser__label { font-weight: 800; font-size: 12px; background: var(--accent); border: 2px solid var(--ink); padding: 2px 8px; }
</style>
