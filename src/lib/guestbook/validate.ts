import { decodeStrokes, MAX_DRAWING_CHARS } from '../board/strokes';

export const PAPERS = ['sari', 'pembe', 'turuncu', 'mavi'] as const;
export const MAX_LEN = 80;
export const MIN_INTERVAL_MS = 30_000;

export type NoteInput = { text: string; drawing: string; paper: string; x: number; y: number };
export type NoteError = 'bos' | 'uzun' | 'kufur' | 'gecersiz';

// Kelimenin başıyla eşleşenler (salaksın, aptallar) ve yalnızca tam kelime olarak eşleşenler (kısa ve masum kelimelerin içinde geçebilenler).
const PREFIX_WORDS = ['salak', 'aptal', 'gerizekali', 'ahmak', 'haysiyetsiz', 'serefsiz', 'orospu', 'pezevenk', 'yavsak'];
const EXACT_WORDS = ['amk', 'aq', 'oc', 'sik', 'mal', 'got'];

const LEET: Record<string, string> = { '1': 'i', '0': 'o', '@': 'a', '3': 'e', '4': 'a', '$': 's', '5': 's' };
const FOLD: Record<string, string> = { ı: 'i', ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c' };

function normalize(text: string): string[] {
  const lower = text.toLocaleLowerCase('tr').replace(/[10@34$5]/g, (c) => LEET[c]).replace(/[ışğüöç]/g, (c) => FOLD[c]);
  return lower.split(/[^a-z]+/).filter(Boolean);
}

export function containsProfanity(text: string): boolean {
  return normalize(text).some((w) => EXACT_WORDS.includes(w) || PREFIX_WORDS.some((p) => w.startsWith(p)));
}

function graphemeCount(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    let n = 0;
    for (const _ of new Intl.Segmenter('tr', { granularity: 'grapheme' }).segment(text)) n++;
    return n;
  }
  return [...text].length;
}

const inUnit = (v: number) => Number.isFinite(v) && v >= 0 && v <= 1;

export function validateNote(n: NoteInput): { ok: true; note: NoteInput } | { ok: false; error: NoteError } {
  const text = n.text.trim();
  if (!text && !n.drawing) return { ok: false, error: 'bos' };
  if (graphemeCount(text) > MAX_LEN) return { ok: false, error: 'uzun' };
  const drawingOk = !n.drawing || (n.drawing.length <= MAX_DRAWING_CHARS && decodeStrokes(n.drawing).length > 0);
  if (!drawingOk || !(PAPERS as readonly string[]).includes(n.paper) || !inUnit(n.x) || !inUnit(n.y)) {
    return { ok: false, error: 'gecersiz' };
  }
  if (containsProfanity(text)) return { ok: false, error: 'kufur' };
  return { ok: true, note: { ...n, text } };
}

export function canPost(lastPostAt: number | null, now: number): boolean {
  return lastPostAt === null || now - lastPostAt >= MIN_INTERVAL_MS;
}
