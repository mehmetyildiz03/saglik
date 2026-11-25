# İlerleme kaydı
2026-11-26 — P0: yol haritası ve araştırma/kabul kayıtları oluşturuldu.
- Başlangıç main: f881f4bf2762d0ab8b0cf139affb6ad32a181f01 (v0.13.0). Başarılı CI/Pages: https://github.com/mehmetyildiz03/saglik/actions/runs/45718075785
- Başlangıç kodu: trend-view.js (grafik noktaları, ortak referans bandı, tarih seçici); lab-view.js (iki tarih karşılaştırması); mevcut atlas ve kasa.
- Açık boşluklar: gelişmiş istatistik, yüzde fark, gerçek tablo, son ölçüm vurgusu, küçük çoklu sistem grafikleri, olay katmanı, gerçek rapor kabulü ve kapsamlı erişilebilirlik/performance ölçümü.
- P1 sırada: tek tahlil analiz istasyonunun ilk dikey dilimi. P0 belgelerinin ve aday CI değişikliğinin yayın koşusu ayrıca doğrulanacak.

2026-11-26 — P1 ilk dilim, v0.14.0 aday dalı development/p1-graphs.
- Dönem istatistikleri, seçili tarihe göre mutlak/yüzde fark, son/seçili işaretler, gerçek tarih ölçeği, geniş SVG, ortak referans bandı kontrolü ve tüm kayıt tablosu eklendi.
- Eksik lab/yöntem uyarısı, taşan farkın reddi ve tek kesin tarih kuralı. Kasa şeması ve kaynak klinik eşikler değişmedi.
- Aday CI ve görsel kabul **bekliyor**. Başarılı olmadan main'e aktarılmayacak. P1'in geniş erişilebilirlik ve performans denetimi henüz açık.

2026-11-26 — P1 ilk aday doğrulaması: f5352402aa3fef83427e65d7594f2024e5128a74, 66/66 birim + tarayıcı testi başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45720178873). Aday dağıtımı atlandı. Görsel incelemede yüzde farkının gereksiz basamakları ve tema geçişinde geçmiş satırı kontrastı tespit edildi; yüzde sunumu ve anlık koyu tema kontrastı düzeltildi, yeni CI zorunlu. 
- Günlük planlı geliştirme görevi oluşturuldu; 27 Kasım 2026'dan itibaren yaklaşık 09:00 (Europe/Istanbul), her çalışmada aday testleri, ilerleme kaydı ve doğrulanmış yayın. Görev erişim ve çalışma sınırlarına tabidir; takvim hedefleri garanti değildir.
