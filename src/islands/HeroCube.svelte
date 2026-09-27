<script lang="ts">
  import { onMount } from 'svelte';
  import { CUBE_FACES, faceForMaterial } from '../lib/cubeFaces';
  import { prefersReducedMotion, scrollToHash } from '../lib/motion';

  const INK = '#0b0b0b';
  const CLICK_SLOP = 6; // bundan az hareket = tıklama, fazlası = sürükleme
  const JUMP_DELAY_MS = 380;

  let host: HTMLDivElement;
  let use3d = $state(false);
  let label = $state<{ text: string; x: number; y: number } | null>(null);

  function webglAvailable(): boolean {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  }

  function faceTexture(THREE: typeof import('three'), bg: string, fg: string, glyph: string) {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d')!;
    g.fillStyle = bg;
    g.fillRect(0, 0, size, size);
    g.lineWidth = 14;
    g.strokeStyle = INK;
    g.strokeRect(7, 7, size - 14, size - 14);
    if (glyph) {
      g.fillStyle = fg;
      g.font = `900 150px Unbounded, "Arial Black", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(glyph, size / 2, size / 2 + 8);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  onMount(() => {
    if (prefersReducedMotion() || !webglAvailable()) return;
    let disposed = false;
    let cleanup = () => {};

    // Sayfanın ilk çizimini bekletmesin: tarayıcı boşa çıkınca başla.
    const idle = (fn: () => void) =>
      'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 600);
    const start = () => idle(() => void boot());
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });

    async function boot() {
      if (disposed) return;
      const THREE = await import('three');
      try { await document.fonts.load('900 150px Unbounded'); } catch { /* yedek yazı tipi kullanılır */ }
      if (disposed) return;

      use3d = true;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.dataset.cube = '';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 6.2);

      const geo = new THREE.BoxGeometry(2, 2, 2);
      const mats = CUBE_FACES.map((f) => new THREE.MeshBasicMaterial({ map: faceTexture(THREE, f.bg, f.fg, f.glyph) }));
      const cube = new THREE.Mesh(geo, mats);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: INK }));
      cube.add(edges);
      cube.rotation.set(-0.35, 0.6, 0);
      scene.add(cube);

      const resize = () => {
        const s = host.clientWidth;
        renderer.setSize(s, s, false);
        renderer.domElement.style.width = renderer.domElement.style.height = '100%';
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // Sürükle-döndür (ataletle sönümlenir), boşta yavaşça döner. Kısa tıklama = yüzün bölümüne git.
      let vx = 0, vy = 0, dragging = false, lx = 0, ly = 0, sx = 0, sy = 0;
      const el = renderer.domElement;
      el.style.touchAction = 'pan-y';
      el.style.cursor = 'grab';
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();

      function faceAt(clientX: number, clientY: number) {
        const r = el.getBoundingClientRect();
        ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObject(cube, false)[0];
        return hit?.face ? faceForMaterial(hit.face.materialIndex) : undefined;
      }

      const down = (e: PointerEvent) => {
        dragging = true; lx = sx = e.clientX; ly = sy = e.clientY;
        el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; label = null;
      };
      const move = (e: PointerEvent) => {
        if (dragging) {
          vy = (e.clientX - lx) * 0.01; vx = (e.clientY - ly) * 0.01;
          lx = e.clientX; ly = e.clientY;
          return;
        }
        const face = faceAt(e.clientX, e.clientY);
        const r = host.getBoundingClientRect();
        label = face?.label ? { text: `→ ${face.label}`, x: e.clientX - r.left, y: e.clientY - r.top } : null;
        el.style.cursor = face?.target ? 'pointer' : 'grab';
      };
      const up = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false; el.style.cursor = 'grab';
        if (Math.hypot(e.clientX - sx, e.clientY - sy) > CLICK_SLOP) return;
        const face = faceAt(e.clientX, e.clientY);
        if (!face?.target) return;
        vy += 0.45; // hızlı bir tur at, sonra bölüme atla
        label = null;
        const target = face.target;
        setTimeout(() => scrollToHash(target), JUMP_DELAY_MS);
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', () => { dragging = false; });
      el.addEventListener('pointerleave', () => { if (!dragging) label = null; });

      let visible = true, raf = 0;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
      io.observe(host);

      function loop() {
        if (!visible || disposed) { raf = 0; return; }
        cube.rotation.x += vx;
        cube.rotation.y += vy + 0.004;
        if (!dragging) { vx *= 0.92; vy *= 0.92; }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
        geo.dispose();
        renderer.dispose();
        el.remove();
      };
    }

    return () => { disposed = true; cleanup(); };
  });
</script>

<div class="cube" bind:this={host}>
  {#if !use3d}
    <img data-cube-fallback src="/img/cube-fallback.svg" alt="" width="400" height="400" />
  {/if}
  {#if label}
    <span class="cube__label" data-cube-label style={`left:${label.x}px;top:${label.y}px`}>{label.text}</span>
  {/if}
</div>

<style>
  .cube { position: relative; width: 100%; aspect-ratio: 1; }
  .cube :global(canvas), .cube img { width: 100%; height: 100%; display: block; }
  .cube__label {
    position: absolute; translate: 14px -130%; pointer-events: none; white-space: nowrap;
    background: var(--ink); color: var(--accent); box-shadow: 3px 3px 0 var(--accent);
    font: 800 13px var(--font-mono); padding: 3px 8px;
  }
</style>
