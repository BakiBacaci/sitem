# Kişisel Site Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** "Kağıt Brutal" stilinde, tek uzun ana sayfa + proje/blog sayfaları + `/oyun` masaüstü işletim sistemi + Firebase ziyaretçi duvarından oluşan kişisel siteyi kurmak.

**Architecture:** Astro statik site; etkileşimli parçalar Svelte adaları. Saf mantık (pencere yöneticisi, yılan, terminal, not doğrulama, halftone) `src/lib/` altında framework'süz TypeScript modülleri olarak yazılır ve Vitest ile test edilir; UI bunları tüketir. İçerik `src/content/` ve `src/data/` altında veri dosyası olarak durur.

**Tech Stack:** Node 24, Astro 7, Svelte 5 (`@astrojs/svelte`), Three.js, GSAP 3 + ScrollTrigger, Lenis, Firebase 12 (Firestore + Hosting + App Check), Vitest, Playwright, `@firebase/rules-unit-testing`.

**Spec:** `docs/superpowers/specs/2026-09-27-kisisel-site-design.md`

## Global Constraints

- Renk token'ları: `--paper #f4f4f0`, `--ink #0b0b0b`, `--accent #ff5a1f`, `--white #ffffff`. Başka renk yalnızca bu token'lardan türetilir.
- Yazı tipleri: başlık *Unbounded* 800–900 büyük harf, gövde *JetBrains Mono*. Google Fonts'tan.
- Çerçeve `3px solid var(--ink)`, gölge `8px 8px 0 var(--ink)` (bulanıksız). Easing yaylanan: `cubic-bezier(.3,1.6,.5,1)`.
- `<html lang="tr">` zorunlu (CSS `text-transform: uppercase` ile "i" → "İ" doğru çıksın).
- Karanlık mod yok.
- Tüm site metni Türkçe. İddialar sade ve doğrulanabilir, abartı sıfatlar yok.
- `prefers-reduced-motion: reduce` iken: GSAP/Lenis başlatılmaz, 3D küp yerine statik SVG, marquee durur, tüm içerik başlangıçta görünür.
- İlk yükleme JS'i < 150 KB gzip (Three.js hariç). Three.js yalnızca giriş adasında, BAKİ OS yalnızca `/oyun`'da, Firebase yalnızca duvar açılınca yüklenir.
- Hedef: mobil Lighthouse performans ≥ 85, erişilebilirlik ≥ 95.
- Duvar notu: en fazla 80 karakter (grapheme), boş olamaz.
- Canavar İşe Giriyor sitede yer almaz.
- İçerik koda gömülmez: projeler `src/content/works/*.md`, yazılar `src/content/posts/*.md`, diğerleri `src/data/*.ts`.

## Review Focus

1. **Reduced motion / JS yok:** Animasyonların "başlangıç durumu" (opacity 0, translate) CSS'te değil JS'te verilmeli; JS çalışmazsa veya reduced motion açıksa her bölüm metni görünür olmalı. → Task 2 ve Task 4'te e2e testi.
2. **Duvar notunda kötü girdi:** Sadece boşluk, 80+ karakter, emoji (grapheme sayımı), `<script>` içeren metin → reddedilir ya da düz metin olarak gösterilir, asla HTML olarak değil. → Task 11 birim testi + e2e.
3. **Pencere ekran dışına sürüklenirse / pencere küçülürse:** Başlık çubuğu her zaman görünür alanda kalmalı (clamp). → Task 10 birim testi.
4. **Yılanda aynı tick içinde iki hızlı tuş (ör. sağa giderken ↑ sonra ←):** Kendi üstüne dönüş olmamalı; yön ters ise yok sayılır, tuşlar kuyruklanır. → Task 9 birim testi.
5. **Firebase yapılandırması yok ya da erişilemiyor:** Duvar "şu an kapalı" sticker'ı gösterir, sayfanın geri kalanı ve diğer pencereler çalışır. → Task 11 e2e testi.

---

### Task 1: Proje iskeleti, token'lar, temel layout

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`, `src/pages/index.astro`
- Test: `e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `BaseLayout` props `{ title: string; description?: string }`, slot; global CSS değişkenleri (Global Constraints'teki adlarla) + `--border`, `--shadow`, `--ease-spring`, `--font-display`, `--font-mono`.
- Produces: npm scriptleri `dev`, `build`, `preview`, `test` (vitest run), `e2e` (playwright test).

- [ ] **Step 1:** `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`, ardından `npx astro add svelte --yes`, `npm i -D vitest @playwright/test`, `npx playwright install chromium`.
- [ ] **Step 2:** `npm run build` çalıştır. Expected: `dist/index.html` oluşur. **Yol hatası (ü karakteri) çıkarsa:** dur, projeyi `C:\dev\sitem`'e taşımayı kullanıcıya öner (spec §10).
- [ ] **Step 3: Failing smoke test** `e2e/smoke.spec.ts`:
```ts
test('ana sayfa açılır, lang tr, kağıt zemin', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(244, 244, 240)');
});
```
`playwright.config.ts`: `webServer: { command: 'npm run build && npm run preview', port: 4321 }`, projeler: `chromium` (desktop) ve `mobile` (`devices['Pixel 7']`).
- [ ] **Step 4:** `npm run e2e` → FAIL.
- [ ] **Step 5:** `tokens.css`, `global.css` (body zemin/yazı, `:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px }`), `BaseLayout.astro` (`lang="tr"`, fontlar `preconnect` + `display=swap`, `<ClientRouter />` Astro view transitions).
- [ ] **Step 6:** `npm run e2e` → PASS.
- [ ] **Step 7: Commit** `chore: astro iskeleti ve tasarım token'ları`

---

### Task 2: Ana sayfa kabuğu, temel bileşenler, hareket altyapısı

**Files:**
- Create: `src/components/{Nav,Sticker,Button,Marquee,SectionDots,Cursor}.astro`
- Create: `src/lib/motion.ts`
- Modify: `src/pages/index.astro`
- Test: `src/lib/motion.test.ts`, `e2e/home.spec.ts`

**Interfaces:**
- Produces: bölüm id'leri (sabit): `giris`, `isler`, `hakkimda`, `yetenekler`, `yolculuk`, `oyun-alani`, `yazilar`, `iletisim`.
- Produces `src/lib/motion.ts`:
  - `prefersReducedMotion(): boolean`
  - `initMotion(): Promise<{ lenis: Lenis | null }>`: reduced motion'da `{ lenis: null }` döner, hiçbir şey kaydetmez; aksi halde Lenis + GSAP ScrollTrigger'ı bağlar (dinamik import).
  - `reveal(selector: string, vars?: gsap.TweenVars): void`: öğeleri **JS içinde** `from` durumuna alıp scroll'da gösterir; reduced motion'da no-op.
- Produces bileşen propları: `Sticker { tilt?: number; tone?: 'white'|'accent'|'ink' }`, `Button { href?: string; variant?: 'accent'|'ink'; magnetic?: boolean }`, `Marquee { items: string[]; reverse?: boolean; speed?: number }`.

- [ ] **Step 1: Failing unit test** `motion.test.ts`: `matchMedia('(prefers-reduced-motion: reduce)')` true mock'lanınca `prefersReducedMotion()` true, `initMotion()` → `{ lenis: null }`.
- [ ] **Step 2: Failing e2e** `home.spec.ts`:
  - 8 bölüm id'si DOM'da var.
  - Nav'da "İŞLER" tıklanınca `#isler` görünür alana gelir (`toBeInViewport`).
  - `page.emulateMedia({ reducedMotion: 'reduce' })` ile her `section h2` görünür ve `opacity` 1 (Review Focus 1).
  - JS kapalı context'te (`javaScriptEnabled: false`) her `section h2` görünür.
- [ ] **Step 3:** `npm run test && npm run e2e` → FAIL.
- [ ] **Step 4:** Bileşenleri ve `motion.ts`'yi uygula. `Cursor` yalnızca `(pointer: fine)` iken aktif; `SectionDots` IntersectionObserver ile aktif bölümü turuncu yapar. Bölümler şimdilik başlık + boş kabuk.
- [ ] **Step 5:** Testler → PASS.
- [ ] **Step 6: Commit** `feat: ana sayfa kabuğu ve hareket altyapısı`

---

### Task 3: İçerik modeli ve yer tutucu içerik

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/works/{blof,plip,paraglider,ders-programi}.md`, `src/content/posts/merhaba-dunya.md`
- Create: `src/data/site.ts`, `src/data/skills.ts`, `src/data/journey.ts`, `src/data/archive.ts`
- Copy: `public/cv/Abdulbaki_Bacaci_CV_2026.pdf` (Masaüstü'nden), `public/img/placeholder-portrait.svg`
- Test: `src/data/data.test.ts`

**Interfaces:**
- Produces koleksiyon `works` şeması: `{ title: string; kind: string; summary: string; facts: string[]; tech: string[]; order: number; featured: boolean; cover?: string; links: { label: string; href: string }[] }`. Gövde: "Ne / Neden / Nasıl" başlıklı markdown.
- Produces koleksiyon `posts` şeması: `{ title: string; date: Date; summary: string; draft: boolean }`.
- Produces `site`: `{ name: 'Abdulbaki Bacacı'; short: 'BAKİ'; email: string; socials: { label: string; href: string }[]; cvPath: '/cv/Abdulbaki_Bacaci_CV_2026.pdf'; portrait: string }`.
- Produces `skills: string[][]` (her iç dizi bir marquee bandı), `journey: { year: string; title: string; text: string }[]`, `archive: { title: string; kind: string; href?: string }[]`.

- [ ] **Step 1: Failing test** `data.test.ts`: `journey` en az 3 durak ve yıllar artan sırada; `skills` en az 2 bant; `archive` içinde "Canavar" geçen kayıt yok.
- [ ] **Step 2:** `npm run test` → FAIL.
- [ ] **Step 3:** Dosyaları yaz. İçerik kaynakları: Blöf → `Blöf_Oyun` + eski `bakibacaci-site/index.html` metinleri; Ders Programı → `Projeler/ders-programi` + `Belgeler/Lise_Ders_Programi_Otomasyonu_Raporu.docx`; skills/journey → `Abdulbaki_Bacaci_CV_2026.pdf`. Plip/Paraglider için Unity projelerinden tek cümlelik gerçek açıklama; bilinmeyen alanlar (itch.io linki, ekran görüntüsü) boş bırakılır, uydurulmaz. Canavar dahil edilmez.
- [ ] **Step 4:** `npm run test && npx astro check` → PASS, 0 hata.
- [ ] **Step 5: Commit** `feat: içerik koleksiyonları ve yer tutucu içerik`

---

### Task 4: Giriş bölümü (3D küp + polaroid + açılış animasyonu)

**Files:**
- Create: `src/sections/Hero.astro`, `src/islands/HeroCube.svelte`, `src/components/Polaroid.astro`, `public/img/cube-fallback.svg`
- Modify: `src/pages/index.astro`
- Test: `e2e/hero.spec.ts`

**Interfaces:**
- Consumes: `site.portrait`, `Marquee`, `motion.ts`.
- Produces: `HeroCube` props `{ faces: [string,string,string,string,string,string] }` (varsayılan `['B','★','B','↗','','']`), `client:visible` ile yüklenir.

- [ ] **Step 1: Failing e2e** `hero.spec.ts`:
  - `h1` metni "KOD" ve "YAZARIM." içerir; `.polaroid` görünür.
  - Masaüstünde `canvas[data-cube]` görünür.
  - Reduced motion'da canvas yok, `img[data-cube-fallback]` var.
  - WebGL yok (`page.addInitScript` ile `HTMLCanvasElement.prototype.getContext = () => null`) → `img[data-cube-fallback]` görünür, sayfada konsol hatası yok.
- [ ] **Step 2:** `npm run e2e -- hero` → FAIL.
- [ ] **Step 3:** `HeroCube.svelte`: Three.js dinamik import, `BoxGeometry` + 6 `CanvasTexture` yüz (Unbounded ile çizilmiş harf), `EdgesGeometry` siyah çizgiler, pointer ile sürükle-döndür (atalet 0.92 sönümleme), boşta Y ekseninde 0.004 rad/kare dönüş, `devicePixelRatio` en fazla 2, görünmezken render döngüsü durur (IntersectionObserver). `getContext` başarısızsa veya reduced motion varsa fallback SVG.
- [ ] **Step 4:** Açılış animasyonu `Hero.astro` içindeki script'te: başlık harfleri `SplitText` benzeri span'lere JS ile bölünür, `y: 110%` → 0, stagger 0.04, `--ease-spring`; polaroid `x: 120vw, rotate: 25` → yerine; küp ölçek 0 → 1. Reduced motion'da atlanır.
- [ ] **Step 5:** `npm run e2e -- hero` → PASS.
- [ ] **Step 6: Commit** `feat: giriş bölümü, 3D küp ve polaroid`

---

### Task 5: İşler bölümü, proje detay sayfaları, turuncu perde geçişi

**Files:**
- Create: `src/sections/Works.astro`, `src/components/WorkCard.astro`, `src/components/ArchiveList.astro`, `src/pages/isler/[slug].astro`, `src/components/Curtain.astro`
- Modify: `src/layouts/BaseLayout.astro` (perde), `src/pages/index.astro`
- Test: `e2e/works.spec.ts`

**Interfaces:**
- Consumes: `works` koleksiyonu, `archive`.
- Produces: detay URL'si `/isler/{id}` (dosya adı = slug).

- [ ] **Step 1: Failing e2e:**
  - `#isler` içinde `order`'a göre sıralı 4 `WorkCard`, ilk kartın başlığı "Blöf".
  - Blöf kartına tıklayınca URL `/isler/blof`, `h1` "Blöf".
  - Detayda "Ne", "Neden", "Nasıl" başlıkları var; "← Tüm işler" linki ana sayfada `#isler`'e döner.
  - Arşiv listesi en az 1 satır ve "Canavar" metni sayfada yok.
- [ ] **Step 2:** FAIL doğrula.
- [ ] **Step 3:** Uygula. Perde: `astro:before-swap` / `astro:after-swap` olaylarında tam ekran `--accent` panel `translateX(-101%) → 0 → 101%`, toplam ≤ 700 ms; reduced motion'da yok. Kart girişi `reveal('.work-card', { rotate: -8, y: 80, stagger: .1 })`. Hover: `translate(-4px,-4px)` + gölge `12px 12px 0`.
- [ ] **Step 4:** PASS doğrula.
- [ ] **Step 5: Commit** `feat: işler bölümü, proje sayfaları, perde geçişi`

---

### Task 6: Halftone portre ve Hakkımda bölümü

**Files:**
- Create: `src/lib/halftone.ts`, `src/islands/Halftone.svelte`, `src/sections/About.astro`
- Test: `src/lib/halftone.test.ts`, `e2e/about.spec.ts`

**Interfaces:**
- Produces `src/lib/halftone.ts`:
  - `type Dot = { x: number; y: number; r: number }`
  - `computeDots(lum: Uint8ClampedArray, width: number, height: number, step: number): Dot[]`: `lum` tek kanallı parlaklık (0–255). Her `step` ızgara hücresinin merkezinde bir nokta; `r = (1 - lum/255) * step * 0.5` (koyu = büyük nokta); `r < 0.3` olanlar atılır.
  - `displace(dot: Dot, px: number, py: number, radius: number, strength: number): { x: number; y: number }`: imleç `radius` içindeyse noktayı dışa iter, dışındaysa aynen döner.
- Produces `Halftone` props `{ src: string; step?: number /* 10 */ }`.

- [ ] **Step 1: Failing tests:**
  - 4×4 tamamen siyah (`lum=0`) görüntü, `step=2` → 4 nokta, her biri `r === 1`.
  - Tamamen beyaz → 0 nokta.
  - `displace` imleç uzaktayken konumu değiştirmez; yarıçap içindeyken imleçten uzaklaşır (mesafe artar).
- [ ] **Step 2:** FAIL → **Step 3:** uygula → **Step 4:** PASS (`npm run test`).
- [ ] **Step 5:** `Halftone.svelte`: görüntüyü offscreen canvas'a çiz, gri tona çevir, `computeDots`; bölüme girişte noktalar rastgele konumdan hedefe 900 ms'de gelir; `pointermove` ile `displace`; renk `--accent`. Reduced motion'da statik çizim. `About.astro`: portre + metin paragrafları + sticker gerçekler.
- [ ] **Step 6: e2e:** `#hakkimda canvas` görünür ve `site.name` metni bölümde var. PASS doğrula.
- [ ] **Step 7: Commit** `feat: halftone portre ve hakkımda bölümü`

---

### Task 7: Yetenekler ve Yolculuk bölümleri

**Files:**
- Create: `src/sections/Skills.astro`, `src/sections/Journey.astro`
- Test: `e2e/journey.spec.ts`

**Interfaces:**
- Consumes: `skills`, `journey`, `Marquee`, `motion.ts`.

- [ ] **Step 1: Failing e2e:**
  - `#yetenekler` içinde `skills.length` kadar marquee bandı; tek bantlar ters yönde (`data-reverse`).
  - Masaüstünde `#yolculuk` scroll edilince son durak (`journey.at(-1).title`) görünür alana girer.
  - Mobilde ve reduced motion'da duraklar dikey liste; hepsi scroll ile görünür.
- [ ] **Step 2:** FAIL doğrula.
- [ ] **Step 3:** Uygula. Yolculuk: `(min-width: 900px)` ve hareket açıkken ScrollTrigger `pin: true`, `x: -(trackWidth - viewportWidth)`, `scrub: 1`. Aksi halde düz dikey liste. Marquee hover'da `animation-play-state` yavaşlatma (`animation-duration` ×3).
- [ ] **Step 4:** PASS doğrula.
- [ ] **Step 5: Commit** `feat: yetenekler ve yolculuk bölümleri`

---

### Task 8: İletişim, CV, Yazılar (blog)

**Files:**
- Create: `src/sections/Contact.astro`, `src/sections/Posts.astro`, `src/pages/yazilar/index.astro`, `src/pages/yazilar/[slug].astro`, `src/lib/confetti.ts`
- Test: `e2e/contact.spec.ts`, `e2e/posts.spec.ts`

**Interfaces:**
- Consumes: `site`, `posts` koleksiyonu (`draft: false` olanlar, tarihe göre azalan).
- Produces `confetti.ts`: `burst(originX: number, originY: number, count?: number /* 24 */): void`: DOM'a geçici sticker öğeleri ekler, 1.2 sn sonra kaldırır; reduced motion'da no-op.

- [ ] **Step 1: Failing e2e:**
  - `YAZ BANA` butonuna tıklanınca panoda `site.email` var (`context.grantPermissions(['clipboard-read','clipboard-write'])`) ve "kopyalandı" bildirimi görünür.
  - CV linki `href` = `site.cvPath`, `download` özniteliği var, istek 200 döner.
  - `#yazilar` en fazla 3 kart; `/yazilar` listesinde "merhaba-dunya"; yazıya tıklayınca `h1` başlığı.
- [ ] **Step 2:** FAIL → **Step 3:** uygula (buton `magnetic`: imleç 120 px içindeyken butonu imlece doğru en fazla 12 px çeker) → **Step 4:** PASS.
- [ ] **Step 5: Commit** `feat: iletişim, cv ve blog`

---

### Task 9: Terminal ve yılan oyunu mantığı

**Files:**
- Create: `src/lib/os/appIds.ts`, `src/lib/terminal.ts`, `src/lib/snake.ts`
- Test: `src/lib/terminal.test.ts`, `src/lib/snake.test.ts`

**Interfaces:**
- Produces `src/lib/os/appIds.ts`: `type AppId = 'yilan'|'terminal'|'plip'|'blof'|'duvar'|'hakkimda'|'cv'` (Task 10 ve 11 buradan import eder).
- Produces `terminal.ts`:
  - `type TermResult = { lines: string[]; action?: { type: 'clear' } | { type: 'open'; appId: AppId } }`
  - `runCommand(input: string): TermResult`: komutlar `help`, `whoami`, `projeler`, `cv` (→ `open cv`), `oyna` (→ `open yilan`), `clear` (→ `clear`), gizli: `sudo` ("güzel deneme."), `kahve` (ASCII fincan). Büyük/küçük harf ve baş/son boşluk duyarsız; bilinmeyen → `komut bulunamadı: <x>. 'help' yaz.`; boş girdi → `lines: []`.
- Produces `snake.ts`:
  - `type Dir = 'up'|'down'|'left'|'right'`; `type Pt = { x: number; y: number }`
  - `type SnakeState = { cols: number; rows: number; body: Pt[]; dir: Dir; queue: Dir[]; food: Pt; score: number; status: 'playing'|'over' }`
  - `createGame(cols: number, rows: number, rng?: () => number): SnakeState`: 3 uzunlukta, sağa bakan, ortada.
  - `turn(s: SnakeState, d: Dir): SnakeState`: kuyruğa ekler (en fazla 2); son kuyruk yönünün (yoksa `dir`'in) tersi ise yok sayar.
  - `step(s: SnakeState, rng?: () => number): SnakeState`: kuyruktan bir yön alır, ilerler; duvar veya kendine çarpma → `over`; yem → büyür, `score += 1`, yeni yem boş hücreye.

- [ ] **Step 1: Failing tests (terminal):** `runCommand('  HELP ')` satırlarında `whoami` geçer; `runCommand('cv').action` = `{type:'open',appId:'cv'}`; `runCommand('xyz').lines[0]` = `komut bulunamadı: xyz. 'help' yaz.`; `runCommand('').lines` = `[]`.
- [ ] **Step 2: Failing tests (snake):**
  - Sağa giderken `turn('left')` yok sayılır.
  - Sağa giderken aynı tick içinde `turn('up')` sonra `turn('left')` → iki `step` sonunda baş yukarı sonra sola gitmiştir, `status` `playing` (Review Focus 4).
  - Duvara giden `step` → `over`.
  - Yem başın önündeyken `step` → `score` 1, `body.length` 4, yeni yem gövdede değil.
- [ ] **Step 3:** `npm run test` → FAIL → **Step 4:** uygula → **Step 5:** PASS.
- [ ] **Step 6: Commit** `feat: terminal ve yılan oyun mantığı`

---

### Task 10: BAKİ OS (`/oyun`) ve Oyun Alanı giriş kartı

**Files:**
- Create: `src/lib/os/windowManager.ts`, `src/lib/os/apps.ts`
- Create: `src/islands/os/{Desktop,Window,Taskbar,MobileHome}.svelte`
- Create: `src/islands/os/apps/{Snake,Terminal,Plip,Blof,Notes,Cv}.svelte`
- Create: `src/pages/oyun.astro`, `src/sections/PlayCard.astro`
- Test: `src/lib/os/windowManager.test.ts`, `e2e/os.spec.ts`

**Interfaces:**
- Consumes: `terminal.ts`, `snake.ts`, `site`, `works` (Plip/Blöf linkleri).
- Produces `apps.ts`: (`AppId` Task 9'daki `appIds.ts`'ten) `type AppDef = { id: AppId; title: string; icon: string; width: number; height: number; load: () => Promise<{ default: Component }> }`; `APPS: AppDef[]` (Task 11 `duvar`'ı buraya bir satırla ekler; bu task'ta `duvar` tanımlı değilse simgesi gösterilmez).
- Produces `windowManager.ts` (saf, değişmez durum):
  - `type Win = { id: string; appId: AppId; x: number; y: number; w: number; h: number; z: number; minimized: boolean }`
  - `type OsState = { windows: Win[]; nextZ: number; viewport: { w: number; h: number } }`
  - `createOs(viewport): OsState`
  - `openApp(s, app: AppDef): OsState`: uygulama zaten açıksa odaklar ve küçültmeyi kaldırır; değilse ekranın ortasına +24 px kademeli yeni pencere.
  - `closeWindow(s, id)`, `focusWindow(s, id)` (en yüksek z), `minimizeWindow(s, id)`
  - `moveWindow(s, id, x, y)`: clamp → başlık çubuğunun (üst 32 px) en az 64 px'i görünür alanda kalır.
  - `resizeViewport(s, viewport)`: tüm pencereleri yeniden clamp eder.
  - `topWindow(s): Win | undefined`: küçültülmemiş en yüksek z.

- [ ] **Step 1: Failing unit tests:**
  - Aynı uygulamayı iki kez `openApp` → tek pencere, ikinci çağrıdan sonra en üstte.
  - `focusWindow` sonrası o pencerenin `z`'si en yüksek.
  - `moveWindow(s, id, -5000, -5000)` → `y >= 0` ve `x + w >= 64` (Review Focus 3).
  - `resizeViewport` 1400×900 → 400×700 sonrası tüm pencereler clamp kurallarına uyar.
  - `minimizeWindow` sonrası `topWindow` diğer pencereyi döner.
- [ ] **Step 2:** FAIL → **Step 3:** uygula → **Step 4:** PASS.
- [ ] **Step 5: Failing e2e** `os.spec.ts`:
  - Masaüstü: `/oyun`'da `terminal` simgesine çift tıkla → pencere açılır; `help` yaz + Enter → çıktıda `whoami`; `oyna` → `yilan` penceresi açılır; başlık çubuğunu sürükle → konum değişir; ✕ → kapanır; görev çubuğunda sayısı güncellenir.
  - Mobil: uygulama ızgarası görünür, `yilan`'a dokun → tam ekran açılır, geri butonu ızgaraya döner.
  - Ana sayfa `#oyun-alani` kartı tıklanınca `/oyun`'a gider.
- [ ] **Step 6:** Uygula. `Desktop.svelte` durumu `$state` içinde tutar, `windowManager` fonksiyonlarını çağırır; sürükleme pointer events + `setPointerCapture`; klavye: pencere başlığı odaklanabilir, `Esc` kapatır. Uygulama bileşenleri `AppDef.load()` ile tembel yüklenir. Yılan: 20×20 ızgara, 120 ms tick, yön tuşları + WASD + mobilde kaydırma; rekor `localStorage['yilan-rekor']` (try/catch). `Plip`: `iframe` itch.io embed (link `works/plip.md`'den; boşsa "yakında" sticker'ı). `PlayCard.astro`: tıklamada 900 ms "BAKİ OS yükleniyor…" tarama animasyonu, sonra `/oyun`; reduced motion'da doğrudan geçiş. `(max-width: 767px)` → `MobileHome`.
- [ ] **Step 7:** `npm run test && npm run e2e -- os` → PASS.
- [ ] **Step 8: Commit** `feat: BAKİ OS masaüstü ve uygulamalar`

---

### Task 11: Ziyaretçi Duvarı (Firebase)

**Files:**
- Create: `src/lib/guestbook/validate.ts`, `src/lib/guestbook/client.ts`, `src/islands/os/apps/Guestbook.svelte`
- Create: `firestore.rules`, `firebase.json`, `.firebaserc`, `.env.example`
- Modify: `src/lib/os/apps.ts` (`duvar` kaydı)
- Test: `src/lib/guestbook/validate.test.ts`, `tests/rules/firestore.rules.test.ts`, `e2e/guestbook.spec.ts`

**Interfaces:**
- Produces `validate.ts`:
  - `STICKERS = ['yildiz','kalp','simsek','gulen'] as const`, `COLORS = ['accent','ink','white'] as const`, `MAX_LEN = 80`, `MIN_INTERVAL_MS = 30_000`
  - `type NoteInput = { text: string; sticker: string; color: string; x: number; y: number }`
  - `validateNote(n: NoteInput): { ok: true; note: NoteInput } | { ok: false; error: 'bos'|'uzun'|'kufur'|'gecersiz' }`: metni trim'ler; uzunluk `Intl.Segmenter` grapheme sayısı; `x`,`y` 0–1 aralığında.
  - `containsProfanity(text: string): boolean`: küçük Türkçe liste, `toLocaleLowerCase('tr')` ve basit harf değişimi (`1→i`, `0→o`, `@→a`) normalizasyonu.
  - `canPost(lastPostAt: number | null, now: number): boolean`
- Produces `client.ts`: `getGuestbook(): Promise<{ list(limit?: number): Promise<Note[]>; add(n: NoteInput): Promise<void> } | null>`: `PUBLIC_FIREBASE_*` env yoksa veya init başarısızsa `null`. Firebase dinamik import. App Check (reCAPTCHA v3, `PUBLIC_RECAPTCHA_KEY`).
- Firestore: koleksiyon `notes`, alanlar `{ text, sticker, color, x, y, createdAt }`; herkes okur, sadece create; update/delete yok.

- [ ] **Step 1: Failing unit tests** `validate.test.ts`:
  - `'   '` → `bos`; 81 × `'a'` → `uzun`; 80 × `'👍'` → ok (grapheme); 81 × `'👍'` → `uzun` (Review Focus 2).
  - Geçersiz sticker/renk veya `x: 1.5` → `gecersiz`.
  - Listedeki bir kelimenin büyük harfli / `1`'li varyantı → `kufur`.
  - `canPost(now - 10_000, now)` false, `canPost(now - 31_000, now)` true, `canPost(null, now)` true.
- [ ] **Step 2:** FAIL → **Step 3:** uygula → **Step 4:** PASS.
- [ ] **Step 5: Failing rules tests** (`@firebase/rules-unit-testing`, `firebase emulators:exec --only firestore "vitest run tests/rules"`): geçerli not create → izin; `text` 81 karakter → red; ek alan (`admin: true`) → red; `createdAt != request.time` → red; update/delete → red; read → izin. **Java yoksa** bu adımı atla ve kullanıcıya bildir; kurallar yine yazılır.
- [ ] **Step 6:** `firestore.rules` yaz, testler PASS.
- [ ] **Step 7: Failing e2e** `guestbook.spec.ts`:
  - Firebase env olmadan build → `duvar` penceresinde "şu an kapalı" sticker'ı, diğer pencereler açılabiliyor (Review Focus 5).
  - `client.ts` `window.__guestbookMock` varsa onu kullanır (sadece `import.meta.env.DEV || MODE==='test'`); mock ile `<script>alert(1)</script>` gönderilince duvarda düz metin olarak görünür, `alert` tetiklenmez.
- [ ] **Step 8:** `Guestbook.svelte`: duvar üzerinde notlar `{x,y}` konumlu sticker'lar, `textContent` ile render; form: metin (sayaç `n/80`), sticker ve renk seçimi, duvara tıklayarak konum; hata kodlarının Türkçe mesajları; son gönderim `localStorage['duvar-son']`. `apps.ts`'ye `duvar` eklenir.
- [ ] **Step 9:** Testler PASS.
- [ ] **Step 10: Commit** `feat: ziyaretçi duvarı ve firestore kuralları`

---

### Task 12: Performans, erişilebilirlik ve yayına hazırlık

**Files:**
- Modify: gerekli bileşenler
- Create: `e2e/a11y.spec.ts`, `README.md`
- Modify: `firebase.json` (hosting `public: dist`, cache başlıkları)

- [ ] **Step 1: Failing e2e** `a11y.spec.ts` (`@axe-core/playwright`): `/`, `/isler/blof`, `/yazilar`, `/oyun` için `serious`/`critical` ihlal 0. Klavye: Tab ile nav → "İŞLER" → Enter → `#isler` odakta.
- [ ] **Step 2:** İhlalleri düzelt → PASS.
- [ ] **Step 3:** `npm run build` sonrası `dist/_astro` ilk sayfa JS'ini ölç (Three.js chunk hariç, gzip). Expected: < 150 KB. Aşarsa önce halftone yoğunluğunu ve marquee sayısını kıs (spec §10).
- [ ] **Step 4:** `npx lighthouse http://localhost:4321 --preset=perf --form-factor=mobile --only-categories=performance,accessibility --quiet --chrome-flags="--headless"`. Expected: performans ≥ 85, erişilebilirlik ≥ 95.
- [ ] **Step 5:** `README.md`: içerik nasıl güncellenir (works/posts/data dosyaları, fotoğrafı `public/img/portrait.jpg` olarak koyma), `.env` alanları, `firebase deploy` komutu. **Deploy'u çalıştırma**, bu kullanıcının Firebase hesabıyla yapacağı bir adım.
- [ ] **Step 6:** Tüm testler: `npm run test && npm run e2e` → PASS.
- [ ] **Step 7: Commit** `chore: performans, erişilebilirlik, yayın hazırlığı`
