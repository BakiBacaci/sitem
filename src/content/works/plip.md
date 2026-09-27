---
title: Plip
kind: Slime fiziği bulmaca oyunu
summary: Evine dönmeye çalışan yapışkan bir slime. Tut, ger, bırak, fırlat.
facts:
  - Slime yüzlerce parçacıktan oluşan gerçek bir yapışkan sıvı olarak hesaplanıyor
  - 3B hacimli jöle görünümü için özel shader'lar
  - itch.io'da yayında, Türkçe ve İngilizce
tech: [Unity, C#, HLSL]
order: 2
featured: true
cover: /img/works/plip-cover.png
shots: [/img/works/plip-1.png, /img/works/plip-2.png]
links:
  - { label: itch.io, href: 'https://bakibacaci.itch.io/plip' }
---

## Ne

Şıp: Eve Dönüş (uluslararası adıyla Plip), evine dönmeye çalışan yapışkan bir slime'ın fizik bulmaca oyunu. Şıp'ı tutup çekiyorsun, geriliyor, bırakınca fırlıyor. Nereye düşerse oraya yapışıyor.

## Neden

Bulmacanın kendisi slime'ın fiziği olsun istedim: her bölümdeki çözüm, sıvının gerçekten nasıl davrandığından çıkıyor.

## Nasıl

- Slime fiziği Unity'den bağımsız bir çekirdekte: esniyor, sünüyor, kopuyor, birleşiyor ve yüzeylere tutunuyor.
- Slime'ın yüzeyi, arayüzdeki jöle düğmeler ve sahne için ayrı shader'lar yazdım.
- Bölümleri komut satırından test eden bir araç ve bölüm çözücüsü var.
