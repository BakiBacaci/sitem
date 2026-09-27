<script lang="ts">
  import { onMount } from 'svelte';
  import { encodeStrokes, PEN_COLORS, simplify, type Stroke } from '../../lib/board/strokes';
  import { MAX_LEN, PAPERS } from '../../lib/guestbook/validate';
  import { PAPER_COLORS } from './papers';

  let { onsubmit, oncancel, error = '' }: {
    onsubmit: (n: { text: string; drawing: string; paper: string }) => void;
    oncancel: () => void;
    error?: string;
  } = $props();

  const PEN_NAMES = ['siyah kalem', 'turuncu kalem', 'mavi kalem'];
  let text = $state('');
  let paper = $state<(typeof PAPERS)[number]>('sari');
  let pen = $state(0);
  let strokes = $state<Stroke[]>([]);
  let canvas: HTMLCanvasElement;
  let current: [number, number][] | null = null;

  const count = $derived.by(() => {
    const t = text.trim();
    return typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? [...new Intl.Segmenter('tr', { granularity: 'grapheme' }).segment(t)].length
      : [...t].length;
  });

  function redraw() {
    const g = canvas?.getContext('2d');
    if (!g) return;
    const w = canvas.width;
    g.clearRect(0, 0, w, w);
    g.lineCap = g.lineJoin = 'round';
    g.lineWidth = w * 0.024;
    for (const s of [...strokes, ...(current ? [{ c: pen, pts: current }] : [])]) {
      g.strokeStyle = PEN_COLORS[s.c];
      g.beginPath();
      s.pts.forEach(([x, y], i) => (i ? g.lineTo(x * w, y * w) : g.moveTo(x * w, y * w)));
      if (s.pts.length === 1) g.lineTo(s.pts[0][0] * w + 0.1, s.pts[0][1] * w);
      g.stroke();
    }
  }

  const pos = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
  };
  function down(e: PointerEvent) { canvas.setPointerCapture(e.pointerId); current = [pos(e)]; redraw(); }
  function move(e: PointerEvent) { if (!current) return; current.push(pos(e)); redraw(); }
  function up() {
    if (!current) return;
    strokes = [...strokes, { c: pen, pts: simplify(current, 0.006) }];
    current = null;
    redraw();
  }

  onMount(() => {
    const size = Math.round(canvas.clientWidth * Math.min(devicePixelRatio || 1, 2));
    canvas.width = canvas.height = size;
    redraw();
  });

  function submit(e: SubmitEvent) {
    e.preventDefault();
    onsubmit({ text, drawing: encodeStrokes(strokes), paper });
  }
</script>

<form class="editor" data-editor style={`--bg:${PAPER_COLORS[paper]}`} onsubmit={submit}>
  <div class="paper">
    <label class="sr-only" for="postit-text">Yazı</label>
    <textarea id="postit-text" bind:value={text} rows="2" placeholder="bir şey yaz…"></textarea>
    <span class="count" class:over={count > MAX_LEN}>{count}/{MAX_LEN}</span>
    <canvas bind:this={canvas} data-draw aria-label="Çizim alanı" onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}></canvas>
  </div>

  <div class="tools">
    <div class="group" role="group" aria-label="Kalem">
      {#each PEN_COLORS as c, i}
        <button type="button" class="dot" class:on={pen === i} aria-pressed={pen === i} aria-label={PEN_NAMES[i]} style={`--c:${c}`} onclick={() => (pen = i)}></button>
      {/each}
      <button type="button" onclick={() => { strokes = strokes.slice(0, -1); redraw(); }} disabled={!strokes.length}>↶ Geri al</button>
      <button type="button" onclick={() => { strokes = []; redraw(); }} disabled={!strokes.length}>Temizle</button>
    </div>
    <div class="group" role="group" aria-label="Kağıt rengi">
      {#each PAPERS as p}
        <button type="button" class="swatch" class:on={paper === p} aria-pressed={paper === p} aria-label={p} style={`--c:${PAPER_COLORS[p]}`} onclick={() => (paper = p)}></button>
      {/each}
    </div>
  </div>

  {#if error}<p class="err" role="alert">{error}</p>{/if}

  <div class="actions">
    <button type="button" class="ghost" onclick={oncancel}>Vazgeç</button>
    <button type="submit" class="go">Yapıştır 📌</button>
  </div>
</form>

<style>
  .editor { display: grid; gap: 12px; width: min(360px, 92vw); animation: lift .45s var(--ease-spring); }
  .paper {
    background: var(--bg); border: 2px solid var(--ink); box-shadow: 4px 6px 0 var(--ink), 0 24px 30px -12px rgba(0,0,0,.5);
    padding: 16px 14px 12px; display: grid; gap: 6px; rotate: -1.5deg; position: relative;
  }
  textarea { background: transparent; border: 0; border-bottom: 2px dashed rgba(11,11,11,.35); resize: none; font: 700 15px/1.35 var(--font-mono); color: var(--ink); outline: none; padding: 2px 0; }
  .count { justify-self: end; font-size: 11px; font-weight: 800; }
  .count.over { color: #b3200e; }
  canvas { width: 100%; aspect-ratio: 1; touch-action: none; cursor: crosshair; background-image: radial-gradient(rgba(11,11,11,.12) 1px, transparent 1px); background-size: 12px 12px; }
  .tools { display: grid; gap: 8px; }
  .group { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .group button { border: 2px solid var(--ink); background: var(--white); font: 700 12px var(--font-mono); padding: 4px 8px; cursor: pointer; }
  .group button:disabled { opacity: .4; cursor: default; }
  .dot, .swatch { width: 30px; height: 30px; padding: 0 !important; background: var(--c) !important; }
  .dot { border-radius: 50%; }
  .on { outline: 3px solid var(--accent); outline-offset: 2px; }
  .err { margin: 0; font-weight: 800; color: #fff; background: #b3200e; padding: 4px 8px; }
  .actions { display: flex; justify-content: space-between; gap: 10px; }
  .actions button { font: 800 14px var(--font-mono); border: var(--border); padding: 8px 14px; cursor: pointer; }
  .ghost { background: var(--paper); }
  .go { background: var(--accent); box-shadow: 4px 4px 0 var(--ink); }
  @keyframes lift { from { transform: translate(40vw, 30vh) scale(.3) rotate(20deg); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .editor { animation: none; } }
</style>
