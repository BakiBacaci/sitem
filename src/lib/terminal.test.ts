import { describe, expect, it } from 'vitest';
import { runCommand } from './terminal';

describe('runCommand', () => {
  it('help büyük/küçük harf ve boşluk duyarsız, komutları listeler', () => {
    expect(runCommand('  HELP ').lines.join('\n')).toContain('whoami');
  });

  it('cv komutu artık bir şey açmaz', () => {
    expect(runCommand('cv').action).toBeUndefined();
  });

  it('oyna komutu yılanı açar', () => {
    expect(runCommand('oyna').action).toEqual({ type: 'open', appId: 'yilan' });
  });

  it('clear ekranı temizler', () => {
    expect(runCommand('clear').action).toEqual({ type: 'clear' });
  });

  it('bilinmeyen komut yardımcı mesaj verir', () => {
    expect(runCommand('xyz').lines[0]).toBe("komut bulunamadı: xyz. 'help' yaz.");
  });

  it('boş girdi çıktı üretmez', () => {
    expect(runCommand('').lines).toEqual([]);
    expect(runCommand('   ').lines).toEqual([]);
  });

  it('gizli sudo komutu', () => {
    expect(runCommand('sudo rm -rf /').lines[0]).toBe('güzel deneme.');
  });
});
