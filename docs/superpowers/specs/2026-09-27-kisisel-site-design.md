# Kişisel Site — Tasarım Dokümanı

**Tarih:** 2026-09-27
**Sahibi:** Abdulbaki (Baki) Bacacı
**Durum:** Taslak, kullanıcı onayı bekliyor

## 1. Amaç

Hem portfolyo (iş/müşteri bulmak) hem kişisel marka hem de deneysel oyun alanı olan, "gören şaşırsın" dedirten, bol animasyonlu tek bir kişisel site.

**Başarı ölçütleri**
- Bir işveren 10 saniye içinde kim olduğunu, ne yaptığını ve projelerini bulabilmeli.
- Meraklı bir ziyaretçi Oyun Alanı'nda dakikalarca oyalanabilmeli.
- Tasarım gösterişli ama ciddi durmalı: **iddialar sade ve doğru, gösteriş tasarımda.**
- Telefonda da akıcı çalışmalı.

**Kapsam dışı (v1):** İngilizce sürüm (EN CV mevcut, ikinci aşamada eklenecek), CMS/admin paneli, analitik panosu.

## 2. Görsel Kimlik — "Kağıt Brutal"

Brainstorm'da seçilen yön: D3 (Kağıt Brutal) + turuncu vurgu.

| Token | Değer | Kullanım |
|---|---|---|
| `--paper` | `#f4f4f0` | Zemin |
| `--ink` | `#0b0b0b` | Yazı, çerçeve, gölge |
| `--accent` | `#ff5a1f` | İmza rengi: vurgu, butonlar, imleç, hover |
| `--white` | `#ffffff` | Kart içleri |

- **Yazı tipleri:** Başlıklar *Unbounded* (800–900, büyük harf), gövde ve etiketler *JetBrains Mono*.
- **Dil:** Kalın 3px siyah çerçeveler, sert (bulanıksız) ofset gölgeler (`8px 8px 0 ink`), hafif eğik sticker'lar, fosforlu kalem gibi turuncu vurgular, kayan yazı bantları (marquee).
- **Hareket karakteri:** Yaylanan (overshoot) easing, sert ve oyuncu. Yumuşak ve süzülen değil, "zıplayan" hareketler.
- **Karanlık mod:** Yok. Kağıt teması kimliğin parçası. Oyun Alanı masaüstü kendi içinde koyu bir duvar kağıdı kullanabilir.

## 3. Bilgi Mimarisi

Ana site **tek uzun sayfa**. Oyun Alanı bu sayfanın içinden açılan **tam ekran bir masaüstü işletim sistemi**. Blog ve proje detayları ayrı sayfalar.

```
/                  Tek uzun ana sayfa
  1 Giriş
  2 İşler
  3 Hakkımda
  4 Yetenekler
  5 Yolculuk
  6 Oyun Alanı (giriş kartı → /oyun)
  7 Yazılar (son 3 yazı → /yazilar)
  8 İletişim (+ CV indir)
/isler/[slug]      Proje detay sayfası
/yazilar           Blog listesi
/yazilar/[slug]    Blog yazısı
/oyun              Masaüstü işletim sistemi (Oyun Alanı + Ziyaretçi Duvarı)
```

Sayfa geçişleri: ekranı soldan sağa süpüren **turuncu perde** (View Transitions API, desteklemeyen tarayıcıda anında geçiş).

Üst menü: solda `BAKİ ®`, sağda `İŞLER / BEN / OYUN / YAZ`. Ana sayfada bölümlere kaydırır, diğer sayfalarda ana sayfaya döner. Sağ kenarda hangi bölümde olunduğunu gösteren nokta göstergesi.

## 4. Bölümler

### 4.1 Giriş
- Ortada fareyle sürüklenip çevrilebilen, kendi kendine yavaşça dönen **tıknaz 3D küp logo** (Three.js). Yüzlerinde `B`, `★`, `↗`. Turuncu, beyaz ve siyah yüzler, siyah kenar çizgileri.
- Yanında eğik yapıştırılmış **polaroid fotoğraf**: üzerine gelince yaylanarak zıplıyor, köşesi kalkıyor, altında el yazısı gibi "bu benim →".
- Dönen rozet: "MERHABA ★".
- Dev başlık (ör. `KOD` / `YAZARIM.`, ikinci satır turuncu vurgulu) ve alt bantta kayan yazı: `★ MÜSAİT ★ PROJE ALIYORUM ★ OYUN YAPIYORUM ★`.
- **Açılış animasyonu:** Harfler aşağıdan tek tek zıplayarak gelir, küp ölçek 0'dan büyüyerek yerine oturur, polaroid ekranın dışından "yapıştırılır".

### 4.2 İşler
Öne çıkan 4 proje büyük sticker kartlarda. Scroll ile kartlar sırayla eğik gelip yerine oturur. Hover'da kart kalkar, gölgesi büyür, kapak görseli oynar.

| Proje | Tür | Öne çıkan gerçek bilgi | Bağlantı |
|---|---|---|---|
| **Blöf** | Çok oyunculu parti oyunu | Expo ile tek kod tabanı (web + mobil), Firebase ile gerçek zamanlı | Oyna → |
| **Plip** | Unity slime oyunu | itch.io'da yayında | itch.io → |
| **Paraglider Flyer** | Unity yamaç paraşütü uçuş oyunu | (içerik sonra doldurulacak) | — |
| **Lise Ders Programı Otomasyonu** | C# masaüstü + veritabanı | Katmanlı mimari (Models / Repositories / Services), sistem analizi raporu | Rapor / kod → |

Altında **Arşiv** listesi: tek satırlık, hover'da küçük önizleme gösteren kayıtlar (Night Shift, Avukat Oyunu, Suspect Game, Yemek AR vb.; kesin liste sonra).

Her kartın bir `/isler/[slug]` detay sayfası var: kapak, "ne / neden / nasıl", kullanılan teknolojiler, ekran görüntüleri, bağlantılar.

> Canavar İşe Giriyor **yayınlanmayacak.**

### 4.3 Hakkımda
- Büyük **gazete baskısı (halftone) portre**: Fotoğraf turuncu noktalara dönüşür (canvas). Bölüme girince noktalar dağınık gelir ve yerine oturur, sonra fareye yaklaşınca itilir.
- Yanında 3-4 kısa paragraf ve birkaç "sticker gerçek" (ör. `📍 şehir`, `🎓 okul/bölüm`, `🎮 oyun yapıyor`). Metinler mevcut siteden ve CV'den derlenecek.

### 4.4 Yetenekler
Birbirine zıt yönde kayan 2-3 sticker bandı (Unity, C#, React, Expo, Firebase, Flutter, SQL…). Hover'da bant yavaşlar, üzerine gelinen sticker büyür. Liste CV'den alınacak.

### 4.5 Yolculuk
Yatay bir zaman çizelgesi. Dikey scroll, yatay harekete çevrilir (pinned scroll). Her durak bir sticker kart (okul, ilk proje, Blöf yayını, itch.io yayını…). Tarihler CV'den alınacak.

### 4.6 Oyun Alanı (giriş kartı)
Ana sayfada monitör çerçevesi içinde büyük bir kart: "OYUN ALANINA GİR →". Tıklayınca kısa bir "bilgisayar açılışı" animasyonu (tarama çizgisi, `BAKİ OS yükleniyor…`) oynar ve `/oyun`'a gidilir.

### 4.7 Yazılar
Son 3 yazının kartı ve "Tümü →". Yazılar Markdown dosyası olarak repoda tutulur. Başlangıçta 1 örnek yazı olur.

### 4.8 İletişim
Ekranı kaplayan dev `YAZ BANA` butonu (manyetik: imleci hafifçe çeker). Tıklayınca e-posta adresi panoya kopyalanır ve konfeti gibi turuncu sticker'lar patlar. Altında GitHub, LinkedIn, itch.io, Instagram bağlantıları ve **CV İndir** butonu (`Abdulbaki_Bacaci_CV_2026.pdf`).

## 5. Oyun Alanı — "BAKİ OS" (`/oyun`)

Kağıt Brutal stilinde bir masaüstü işletim sistemi.

- **Masaüstü:** Noktalı zemin, solda simgeler, altta görev çubuğu (`★ BAKİ` başlat menüsü, açık pencereler, saat).
- **Pencereler:** Sürüklenebilir, öne getirilebilir, küçültülebilir, kapatılabilir. Turuncu başlık çubuğu, kalın çerçeve, sert gölge. Pencere durumları için tek bir durum yöneticisi.
- **Uygulamalar (v1):**
  1. `yilan.exe`: Kağıt Brutal stilinde klasik yılan oyunu, en yüksek skor tarayıcıda saklanır.
  2. `plip.exe`: Plip'in itch.io sayfası/embed'i.
  3. `blof.exe`: Blöf'e bağlantı / önizleme.
  4. `duvar.exe`: **Ziyaretçi Duvarı** (bkz. §6).
  5. `terminal.exe`: Sahte terminal. `help`, `whoami`, `projeler`, `cv` gibi komutlar ve birkaç gizli sürpriz komut.
  6. `hakkimda.txt`: Kısa not defteri penceresi.
  7. `cv.pdf`: CV'yi pencerede açar.
- **Telefonda:** Masaüstü yerine telefon ana ekranı gibi bir uygulama ızgarası gösterilir, her uygulama tam ekran açılır.
- "Yeni uygulama eklemek" tek bir dosya ve kayıt listesine bir satır eklemek kadar kolay olmalı.

## 6. Ziyaretçi Duvarı

Ziyaretçiler duvara kısa bir not (en fazla 80 karakter) ve bir sticker şekli/rengi seçip "yapıştırır". Notlar herkese görünür.

- **Arka uç:** Firebase (Blöf'ten tanıdık). Firestore'da `notes` koleksiyonu: `{ text, sticker, color, x, y, createdAt }`.
- **Kötüye kullanım koruması:** Güvenlik kurallarıyla alan doğrulama (uzunluk, izinli değerler), Firebase App Check, basit küfür filtresi, istemci tarafında sıklık sınırı. Silme yetkisi yalnızca sahibinde (Firebase konsolundan).
- Firebase erişilemezse duvar "şu an kapalı" sticker'ı gösterir, sitenin geri kalanı etkilenmez.

## 7. Teknik Mimari

| Katman | Seçim | Neden |
|---|---|---|
| Çatı | **Astro** (statik çıktı) | İçerik sitesi için en hızlı seçenek. Sadece gereken yerde JS yükler (islands), Markdown blog yerleşik geliyor, View Transitions desteği var. |
| Etkileşimli adalar | **Svelte** | Küçük paket boyutu. BAKİ OS pencere yöneticisi ve duvar için ideal. |
| 3D | **Three.js** | Giriş küpü. Sadece girişte, tembel yüklenir. |
| Animasyon | **GSAP + ScrollTrigger**, **Lenis** | Scroll'a bağlı sahneler, pinned yatay zaman çizelgesi, yumuşak kaydırma. |
| Halftone / parçacık | Saf Canvas 2D | Kütüphane gerektirmiyor. |
| Veri | Firebase Firestore (sadece duvar) | Tanıdık, ücretsiz katman yeterli. |
| Barındırma | **Firebase Hosting** | Duvarla aynı projede, ücretsiz, özel alan adı destekli. |

**Klasör yapısı (özet)**
```
src/
  styles/tokens.css          Renk, yazı, gölge token'ları
  components/                Sticker, Button, Marquee, Nav, Cursor…
  sections/                  Hero, Works, About, Skills, Journey, PlayCard, Posts, Contact
  islands/
    HeroCube (three)         Giriş küpü
    Halftone (canvas)        Hakkımda portresi
    os/                      BAKİ OS: WindowManager, Taskbar, apps/*
    guestbook/               Duvar arayüzü + firebase istemcisi
  content/
    works/*.md               Proje verileri (slug, başlık, tür, bilgiler, bağlantılar, görseller)
    posts/*.md               Blog yazıları
  pages/                     index, isler/[slug], yazilar/*, oyun
public/                      Fotoğraf, CV, proje görselleri
```

İçerik (projeler, yazılar, yolculuk durakları, yetenekler) **kodun içine gömülmez**. `src/content/` altında veri dosyası olarak durur, "sonra düzeltiriz" kısımları kod değiştirmeden güncellenebilir.

## 8. Performans ve Erişilebilirlik

- **`prefers-reduced-motion`:** Tüm büyük animasyonlar kapanır ya da sade bir geçişe iner. 3D küp statik görsele düşer.
- **Aşamalı yükleme:** Three.js yalnızca girişte, BAKİ OS yalnızca `/oyun`'da, Firebase yalnızca duvar açılınca yüklenir.
- **WebGL desteklenmezse:** Küpün yerine statik SVG görünür.
- **Hedefler:** Mobil Lighthouse performansı ≥ 85, erişilebilirlik ≥ 95. İlk yükleme JS'i < 150 KB (gzip, Three.js hariç).
- Klavye ile gezilebilir menü ve pencereler, görünür odak halkası (turuncu), görseller için alt metin. Özel imleç sadece fare olan cihazlarda.

## 9. Test ve Doğrulama

- **Birim testleri (Vitest):** Pencere yöneticisi durum mantığı, yılan oyun mantığı, duvar not doğrulama/küfür filtresi, terminal komut ayrıştırıcı.
- **Firestore güvenlik kuralları:** Firebase emülatörüyle kural testleri.
- **Uçtan uca (Playwright):** Ana sayfa yüklenir, menü bölümlere kaydırır, proje detayına geçiş çalışır, `/oyun`'da pencere aç-sürükle-kapat, telefon görünümünde uygulama ızgarası.
- **Manuel:** Lighthouse (mobil), reduced-motion açıkken tur, Chrome/Firefox/Safari (iOS) kontrolü.

## 10. Riskler

- **ASCII olmayan yol:** Proje `Masaüstü` altında. Vite/Astro genelde sorun çıkarmaz, ama çıkarırsa projeyi ASCII bir yola (ör. `C:\dev\sitem`) taşımak ilk çözüm olur.
- **Animasyon yükü telefonda:** Her bölümün hareketi reduced/mobil modda sadeleştirilecek. Performans bütçesi aşılırsa ilk kısılacak şey halftone yoğunluğu ve marquee sayısı.
- **Duvarda spam:** App Check + kurallar + filtre. Gerekirse notlar onaydan sonra görünür hale getirilir.

## 11. Sonradan Doldurulacak İçerik

Bunlar tasarımı değil içeriği etkiliyor. Veri dosyalarında yer tutucu olarak başlanacak:
- Giriş fotoğrafı (yüzü net, düz arka planlı tercih edilir)
- Paraglider ve Plip açıklamaları, ekran görüntüleri, itch.io bağlantısı
- Arşiv projelerinin kesin listesi
- Hakkımda metni, Yolculuk durakları, Yetenekler listesi (CV ve mevcut siteden taslak çıkarılacak)
- Sosyal medya bağlantıları, alan adı
- İlk blog yazısı

## 12. Uygulama Sırası (üst düzey)

1. İskelet: Astro + token'lar + temel bileşenler + tek sayfa bölüm kabukları
2. Giriş (küp + polaroid + açılış animasyonu)
3. İşler + proje detay sayfaları + perde geçişi
4. Hakkımda (halftone), Yetenekler, Yolculuk
5. İletişim + CV + Yazılar (blog)
6. BAKİ OS + uygulamalar
7. Ziyaretçi Duvarı + Firebase
8. Performans, erişilebilirlik, testler, yayına alma
