---
title: Blöf
kind: Çok oyunculu parti oyunu
summary: 3-8 kişinin kendi telefonundan aynı odaya girip oynadığı gerçek zamanlı parti oyunu.
facts:
  - Tek kod tabanından iOS, Android ve web
  - Firebase ile gerçek zamanlı lobi ve tur senkronizasyonu
  - Dört oyun modu, 275 soruluk Türkçe içerik
tech: [Expo, React Native, TypeScript, Firebase]
order: 1
featured: true
links:
  - { label: Oyna, href: 'https://blof-64f01.web.app' }
  - { label: Kod, href: 'https://github.com/BakiBacaci/blof-oyun' }
---

## Ne

Arkadaşlarınla aynı odada ya da uzaktan oynadığın bir blöf ve tahmin oyunu. Web sürümü davet linki gibi çalışıyor: linki açan kişi hiçbir şey indirmeden odaya katılıyor.

## Neden

Parti oyunlarında herkesin aynı uygulamayı indirmesi en büyük engel. Blöf'ü telefonda da tarayıcıda da aynı şekilde çalışacak biçimde tasarladım.

## Nasıl

- Expo (React Native) ile tek kod tabanı; aynı kod iOS, Android ve web'e çıkıyor.
- Firebase Realtime Database üzerinde canlı lobi, anonim giriş, kod ya da link ile katılma, çevrimdışı oyuncu takibi ve tur durumu senkronizasyonu.
- Dört oyun modu (Yalan Avcısı, Kral, Buluşma, Mezat) yazma, oylama, açıklama ve puanlama turlarıyla uçtan uca çalışıyor.
- 275 soruluk, altı kategorili Türkçe içerik havuzu. Arayüz, tipografi ve oyun içi metinler bana ait.
