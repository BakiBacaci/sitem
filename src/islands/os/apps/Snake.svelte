<script lang="ts">
  import { onMount } from 'svelte';
  import { createGame, step, turn, type Dir, type SnakeState } from '../../../lib/snake';

  const N = 20;
  const TICK_MS = 120;
  const KEY = 'yilan-rekor';
  const KEYS: Record<string, Dir> = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
  };

  let game = $state<SnakeState>(createGame(N, N));
  let started = $state(false);
  let best = $state(0);
  let canvas: HTMLCanvasElement;
  let box: HTMLDivElement;

  function readBest() { try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; } }
  function saveBest(v: number) { try { localStorage.setItem(KEY, String(v)); } catch { /* gizli pencere */ } }

  function draw() {
    const g = canvas.getContext('2d');
    if (!g) return;
    const c = canvas.width / N;
    g.fillStyle = '#f4f4f0'; g.fillRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = 'rgba(11,11,11,.08)';
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) g.fillRect(i * c, j * c, c, c);
    g.fillStyle = '#ff5a1f'; g.strokeStyle = '#0b0b0b'; g.lineWidth = 3;
    g.fillRect(game.food.x * c + 3, game.food.y * c + 3, c - 6, c - 6);
    g.strokeRect(game.food.x * c + 3, game.food.y * c + 3, c - 6, c - 6);
    game.body.forEach((p, i) => {
      g.fillStyle = i === 0 ? '#0b0b0b' : '#ffffff';
      g.fillRect(p.x * c + 1.5, p.y * c + 1.5, c - 3, c - 3);
      g.strokeRect(p.x * c + 1.5, p.y * c + 1.5, c - 3, c - 3);
    });
  }

  function restart() { game = createGame(N, N); started = true; box.focus(); }

  function onKey(e: KeyboardEvent) {
    const d = KEYS[e.key];
    if (d) { e.preventDefault(); if (!started) started = true; game = turn(game, d); }
    if ((e.key === ' ' || e.key === 'Enter') && game.status === 'over') restart();
  }

  let touch: { x: number; y: number } | null = null;
  function tStart(e: TouchEvent) { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function tEnd(e: TouchEvent) {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (!started) started = true;
    game = turn(game, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }

  onMount(() => {
    best = readBest();
    box.focus();
    const t = setInterval(() => {
      if (!started || game.status === 'over') return;
      game = step(game);
      if (game.status === 'over' && game.score > best) { best = game.score; saveBest(best); }
    }, TICK_MS);
    return () => clearInterval(t);
  });

  $effect(() => { void game; if (canvas) draw(); });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="snake" bind:this={box} tabindex="0" role="application" aria-label="Yılan oyunu. Yön tuşları ya da WASD ile oyna." onkeydown={onKey} ontouchstart={tStart} ontouchend={tEnd}>
  <div class="hud"><span>SKOR <b>{game.score}</b></span><span>REKOR <b>{best}</b></span></div>
  <div class="stage">
    <canvas bind:this={canvas} width="400" height="400"></canvas>
    {#if !started}
      <div class="overlay"><p>Yön tuşları / WASD<br />telefonda kaydır</p></div>
    {:else if game.status === 'over'}
      <div class="overlay"><p class="big">OYUN BİTTİ</p><button type="button" onclick={restart}>Tekrar ↻</button></div>
    {/if}
  </div>
</div>

<style>
  .snake { touch-action: none; height: 100%; display: grid; grid-template-rows: auto 1fr; gap: 10px; padding: 12px; outline: none; background: var(--paper); }
  .snake:focus-visible { outline: 3px solid var(--accent); outline-offset: -3px; }
  .hud { display: flex; justify-content: space-between; font-weight: 800; }
  .hud b { background: var(--accent); padding: 0 6px; }
  .stage { position: relative; aspect-ratio: 1; max-height: 100%; margin: 0 auto; width: min(100%, 400px); }
  canvas { width: 100%; height: 100%; border: var(--border); display: block; image-rendering: pixelated; }
  .overlay { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 12px; background: rgba(244, 244, 240, .85); text-align: center; font-weight: 800; }
  .big { font: 900 2rem/1 var(--font-display); margin: 0; }
  .overlay button { background: var(--accent); border: var(--border); box-shadow: 4px 4px 0 var(--ink); padding: 8px 16px; font: 800 14px var(--font-mono); cursor: pointer; }
</style>
