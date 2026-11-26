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

2026-11-26 — Plan denetimi ve P1 yayına kabul: 22e7ac917690b767f89b034891c1fb801fdc4320 için 67/67 birim testi, üretim derlemesi ve Chromium kabulü başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45720503614); aday Pages adımı doğru biçimde atlandı. Aday main'in iki commit ilerisindeydi, geri kalmış commit yoktu; beklenen SHA ile main'e fast-forward yapıldı. Main Pages sonucu ayrıca bekliyor. P1 ilk dilimi kabul edildi; kapsamlı erişilebilirlik, performans ve gerçek hasta raporu kabulü açık. Yol haritasından gün kısıtları kaldırıldı; kritik veri doğruluğu/güvenlik sorunları her fazda öncelikli. P2 ilk dilim: üç tarihli karşılaştırma, kayıt bazlı referanslar ve doğrudan hücreden kayda geçiş. Saatlik otomasyon güncellemesi ayrı görev kaydıyla doğrulanacak.

2026-11-26 — P2 ilk dilim, development/p2-comparison (v0.15.0): son 2/3 tarih kısayolları, özgür tarih seçimi, lab/yöntem filtresi, her hücrede rapor referansı ve ayrı kayda tıklama. Saf karşılaştırma modeli profil ayrımını kendi sınırında da uygular. Çoklu/nitel/sınırlı/eksik sonuçlarda Δ yok; değerler kaybolmaz. Aday CI bekliyor; main'e alınmadı. Kapsamlı performans/WCAG ve gerçek rapor kabulü açık.

2026-11-26 — Manuel devam: otomasyon kapalı olduğu doğrulandı ve kullanıcı isteğiyle açık bırakılmadı. P2 aday 2906be4fab1187537457a73b0310b3ff0a383305, 72/72 birim ve Chromium kabulü başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45721245105). Üç tarihli masaüstü ve mobil ekran görüntüleri incelendi; mobil filtreler açıkken ilk sonuç aşağıda kalıyor, ileride yoğunluk iyileştirilebilir. Main'e beklenen SHA ile fast-forward yapıldı, Pages sonucu ayrı doğrulanacak.
- P3 v0.16.0 aday: sistem grafik sekmesi, ortak tarih ekseni, ayrı değer eksenleri/birimler, ortak tarih odağı, 12 grafik/sayfa, tarih/dönem/filtre ve kayıt erişimi. Aday CI bekliyor; main'e alınmadı. Gerçek rapor, performans ve kapsamlı erişilebilirlik kabulü açık.

- P3 ilk CI: 76/76 birim, build başarılı; Chromium testi iki aynı başlık yüzünden durdu (https://github.com/mehmetyildiz03/saglik/actions/runs/45824220235). Ayrıntı paneli seçicisi sınırlandırıldı, boş dönem görünümüne dönem seçicisi eklendi ve bu geçiş test edildi. Yeni CI gerekli; başarısız aday yayınlanmadı.

2026-11-26 — P3 kabul/yayın: f3c0b963ebaa331eab2d67c8b31ed5961ec0a801, 76/76 birim + derleme + Chromium kabulü başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45824489112); main Pages başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45824711385). P2 main Pages de başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45823922300). P4 ilk dilim: development/p4-events, v0.17.0; olay şeridi, olay ve ölçüm odağının ayrılması, kaynak ve gün bazlı Geçmiş, olaydan özgün kayda geçiş. Aday CI bekliyor. Gerçek hasta raporları, kapsamlı performans/WCAG açık. Otomasyon açılmadı.

2026-11-26 — P4 kabul/yayın: ec566e07537b77d709b4d67a54518c4e398b9655, 79/79 birim ve Chromium kabulü (https://github.com/mehmetyildiz03/saglik/actions/runs/45825982036); main Pages başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45826240084). P5 ilk dilim v0.18.0: kaybolan 200+ adayların sayfalama ile erişimi, onay ve alan doğrulaması, özgün kaynak korunarak okunmayan satır düzeltme, güvenli ek yazım biçimleri, metinsiz sayfa bildirimi. OCR fizibilitesi kaynak kaydına eklendi, OCR henüz yok. Aday CI bekliyor. Gerçek rapor, geniş kapsamlı WCAG/performance açık; otomasyon kapalı.

- İlk P5 adayında 84/84 birim + Chromium kabulü başarılı (https://github.com/mehmetyildiz03/saglik/actions/runs/45827087411). Görsel QA: ilk okuma özeti onarımdan sonra eski kalıyordu; canlı sayaç, sayfaya özgü toplu seçim etiketi ve regresyon testiyle düzeltildi. Son aday CI yeniden kontrol edilecek.
