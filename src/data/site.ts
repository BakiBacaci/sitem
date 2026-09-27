export const site = {
  name: 'Baki Bacacı',
  short: 'BAKİ',
  role: 'Web tasarım · yazılım · yapay zekâ',
  location: 'Ordu, Türkiye',
  email: 'bakibacaci05@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/BakiBacaci' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bakibacaci' },
    { label: 'Instagram', href: 'https://www.instagram.com/bakibacaci' },
    { label: 'itch.io', href: 'https://bakibacaci.itch.io' },
  ],
  // Kaynak: public/img/portrait.jpg. Değiştirince `npm run portrait` ile küçük kopyayı yeniden üret.
  portrait: '/img/portrait-640.webp',
  // Fotoğrafta yüzün/gövdenin merkezi (0–1) ve yakınlaştırma; kadrajlar buna göre kırpılır.
  portraitFocus: { x: 0.6, y: 0.6, zoom: 2 },
} as const;
