import { afterEach, describe, expect, it, vi } from 'vitest';
import { initMotion, prefersReducedMotion } from './motion';

function stubMotionPreference(reduce: boolean) {
  vi.stubGlobal('window', {
    matchMedia: (q: string) => ({ matches: reduce && q.includes('reduce'), media: q }),
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('prefersReducedMotion', () => {
  it('reduce tercih edilince true döner', () => {
    stubMotionPreference(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('tercih yoksa false döner', () => {
    stubMotionPreference(false);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('initMotion', () => {
  it('reduced motion açıkken hiçbir şey başlatmaz', async () => {
    stubMotionPreference(true);
    await expect(initMotion()).resolves.toEqual({ lenis: null });
  });
});
