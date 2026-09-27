import { prefersReducedMotion } from './motion';

const RADIUS = 120;
const MAX_PULL = 12;

/** `[data-magnetic]` öğelerini imlece doğru en fazla 12 px çeker (yalnızca farede, hareket açıkken). */
export function bindMagnets(): void {
  if (prefersReducedMotion() || !matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]:not([data-magnet-bound])').forEach((el) => {
    el.dataset.magnetBound = '1';
    const onMove = (e: PointerEvent) => {
      if (!el.isConnected) return window.removeEventListener('pointermove', onMove);
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + RADIUS;
      if (d > reach) { el.style.translate = ''; return; }
      const k = (1 - d / reach) * MAX_PULL;
      el.style.translate = `${(dx / (d || 1)) * k}px ${(dy / (d || 1)) * k}px`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
  });
}
