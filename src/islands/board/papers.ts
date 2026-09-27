import type { PAPERS } from '../../lib/guestbook/validate';

export const PAPER_COLORS: Record<string, string> = {
  sari: '#ffe066',
  pembe: '#ff9ecb',
  turuncu: '#ff9a5c',
  mavi: '#9fd3ff',
} satisfies Record<(typeof PAPERS)[number], string>;
