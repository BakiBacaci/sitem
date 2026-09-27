import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let lenisInstance: Lenis | null = null;

/** Lenis + ScrollTrigger'ı bir kez kurar. Reduced motion'da hiçbir şey başlatmaz. */
export async function initMotion(): Promise<{ lenis: Lenis | null }> {
  if (prefersReducedMotion()) return { lenis: null };
  if (lenisInstance) return { lenis: lenisInstance };

  gsap.registerPlugin(ScrollTrigger);
  const { default: LenisCtor } = await import('lenis');
  const lenis = new LenisCtor({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenisInstance = lenis;
  return { lenis };
}

/** Aynı sayfadaki bölüm bağlantılarını (`#id` ya da `/#id`) yumuşak kaydırmayla açar. */
export function bindHashLinks(getLenis: () => Lenis | null): void {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
    e.preventDefault();
    scrollToHash(url.hash, getLenis());
  });
}

/** `#id` bölümüne (varsa Lenis ile) yumuşakça kayar, adresi günceller ve odağı taşır. */
export function scrollToHash(hash: string, lenis: Lenis | null = lenisInstance): void {
  const target = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
  if (!target) return;
  history.pushState(null, '', hash);
  if (lenis) lenis.scrollTo(target, { offset: 0 });
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export function currentLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Öğeleri scroll'da gösterir. Başlangıç (gizli) durumu yalnızca burada, JS içinde verilir;
 * böylece JS yoksa ya da reduced motion açıksa içerik her zaman görünür kalır.
 */
export function reveal(selector: string, vars: gsap.TweenVars = {}): void {
  if (prefersReducedMotion()) return;
  const els = gsap.utils.toArray<HTMLElement>(selector);
  if (els.length === 0) return;
  gsap.registerPlugin(ScrollTrigger);

  const { stagger = 0.08, ...from } = vars;
  gsap.set(els, { opacity: 0, y: 60, ...from });
  ScrollTrigger.batch(els, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.9, ease: 'back.out(1.6)', stagger }),
  });
}
