---
title: Ders Programı Otomasyonu
kind: Masaüstü uygulama + veritabanı
summary: Bir lisenin öğretmen, öğrenci ve haftalık ders programını yöneten Windows uygulaması.
facts:
  - Katmanlı mimari (Models, Repositories, Services, UI)
  - SQL Server ve Dapper ile veri erişimi
  - Sistem analizi ve tasarımı raporuyla birlikte
tech: [C#, .NET, Windows Forms, SQL Server, Dapper]
order: 5
featured: true
links: []
---

## Ne

Bir lisenin öğretmen, öğrenci ve ders programı bilgilerini tutan, giriş ekranlı bir Windows masaüstü uygulaması.

## Neden

Sistem Analizi ve Tasarımı dersinin projesi. Amacım analizden tasarıma, veritabanından arayüze kadar bütün süreci tek başıma yürütmekti.

## Nasıl

- Katmanlı yapı: `Models`, `Repositories`, `Services` ve `UI` ayrı; formlar veritabanına doğrudan dokunmuyor.
- SQL Server bağlantısı Dapper ile; veritabanı ilk açılışta şemasıyla ve örnek verisiyle kuruluyor.
- Giriş, öğretmen, öğrenci ve ders programı düzenleme ekranları.
