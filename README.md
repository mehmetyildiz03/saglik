# Pera Sağlık · v0.6.0

Bağımsız kişisel sağlık kayıtları uygulaması. Ana BioNexus deposunun verileri ve özel kaynak kodu kopyalanmaz. Sağlık verisi sunucuya gönderilmez; cihazdaki şifreli kasada saklanır. Klinik tanı veya tedavi aracı değildir.

## Geliştirme
Node.js 22+; npm install, npm test, npm run build. dist/ klasörünü HTTPS veya localhost üzerinden sun. Kök statik Pages yayını manuel kayıt ve metin aktarımını çalıştırır; PDF için dist/ derlemesi gerekir. PDF.js kararlı sürümü 6.5.438 olarak sabitlendi; paket kurulumunun ve gerçek PDF testlerinin başarıyla tamamlanması gerekir.

## Bilimsel ayrım
Katalogdaki 78 test isim/birim eşleştirmesidir, evrensel sayısal referans değildir. Rapor aralığı, klinik karar eşiği ve tedavi hedefi ayrı bilgi türleridir. MedlinePlus, ADA 2026 ve KDIGO 2024 ve ACC/AHA 2026 kaynak kayıtları Bilim ekranındadır. Klinik otomatik tanı veya organ puanı yoktur.

## Veri ve güvenlik
PBKDF2-HMAC-SHA256 (600.000 iterasyon), rastgele 16 bayt tuz; AES-GCM-256 ve her kayıtta rastgele 12 bayt IV. Tüm profiller tek şifreli kasa içinde; profil başına ayrı erişim güvenliği yoktur. Aynı origin üzerinde çalışan diğer siteler tarayıcı depolamasına erişebilir. Kasa açıkken güvenilir olmayan cihaz, eklenti veya uygulama kodu risk oluşturur. 5 dakika boşta kalınca kilitlenir. Yedek alma ve geri yükleme desteklenir; parola kurtarma yoktur.

## PDF sınırları
Sadece metin katmanı içeren raporlar, 20 MB/50 sayfa; kesin ad/birim/sayısal satır tanıma. Bilinmeyen satırlar inceleme ekranında kalır; kullanıcı seçimi ve tarih olmadan kayıt yoktur. OCR, karşılaştırma işaretli sonuçlar, çok satırlı karmaşık raporlar ve evrensel birim dönüşümü henüz desteklenmez. Sentetik ayrıştırma kontrolleri gerçek rapor kabul testi değildir.

## Yayın ve kabul testi
GitHub Pages için Settings > Pages > Source: GitHub Actions seçilmeli. `npm run test:browser` derlenmiş dist/ üzerinde Chromium ile sentetik PDF, kayıt, profil ayrımı, kasa kilidi ve mobil taşma kontrolünü yapar. Gerçek hasta PDF'leri veya kişisel veriler kamuya açık depoya eklenmez. Node ve tarayıcı kontrolleri klinik doğrulama yerine geçmez.

## v0.4 — Kişisel kayıt ve bilim
- Şifreli kasa şeması v3; v1/v2 kayıtları migrasyonla korunur. İlaç ve takviye kaydı, ortak tarih çizelgesi ve profil bazlı bilimsel bağlam görünümü.
- Rapor aralığı değiştirilmez; bilimsel bilgi ayrı katmandır. 10 kaynak kaydı (NIH, Ozarda 2017, ADA 2026, KDIGO 2024, ACC/AHA 2026, WHO, NICE, Endocrine Society). Her kayıt kapsam, kaynak bağlantısı ve bölüm taşır. Klinik üretim onayı değildir.
- Non-HDL hesaplama aynı örnek için kullanıcı doğrulaması, aynı profil, tarih, laboratuvar ve birim gerektirir. Hesap raporun orijinal ölçümü olarak kaydedilmez.
- İlaç modülü yalnız kullanıcının bildirdiği kullanım geçmişini saklar. Etkileşim, doz önerisi veya nedensellik çıkarımı yapmaz.

## v0.4.1 — Rapor kanıtı
63 tahlillik isim/birim kataloğu; açıkça tanımlı birim yazım eşleştirmeleri (sayısal dönüşüm yok). Özgün satır, birim ve rapor işareti şifreli kayıtta korunur. Ortak tarih yerine satıra özel tarih seçilebilir. Belirsiz açlık glukozu artık açıkça plazma örneği diye etiketlenmez; eski kayıtların örnek türü kullanıcı tarafından kontrol edilmelidir. Eşitsizlikli ve kategorik sonuçlar henüz aday olarak kabul edilmez. Gerçek raporlarla klinik kabul testi ayrıca gereklidir.

## v0.5 — Ölçüm türleri ve idrar
78 test tanımı ve 13 bilimsel bağlam kaydı. Sayısal, sınır bildiren (<, <=, >, >=) ve nitel sonuçlar ayrı biçimde saklanır; sınır/nitel sonuçlar grafik ve türetilmiş hesaplamalara alınmaz. HL7 FHIR R5 Quantity comparator semantiğinden esinlenilmiştir; FHIR uyumluluğu iddiası yoktur. Tek taraflı referans metin olarak korunur, otomatik sınıflandırılmaz. İdrar strip, mikroskopi ve kantitatif analizler ayrı tanımlardır. Aynı tarihli birden çok ölçüm varsa son değer seçilmez. Sistem keşfi ölçüm kartları ve karşılaştırma alanı içerir. Gerçek rapor doğrulaması ve klinik popülasyon referans onayı devam eden işlerdir.

## v0.5.1 — Veri kalitesi
Mikroskopik /HPF biriminin önündeki ayraç korunur. Bilinmeyen mikroskopi alan birimleri eşleştirilmez. Grafik çizgileri aynı gün birden fazla ölçüm veya sınır bildiren ara ölçüm olduğunda kesilir. Eşdeğer görünen kayıtlar kullanıcı seçimine göre korunabilir veya atlanabilir.

## v0.6 — Kişiselleştirme ve fizyoloji
Her profilin ayrı şifreli pano düzeni ve en fazla 8 sabit ölçümü vardır. Varsayılanlar LDL, hemoglobin, HbA1c ve serum kreatinin olup kullanıcı kaldırabilir. Pano tercihleri ölçüm verilerini değiştirmez. Grafiklerde dönem seçimi ve yalnız tüm kesin sayısal kayıtlarda aynı rapor aralığı varsa referans bandı bulunur. Kalp dolaşımı, nefron, kan hücreleri ve karaciğer için etkileşimli özgün öğretici şemalar NIH ve ASH kaynaklarına bağlanır. Bunlar kişisel anatomi, organ işlevi veya sağlık skoru simülasyonu değildir. Gerçek rapor kabulü ve bilimsel sayısal referansların uygunluğu ayrıca doğrulanmalıdır.
