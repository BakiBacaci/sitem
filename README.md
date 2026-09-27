# bakibacaci — kişisel site

Kağıt Brutal stilinde kişisel site: tek uzun ana sayfa, proje ve blog sayfaları, `/oyun` altında **BAKİ OS** masaüstü ve girişte, ziyaretçilerin yazıp çizebildiği Firebase'li **post-it panosu**.

Astro 7 · Svelte 5 · Three.js · GSAP + Lenis · Firebase (Firestore + Hosting)

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ klasörüne statik çıktı
npm run preview    # build'i yerelde aç
```

## Testler

```bash
npm test           # birim testleri (Vitest)
npm run e2e        # uçtan uca testler (Playwright, kurulu Chrome'u kullanır)
npm run test:rules # Firestore güvenlik kuralları (Java + Firebase CLI gerekir)
```

## İçeriği güncelleme

Kodun içine dokunmadan değiştirilebilen her şey veri dosyalarında:

| Ne | Nerede |
|---|---|
| Ad, e-posta, sosyal linkler, CV yolu | `src/data/site.ts` |
| Öne çıkan projeler | `src/content/works/*.md` (bir dosya = bir proje; `order` sıralar) |
| Arşiv listesi | `src/data/archive.ts` |
| Yetenek bantları | `src/data/skills.ts` |
| Yolculuk durakları | `src/data/journey.ts` (yıllar artan sırada) |
| Blog yazıları | `src/content/posts/*.md` (`draft: true` yayınlanmaz) |

**Fotoğraf:** `public/img/portrait.jpg` dosyasını değiştir, sonra `npm run portrait` ile küçük kopyayı üret. Kadraj `src/data/site.ts` içindeki `portraitFocus` ile ayarlanır (`x`, `y`: yüzün yeri 0–1 arası; `zoom`: yakınlaştırma).

**BAKİ OS'a uygulama eklemek:** `src/islands/os/apps/` altına bir Svelte bileşeni koy, `src/lib/os/appIds.ts` ve `src/lib/os/apps.ts` dosyalarına birer satır ekle.

## Post-it panosu (Firebase)

1. Firebase konsolunda bir proje oluştur, Firestore'u aç, bir web uygulaması ekle.
2. `.env.example` dosyasını `.env` olarak kopyala ve değerleri doldur.
3. **App Check'i aç (spam koruması):** Firebase konsolu → App Check → web uygulaması → **Fraud Defense (reCAPTCHA Enterprise)** → anahtar oluştur (alan adları: `bakibacaci.web.app`, `bakibacaci.firebaseapp.com`, `localhost`). Çıkan **site anahtarını** `.env` içinde `PUBLIC_RECAPTCHA_KEY` olarak yaz, yeniden build al ve yayınla. Sonra App Check → APIs → **Cloud Firestore → Enforce**. (Klasik reCAPTCHA v3 kullanımdan kalktı; kod Enterprise sağlayıcısını kullanıyor.)
4. Kuralları yükle: `firebase deploy --only firestore:rules`

`.env` yoksa pano "şu an kapalı" gösterir, sitenin geri kalanı normal çalışır. Çizimler otomatik denetlenemez; uygunsuz bir kağıdı Firebase konsolunda `notes` koleksiyonundan silebilirsin.

## Yayına alma

```bash
firebase login
firebase use --add          # projeni seç
npm run build
firebase deploy --only hosting
```
