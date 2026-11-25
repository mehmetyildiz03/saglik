# Pera Sağlık · v0.3.0

Bağımsız kişisel sağlık kayıtları uygulaması. Ana BioNexus deposunun verileri ve özel kaynak kodu kopyalanmaz. Sağlık verisi sunucuya gönderilmez; cihazdaki şifreli kasada saklanır. Klinik tanı veya tedavi aracı değildir.

## Geliştirme
Node.js 22+; npm install, npm test, npm run build. dist/ klasörünü HTTPS veya localhost üzerinden sun. Kök statik Pages yayını manuel kayıt ve metin aktarımını çalıştırır; PDF için dist/ derlemesi gerekir. PDF.js kararlı sürümü 6.5.438 olarak sabitlendi; paket kurulumunun ve gerçek PDF testlerinin başarıyla tamamlanması gerekir.

## Bilimsel ayrım
Katalogdaki 45 test isim/birim eşleştirmesidir, evrensel sayısal referans değildir. Rapor aralığı, klinik karar eşiği ve tedavi hedefi ayrı bilgi türleridir. MedlinePlus, ADA 2026 ve KDIGO 2024 ve ACC/AHA 2026 kaynak kayıtları Bilim ekranındadır. Klinik otomatik tanı veya organ puanı yoktur.

## Veri ve güvenlik
PBKDF2-HMAC-SHA256 (600.000 iterasyon), rastgele 16 bayt tuz; AES-GCM-256 ve her kayıtta rastgele 12 bayt IV. Tüm profiller tek şifreli kasa içinde; profil başına ayrı erişim güvenliği yoktur. Aynı origin üzerinde çalışan diğer siteler tarayıcı depolamasına erişebilir. Kasa açıkken güvenilir olmayan cihaz, eklenti veya uygulama kodu risk oluşturur. 5 dakika boşta kalınca kilitlenir. Yedek alma ve geri yükleme desteklenir; parola kurtarma yoktur.

## PDF sınırları
Sadece metin katmanı içeren raporlar, 20 MB/50 sayfa; kesin ad/birim/sayısal satır tanıma. Bilinmeyen satırlar inceleme ekranında kalır; kullanıcı seçimi ve tarih olmadan kayıt yoktur. OCR, karşılaştırma işaretli sonuçlar, çok satırlı karmaşık raporlar ve evrensel birim dönüşümü henüz desteklenmez. Sentetik ayrıştırma kontrolleri gerçek rapor kabul testi değildir.

## Yayın ve kabul testi
GitHub Pages için Settings > Pages > Source: GitHub Actions seçilmeli. `npm run test:browser` derlenmiş dist/ üzerinde Chromium ile sentetik PDF, kayıt, profil ayrımı, kasa kilidi ve mobil taşma kontrolünü yapar. Gerçek hasta PDF'leri veya kişisel veriler kamuya açık depoya eklenmez. Node ve tarayıcı kontrolleri klinik doğrulama yerine geçmez.
