import { describe, expect, it } from 'vitest';
import { canPost, containsProfanity, validateNote, type NoteInput } from './validate';

const note = (over: Partial<NoteInput> = {}): NoteInput => ({ text: 'selam!', drawing: '', paper: 'sari', x: 0.5, y: 0.5, ...over });
const DRAWING = '0|10,10 20,20 30,40';

describe('validateNote', () => {
  it('geçerli notu kırpılmış metinle kabul eder', () => {
    expect(validateNote(note({ text: '  merhaba  ' }))).toEqual({ ok: true, note: note({ text: 'merhaba' }) });
  });

  it('yazı da çizim de yoksa → bos', () => {
    expect(validateNote(note({ text: '   ' }))).toEqual({ ok: false, error: 'bos' });
  });

  it('yazısız ama çizimli not geçerli', () => {
    expect(validateNote(note({ text: '', drawing: DRAWING }))).toEqual({ ok: true, note: note({ text: '', drawing: DRAWING }) });
  });

  it('bozuk ya da çok uzun çizim → gecersiz', () => {
    expect(validateNote(note({ drawing: '<svg onload=alert(1)>' }))).toEqual({ ok: false, error: 'gecersiz' });
    expect(validateNote(note({ drawing: '0|1,1 '.repeat(3000) }))).toEqual({ ok: false, error: 'gecersiz' });
  });

  it('81 karakter → uzun, 80 karakter → ok', () => {
    expect(validateNote(note({ text: 'a'.repeat(81) }))).toEqual({ ok: false, error: 'uzun' });
    expect(validateNote(note({ text: 'a'.repeat(80) })).ok).toBe(true);
  });

  it('emoji grapheme olarak sayılır', () => {
    expect(validateNote(note({ text: '👍'.repeat(80) })).ok).toBe(true);
    expect(validateNote(note({ text: '👍'.repeat(81) }))).toEqual({ ok: false, error: 'uzun' });
    expect(validateNote(note({ text: '👨‍👩‍👧'.repeat(80) })).ok).toBe(true);
  });

  it('geçersiz kağıt rengi ya da konum → gecersiz', () => {
    expect(validateNote(note({ paper: 'mor' }))).toEqual({ ok: false, error: 'gecersiz' });
    expect(validateNote(note({ x: 1.5 }))).toEqual({ ok: false, error: 'gecersiz' });
    expect(validateNote(note({ y: Number.NaN }))).toEqual({ ok: false, error: 'gecersiz' });
  });

  it('HTML içeren metin düz metin olarak kabul edilir (render tarafı kaçırır)', () => {
    expect(validateNote(note({ text: '<script>alert(1)</script>' })).ok).toBe(true);
  });

  it('küfür → kufur', () => {
    expect(validateNote(note({ text: 'sen bir SALAKSIN' }))).toEqual({ ok: false, error: 'kufur' });
  });
});

describe('containsProfanity', () => {
  it('büyük harf ve rakam değişimlerini yakalar', () => {
    expect(containsProfanity('SALAK')).toBe(true);
    expect(containsProfanity('s@l@k')).toBe(true);
    expect(containsProfanity('ger1zekal1')).toBe(true);
  });

  it('masum kelimeleri yakalamaz', () => {
    expect(containsProfanity('harika bir site olmuş')).toBe(false);
    expect(containsProfanity('salata')).toBe(false);
  });
});

describe('canPost', () => {
  const now = 1_000_000;
  it('30 saniyede bir gönderime izin verir', () => {
    expect(canPost(now - 10_000, now)).toBe(false);
    expect(canPost(now - 31_000, now)).toBe(true);
    expect(canPost(null, now)).toBe(true);
  });
});
