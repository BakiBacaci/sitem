import { gsap } from 'gsap';
import { prefersReducedMotion } from './motion';

const SHAPES = ['★', '●', '■', '▲', '✦'];
const COLORS = ['#ff5a1f', '#0b0b0b', '#ffffff'];

/** Verilen noktadan sticker gibi parçalar saçar; 1.2 sn sonra temizler. */
export function burst(originX: number, originY: number, count = 24): void {
  if (prefersReducedMotion()) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:95;overflow:hidden';
  document.body.appendChild(layer);

  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = SHAPES[i % SHAPES.length];
    s.style.cssText = `position:absolute;left:${originX}px;top:${originY}px;font:900 ${16 + Math.random() * 22}px/1 sans-serif;color:${COLORS[i % COLORS.length]};-webkit-text-stroke:1.5px #0b0b0b`;
    layer.appendChild(s);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 220;
    gsap.to(s, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 80,
      rotate: (Math.random() - 0.5) * 540,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
    });
  }
  setTimeout(() => layer.remove(), 1200);
}
