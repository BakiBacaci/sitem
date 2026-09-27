import type { AppId } from './os/appIds';

export type TermResult = {
  lines: string[];
  action?: { type: 'clear' } | { type: 'open'; appId: AppId };
};

const HELP = [
  'kullanılabilir komutlar:',
  '  whoami    ben kimim',
  '  projeler  öne çıkan işler',
  '  oyna      yılan oyununu aç',
  '  clear     ekranı temizle',
  '  (bir de gizli komutlar var...)',
];

const COMMANDS: Record<string, () => TermResult> = {
  help: () => ({ lines: HELP }),
  whoami: () => ({ lines: ['Baki Bacacı — yazılım geliştirici, mobil ve oyun.', 'Ordu · Kırıkkale Üni. Bilgisayar Programcılığı'] }),
  projeler: () => ({ lines: ['Blöf           çok oyunculu parti oyunu', 'Plip           slime fiziği bulmaca oyunu', 'Thermal Drift  yamaç paraşütü uçuş oyunu', 'Ders Programı  C# masaüstü + veritabanı'] }),
  cv: () => ({ lines: ['CV şimdilik burada değil. LinkedIn\'den ya da e-postayla isteyebilirsin.'] }),
  oyna: () => ({ lines: ['yilan.exe başlatılıyor...'], action: { type: 'open', appId: 'yilan' } }),
  clear: () => ({ lines: [], action: { type: 'clear' } }),
  sudo: () => ({ lines: ['güzel deneme.'] }),
  kahve: () => ({ lines: ['   ( (', '    ) )', '  ........', '  |      |]', '  \\      /', "   `----'", 'kahve hazır. kod yazalım.'] }),
};

export function runCommand(input: string): TermResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const name = trimmed.split(/\s+/)[0].toLocaleLowerCase('tr');
  const cmd = COMMANDS[name];
  return cmd ? cmd() : { lines: [`komut bulunamadı: ${name}. 'help' yaz.`] };
}
