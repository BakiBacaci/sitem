<script lang="ts">
  import { decodeStrokes, PEN_COLORS, strokeToPath } from '../../lib/board/strokes';
  import { tiltFor } from '../../lib/board/tilt';
  import { PAPER_COLORS } from './papers';

  let { id, text, drawing, paper, fresh = false }: { id: string; text: string; drawing: string; paper: string; fresh?: boolean } = $props();
  const strokes = $derived(decodeStrokes(drawing));
</script>

<div class="postit" class:fresh style={`--bg:${PAPER_COLORS[paper] ?? PAPER_COLORS.sari};--r:${tiltFor(id)}deg`}>
  <span class="pin" aria-hidden="true"></span>
  {#if text}<p>{text}</p>{/if}
  {#if strokes.length}
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {#each strokes as s, i (i)}<path d={strokeToPath(s, 100)} stroke={PEN_COLORS[s.c]} />{/each}
    </svg>
  {/if}
</div>

<style>
  .postit {
    position: relative; width: 132px; min-height: 132px; padding: 16px 10px 8px;
    background: var(--bg); box-shadow: 2px 4px 0 rgba(11, 11, 11, .85), 0 10px 14px -8px rgba(0, 0, 0, .45);
    border: 2px solid var(--ink); rotate: var(--r);
    font: 700 12px/1.3 var(--font-mono); color: var(--ink); word-break: break-word;
    display: grid; align-content: start; gap: 4px;
  }
  p { margin: 0; white-space: pre-wrap; }
  svg { width: 100%; aspect-ratio: 1; }
  path { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .pin {
    position: absolute; top: -9px; left: 50%; translate: -50% 0; width: 18px; height: 18px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #ff9a73, var(--accent) 55%, #b33a10); border: 2px solid var(--ink);
  }
  .fresh { animation: stick .55s var(--ease-spring); }
  .fresh .pin { animation: pin .5s .3s both cubic-bezier(.5, 1.8, .6, 1); }
  @keyframes stick { from { scale: 1.8; rotate: 12deg; opacity: .4; } }
  @keyframes pin { from { translate: -50% -40px; opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .fresh, .fresh .pin { animation: none; } }
</style>
