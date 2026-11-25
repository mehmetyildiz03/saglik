# Kabul kapıları
Her sürüm için, aşağıdaki koşullar uygulanabilir olduğu ölçüde zorunludur. Birim testleri + üretim derlemesi + Chromium tarayıcı kabulü + GitHub Pages koşu kaydı. Aday dalı yalnız doğrulama yapar; main yayınlar. Aday yeşil değilse main'e taşınmaz. Yeni klinik kaynak, gerçek rapor uygunluğu veya WCAG uygunluğu otomatik testlerle kanıtlanmış sayılmaz.

## Grafik doğruluğu
- Aynı profil ve ölçüm kimliği; farklı birim, lab, yöntem ayrı. Nitel/sınırlı gözlem ve aynı tarih çoklu kayıtta çizgi kesilir. Eksik veri için uydurma değer veya aradeğer yok.
- Tarih noktaları gerçek gün farkına göre. Tarih ve değer etiketleri okunaklı. Son ölçüm vurgusu gerçek son tarihe aittir. Seçili ölçüm farklıysa ayırt edilir.
- Yalnız geçerli ve tüm kapsanan kayıtlarda aynı iki taraflı rapor referansı varsa ortak bant. Değişen aralık, nitel, sınır bildiren ve eksik referans varsa ortak bant yok.
- Dönem istatistikleri yalnız tek kesin sayısal gözlem bulunan günlerden hesaplanır, kapsam/dışlanan kayıt sayısı görünür. Çoklu günler ham tabloda kalır. Önceki tarih kesin değilse değişim yok. Yüzde yalnız pozitif önceki değerde, tüm hesaplar sonlu.
- Klavye ile tarih seçimi, tablo alternatifi, metin/şekil farkı, renk tek belirteç değil. Veri tablosu değer/birim/tarih/referans/kaynak türü gösterir.
- Fikstürler: 0/1/2/çok tarih, sıfır/negatif, eşit ve çok büyük değerler, birim/lab/yöntem farkı, eksik metadata, aynı gün çoklu, eşitsizlikli, nitel, değişen referans, tarih sınırı, profil değişimi.
## Kullanım ve görsel kalite
- 1280, 1440, 1920 px ve 390/360 px; yatay taşma, örtüşme, hatalı büyük ikon yok. Liste, kart, pano, açık/koyu tema, arama, seçili durum, geri/ESC davranışı korunur. Ekran görüntüleri sentetik veriyle.
- Grafik kontrolleri gerçek veriyi değiştirir, seçili tarih ve ham kayıt uyuşur; tablo ve grafik farklı veriye bakmaz. Uygulama ilk rapordan yedeklemeye kadar uçtan uca test edilir.
- WCAG 2.2 AA hedefi: klavye, odak görünürlüğü, normal metin 4.5:1, grafik anlamlı işaretleri ve etkileşimli bileşenlerde 3:1 kontrast; reduced motion; gerçek ölçümle doğrulama. Tam uygunluk denetimi ayrıca.
## Güvenlik ve yayın
- Şifreli kasa, profil ayrımı, kilit ve yedek testleri geçer. Sağlık verisi/şifre ağ isteklerinde veya loglarda yok. Gerçek hasta verisi depoya girmez.
- İçerik karmalı aynı sürüm varlıkları; build manifest ve HTML ilişkisi doğrulanır. Aday dalının Pages dağıtımı yoktur. main commit koşusu başarı olmadan "yayında" yazılmaz.
- Her döngüde: değişen dosyalar, commit, koşu URL'si, gerçek test sayıları ve kalan sorunlar PROGRESS.md'ye eklenir. Başarısız test düzeltilmeden ilerleme yok.
