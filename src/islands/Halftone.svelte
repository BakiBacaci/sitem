<script lang="ts">
  import { onMount } from 'svelte';
  import { computeDots, displace, type Dot } from '../lib/halftone';
  import { prefersReducedMotion } from '../lib/motion';

  type Focus = { x: number; y: number; zoom: number };
  let { src, step = 10, alt = '', focus = { x: 0.5, y: 0.5, zoom: 1 } }: { src: string; step?: number; alt?: string; focus?: Focus } = $props();

  let canvas: HTMLCanvasElement;
  let ready = $state(false);

  const ACCENT = '#ff5a1f';
  const INTRO_MS = 900;
  const RADIUS = 70;
  const STRENGTH = 18;

  function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = url;
    });
  }

  // Görüntüyü kutuya "cover" gibi yerleştirip parlaklık kanalını çıkarır.
  function luminance(img: HTMLImageElement, w: number, h: number): Uint8ClampedArray {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    // "cover" ölçeği × yakınlaştırma; odak noktası kutunun ortasına gelir, kenarlar taşmaz.
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * focus.zoom;
    const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
    const ox = Math.min(0, Math.max(w - iw, w / 2 - focus.x * iw));
    const oy = Math.min(0, Math.max(h - ih, h / 2 - focus.y * ih));
    g.drawImage(img, ox, oy, iw, ih);
    const px = g.getImageData(0, 0, w, h).data;
    const out = new Uint8ClampedArray(w * h);
    for (let i = 0; i < out.length; i++) {
      const l = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
      const v = Math.pow(Math.min(1, Math.max(0, (l - 0.12) / 0.7)), 0.8);
      // Vinyet: odaktan uzaklaştıkça noktalar seyrelir, kişi öne çıkar.
      const dx = (i % w) / w - 0.5, dy = Math.floor(i / w) / h - 0.5;
      const keep = Math.min(1, Math.max(0, 1 - (Math.hypot(dx, dy * 0.9) - 0.28) / 0.25));
      out[i] = 255 * (1 - (1 - v) * keep);
    }
    return out;
  }

  onMount(() => {
    const reduce = prefersReducedMotion();
    const ctx = canvas.getContext('2d')!;
    let dots: Dot[] = [];
    let starts: { x: number; y: number }[] = [];
    let t0 = 0, raf = 0, mx = -1e4, my = -1e4, running = false, dpr = 1, disposed = false;

    function draw(progress: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ACCENT;
      const e = 1 - Math.pow(1 - progress, 3);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const bx = starts[i].x + (d.x - starts[i].x) * e;
        const by = starts[i].y + (d.y - starts[i].y) * e;
        const p = progress >= 1 ? displace({ x: bx, y: by, r: d.r }, mx, my, RADIUS, STRENGTH) : { x: bx, y: by };
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, d.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now: number) {
      if (disposed) return;
      const progress = Math.min(1, (now - t0) / INTRO_MS);
      draw(progress);
      raf = progress < 1 || running ? requestAnimationFrame(frame) : 0;
    }

    async function build() {
      const img = await loadImage(src);
      if (disposed) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      dots = computeDots(luminance(img, Math.round(w), Math.round(h)), Math.round(w), Math.round(h), step);
      starts = reduce ? dots.map((d) => ({ x: d.x, y: d.y })) : dots.map(() => ({ x: Math.random() * w, y: Math.random() * h }));
      ready = true;
      if (reduce) { draw(1); return; }
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ready) void build();
    }, { rootMargin: '200px' });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!running && ready && !reduce) { running = true; raf = raf || requestAnimationFrame(frame); }
    };
    const onLeave = () => { mx = my = -1e4; setTimeout(() => { running = false; }, 400); };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    return () => { disposed = true; cancelAnimationFrame(raf); io.disconnect(); };
  });
</script>

<div class="halftone">
  <canvas bind:this={canvas} data-halftone role="img" aria-label={alt}></canvas>
  {#if !ready}<img src={src} alt="" aria-hidden="true" />{/if}
</div>

<style>
  .halftone { position: relative; width: 100%; aspect-ratio: 5 / 6; }
  canvas, img { position: absolute; inset: 0; width: 100%; height: 100%; }
  img { object-fit: cover; filter: grayscale(1) contrast(1.2); mix-blend-mode: multiply; opacity: .9; }
</style>
