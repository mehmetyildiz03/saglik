# Pera Sağlık · v0.19.0

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

## v0.7 — Sonuç odaklı tahlil ekranı
Tahliller açılışta son ölçüm gruplarını gösterir; tüm geçmiş tarih grupları halinde açılabilir. Arama katalog eş adlarını ve laboratuvar/yöntem bilgisini kapsar. Sistem, tarih, sıralama ve rapor durumuna göre filtreler vardır. Nitel, eşitsizlikli ve referansı bilinmeyen kayıtlar ayrı inceleme grubundadır. Son tarihte birden çok ölçüm seçilmeden gruplanır. Ölçüm ayrıntısı geçmiş tarih seçimi, sayısal grafik (uygunsa), kaynak ve düzenleme içerir. Manuel form ayrı sayfada, referans bilgisi isteğe bağlı bölümdedir. Varsayılan son sonuçlar, 40 satırlık sayfalama ve geçici filtreler kullanılır; hiçbir mevcut sağlık verisi veya kasa şeması değiştirilmez.

## v0.7.1 — Mobil sonuç görünürlüğü
Özetler ve başlıklar sıkıştırıldı; sistem, tarih ve sıralama filtreleri tek düğmeyle açılır, kapalıyken etkin filtre sayısı ve adları görünür. Arama, son/tüm kayıt ve referans durumu filtreleri her zaman erişilebilir. Mobil tarayıcı testi ilk sonucun 390×844 ve 360×800 ekranlarda kaydırmadan bütünüyle görünmesini şart koşar. Tek tarihli kesin ölçümler için boş eğilim grafiği yerine açıklama; rapor ayrıntıları grafikten önce gösterilir. Kasa ve tahlil verileri değişmez.

## v0.8 — Tahliller önce
Kasa açılışında tahliller görünür. Dört ana menü: Tahliller, Geçmiş, Ekle, Diğer. Diğer işlevler korunur. Son sonuçlar sağlık sistemlerine göre gruplanır; tarihe göre tüm sonuçlar veya seçilen gün açılır. İki tarih karşılaştırması aynı ölçüm kimliği, birim, laboratuvar ve yöntem için sayısal farkı yalnız tek ve kesin değerler mevcutsa gösterir. Eşleşmeyen, çoklu ve nitel ölçümler korunur. Mobilde sabit alt menü, yoğun sonuç listesi ve en az dört tam sonuç görünürlüğü kabul testi. Tahlil ayrıntılarında düzenleme, geçmiş, bilimsel kaynak ve rapor kanıtı korunur. Kasa şeması değişmez.

## v0.9 — Tasarım ve tutarlı yayın
Masaüstünde yatay dört ana menü, geniş sonuç tablosu, tahlil seçilince aynı listeden ayrılmadan sağda detay alanı. Mobilde alt menü ve tam ekran ayrıntı korunur. Tahlil ayrıntısından doğrudan takip listesine ekleme/çıkarma; pano şeması ve sağlık kayıtları değişmez. Üretim derlemesi HTML dışındaki tüm uygulama modüllerini, CSS ve yerel PDF.js dosyalarını aynı içerik karmasına sahip dizine alır; yeni HTML eski kök CSS/JS adreslerini kullanmaz. release.json sürüm ve dosya karmalarını içerir. Önbelleğe alınmış eski HTML için sürüm parametreli URL veya yenileme gerekebilir. Yeni tasarımın doğrulaması gerçek tarayıcı testleriyle yapılır; kişisel raporlar test verisi değildir.

## v0.10 — Tahlil kısayolları ve grafikler
Son ölçüm tarihine tek tıklamayla erişim ve profilin mevcut takip listesini kullanan geçici takip filtresi. Sonuç tablosunda son 12 tarih için küçük grafikler, tahlil ayrıntısında seçilebilir tarih, dönem ve doğrudan kaydı açma. Farklı ölçüm grupları karıştırılmaz; sınır bildiren, nitel ve aynı tarihte birden fazla olan kayıtlar çizgiyi keser. Grafik aralığı yalnız eşleşen rapor referanslarından alınır. Kasa şeması, kayıtlar ve mevcut bilimsel kaynaklar değiştirilmez.

## v0.11 — Görünüm ve rapor inceleme
Tahlillerin mevcut liste görünümü varsayılan; isteğe bağlı kart görünümü aynı sonuç ve filtreleri kullanır. Açık/koyu tema ve görünüm tercihi bu cihazda ayrı bir anahtarda yalnız iki görsel tercih olarak saklanır; sağlık verisi veya profil kimliği içermez. Referans göstergesi kesin sayısal ölçüm ve geçerli iki taraflı rapor aralığı gerektirir. Aralık dışı konumlar kategoriktir, şiddet puanı değildir. PDF/metin seçimi ve doğrulama ayrı adımlar. Adaylar varsayılan seçili değildir; toplu seçim ancak açık doğrulamayla yapılır; bir aday ya da ortak rapor bilgisi düzenlenince onay kaldırılır. 200 aday sınırı korunur, okunmayan satırlar ayrı tutulur. Yeni sürüm şifreli veri şemasını değiştirmez; taranmış PDF/OCR ve gerçek rapor klinik doğrulaması henüz kapsam dışıdır.

## v0.12 — Masaüstü görsel çalışma alanı
Yeni masaüstü yan menüsü, gerçek kayıt sayılarıyla sistem kısayolları ve renkli özgün SVG sistem ikonları. Pano görünümü gruplar arasında boşluk bırakmayan görsel tahlil kartları sunar. Önceki açıkça seçilmiş liste/kart tercihleri korunur; varsayılan otomatik görünüm masaüstünde pano, mobilde listedir. Mobilde mevcut alt menü ve liste korunur. Ayrıntı sağ panelde ya da geniş analiz ekranında açılır. / tuşu görünür tahlil aramasına odaklanır. Sistem sayıları ölçüm sayısıdır, sağlık skoru değildir. Mevcut kasa, parser ve klinik hesaplama şeması değişmez.

## v0.12.1 — Masaüstü görünürlük
Sistem seçicisi üst banttan sol menüye taşındı. Kasa kilitlenirken veya profil değiştirirken önceki sistem sayıları DOM'dan temizlenir. Geniş analizde sistem seçilirse sonuç panosu geri açılır. İlk ekranda 1280/1440/1920 piksel genişliklerinde en az 6/8/10 tam ölçüm kartı görünürlüğü sentetik veriyle denetlenir.

## v0.13 — Keşif turu ve renkli tahlil panosu
Masaüstü panosunda sistem renkleri, daha güçlü sonuç tipografisi, önceki ölçümün yönü ve mini grafikler. Seçili sistemde kısa işlev açıklaması ve fizyolojiye doğrudan geçiş. Keşif turu dört bilimsel eğitim durağı içerir (dolaşım, hemogram, böbrek, karaciğer); soru ve açıklamalar mevcut kaynaklı fizyoloji modelinden türetilmiştir. İlerleme yalnız oturum içindeki tamamlanmış eğitim sorularını sayar; profil değişimi veya kilitlemede temizlenir. Ölçüm değerleri, referans sınıfları veya sağlık durumuna puan verilmez, veri girmeye yönelik ödül/seri yoktur. Kasa şeması ve tahlil motoru değişmez. Mobilde Keşif turu Diğer menüsünden erişilebilir.

## v0.14 — Tahlil analiz istasyonu (P1 ilk dilim)
Büyük grafik, gerçek zaman ekseni, seçili ve son ölçüm işaretleri, açılıp kapanan ortak rapor bandı, dönem min/maks/medyan ve güvenli fark göstergeleri. İstatistik yalnız tek kesin ölçümlü tarihlerden; yüzde pozitif önceki değerle, klinik anlam çıkarmadan hesaplanır. Ölçüm tablosu tüm gözlemleri, rapor referansını ve kaynak türünü korur. Eksik laboratuvar/yöntem karşılaştırılabilirlik kanıtı değildir. Yol haritası ve kabul ölçütleri docs/ altında. Şifreli kasa şeması değişmez.

## v0.15 — Çok tarihli tahlil karşılaştırması
Son iki/üç tarih kısayolları, farklı tarihlerin elle seçimi, laboratuvar ve yöntem filtreleri. Her hücre özgün sonucu ve referansı korur; aynı gün birden çok kayıt ayrı açılır. Eksik ölçüm sıfır sayılmaz. Δ yalnız seçilen komşu sütunlarda aynı profilde ve aynı ölçüm grubunda tek kesin sonuçlar varsa hesaplanır. Eksik metadata uyarısı görünür; fark tanı veya klinik değişim değildir. Kasa şeması değişmez.

## v0.16 — Sistem grafikleri
Tahliller → Grafikler sekmesi. Ortak tarih ekseni, ayrı birim ve değer eksenleri; sistem/arama/takip/durum filtreleri, doğrudan dönem ve ortak tarih odağı, isteğe bağlı rapor bantları. Her sayfada en çok 12 ayrı grafik; tek kesin ölçüm nokta olarak görünür, nitel kayıt sayısal değere dönüşmez. Seçili tarihte kayıt yoksa açıkça belirtilir; özgün kayıtlara doğrudan erişilir. Sağlık puanı ve tahliller arası eğim karşılaştırması yok. Kasa ve klinik kaynak şeması değişmez.

## v0.17 — Tarih bağlamı ve sağlık geçmişi
Tek tahlil grafiğinde ortak zaman ekseninde tahlil, bildirilen ilaç başlangıç/bitiş ve not işaretleri; ayrı olay tarihi seçimi ve kesik kılavuz, özgün kayda geçiş. Ölçüm seçimi ve istatistikleri değişmez. Grafik dışındaki olaylar Geçmiş sayfasında bulunur. Geçmiş ekranı olay günü seçimi, tür/dönem filtresi, kaynak etiketi, günün tüm tahlillerini açma ve o tarihle not/ilaç kaydı başlatmayı destekler. Tarih eşleşmesi nedensellik, ilaç uyumu, klinik etki veya tedavi önerisi değildir. Kasa şeması değişmez.

## v0.18 — Rapor inceleme ve düzeltme
Kesin ad/birim eşlemeleri korunarak iki nokta ile ayrılmış tahlil adı, açık referans etiketi ve bazı eşdeğer birim yazımları kabul edilir. PDF metin bantları belirli sırada oluşturulur; metinsiz sayfalar ayrıca bildirilir. 200 aday kesmesi kaldırıldı; 40 satırlık sayfalarda arama, rapor sayfası ve onay durumu filtreleri. Onaylar sayfa değişiminde korunur, veri/ortak metadata değişince kaldırılır. Geçersiz veya tarihsiz aday seçilemez. Okunmayan satır açık neden ile gösterilir; kullanıcı rapora bakarak tam satır düzeltirse yeni onaysız aday oluşur ve özgün kaynak satırı/sayfası korunur. Seçilmeyen/çözümlenmeyen adayları bırakmadan önce açık onay gerekir. Yerel OCR araştırıldı; görüntü tabanlı PDF okumayı henüz desteklemiyoruz. Kasa şeması değişmez.

## v0.19 — Tahlil kimliği ve bilimsel katalog (P6 ilk dilim)
78 → 90 ölçüm kimliği. Demir bağlama kapasitesi, transferrin ve satürasyon, sistatin C, serum lipaz/amilaz, total CK/protein, intakt PTH ve iki ayrı LDH reaksiyon yönü. Yeni kimlikler açık serum bilgisi gerektirir; örnek türü veya yöntem eksikse otomatik eşleştirme yapılmaz. Hemogramda açık boşluk/kısaltma varyantları genişletildi. eGFR'nin iki eski katalog birim yazımı artık kendi tam yazımıyla kullanılabilir; kayıt geçmişi birleştirilmedi. Diğer → Bilim'de aranabilir tahlil kataloğu, birim ve 12 yeni kimlik için LOINC kaynak terimi bağlantısı. Katalog kodu otomatik atanmış hasta LOINC kodu değildir. Türkiye biyokimya araştırması, KDIGO sistatin C bağlamı ve yöntem ayrımı kaynakları eklendi. Evrensel referans aralığı veya birim dönüşümü yok. Kasa şeması değişmez.
