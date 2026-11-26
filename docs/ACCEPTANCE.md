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

## Sürekli kabul — 26 Kasım plan denetimi
- Her dilim için en az bir işlevsel tarayıcı regresyonu, ilgili olumsuz veri fikstürleri, klavye erişimi, masaüstü/mobil taşma ve temel güvenlik regresyonu. Kapsamlı WCAG, Firefox/WebKit ve yüksek hacimli performans ölçümleri ayrı açık maddelerdir; bunlar doğrulanmadan tam uyum iddia edilmez.
- P2: seçilen 2 veya 3 farklı tarih kronolojik olmalı. Her hücre kendi tarihindeki tüm kayıtları korur; eksik hücre boş/—, sıfır değildir. Birden fazla veya nitel/sınırlı ölçümde otomatik sayısal fark yok. Fark yalnız seçilen iki komşu sütun arasında tek kesin sayılarla ve aynı profilde/ölçüm grubunda; aradaki seçilmemiş kayıtların trendini temsil etmez. Rapor referansları her hücrede görünür; ayrı kayıtlar doğrudan açılabilir. Bilinmeyen laboratuvar/yöntem için açıklama zorunlu. Farkın rengi artış/azalışın klinik anlamı olduğunu düşündürmez.
- Aday dalı CI başarı kaydı ve aday SHA eşleşmeli. Aynı commit main'e alındıktan sonra Pages sonucu ayrı doğrulanır. Bekleyen veya başarısız CI sırasında aynı iş için başka aday açılmaz.

- P3: aktif profil ve ölçüm grubu ayrımı, sistem/arama/takip/durum filtreleri; ortak zaman alanı bütün görünür gruplar ve sayfalar için sabit, her değer ekseni özgün birime aittir. Seçili günde eksik kayıt sıfır değildir; tek sayısal gözlem nokta, nitel/sınırlı gözlem yalnız özgün değer. Çoklu/şüpheli tarihler üzerinden çizgi yok. Ortak rapor bandı yalnız aynı geçerli referans varsa. En fazla 12 kart/sayfa; klavye ile ortak tarih/dönem ve kaydı açma. Masaüstü/mobil taşma, koyu tema, filtre ve kayda geri dönüş testleri.

- P4: yalnız aktif profilin gerçek kayıt tarihleri; başlangıç/bitiş ayrı, bitiş yoksa uydurulmaz. PDF/metin/manuel etiketleri mevcut origin alanından, yükleme tarihi tahmin edilmez. Olay işaretleri grafikle aynı X koordinatında, değer eksenine veya istatistiğe etki etmez. Olay tarihini seçmek ölçüm tarihini değiştirmez, ölçüm bulunmayan gün için değer üretmez. Tür/dönem ve boş görünüm, aynı gündeki çoklu olayların ayrı erişimi, grafik dışındaki olayların Geçmiş'te korunması, profil/kilit temizliği, mobil taşma ve koyu tema denetlenir.
