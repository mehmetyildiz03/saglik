# Pera Sağlık — uygulanabilir ürün yol haritası
Karar tarihi: 2026-11-26 (Europe/Istanbul). Başlangıç: v0.13.0, f881f4bf2762d0ab8b0cf139affb6ad32a181f01; son başarılı Pages koşusu 45718075785.
Hedef: prototip değil; rapordan doğrulanmış kayda, sistem seçimine, karşılaştırmaya, grafiğe, geçmişe ve yedeklemeye kadar kullanılabilen kişisel sağlık kayıt uygulaması. Masaüstü öncelikli, mobil işlevler korunur. Ana BioNexus ve saglik2 depoları kapsam dışı.

## İş sırası (tarihler hedef, kabul şartları zorunlu)
| ID | Hedef pencere (2026) | Sürüm hedefi | Çıktı / geçiş şartı |
| --- | --- | --- | --- |
| P0 | 26 Kasım | altyapı | Yol haritası, kaynak matrisi, kabul kriterleri, aday dalı ve yayın disiplini |
| P1 | 26–28 Kasım | 0.14.x | Tek tahlil analiz istasyonu: gerçek tarih ekseni, son/seçili ölçüm, ortak rapor bandı, mutlak/yüzde fark ve dönem istatistikleri, veri tablosu, klavye erişimi, büyük grafik |
| P2 | 29 Kasım–1 Aralık | 0.15.x | Son 2/3 veya seçilmiş tarihler; eksik/çoklu/nitel sonuçlar görünür, birim/lab/yöntem ve profil ayrımı, karşılaştırma referansı ve her kayda erişim |
| P3 | 2–4 Aralık | 0.16.x | Sistem bazlı küçük çoklu grafikler, takip edilen tahliller, ortak tarih penceresi; her seri kendi birimi ve ekseniyle, kısayollar, arama |
| P4 | 5–7 Aralık | 0.17.x | Grafik olay şeridi: ilaç başlangıç/bitiş, günlük, rapor kaynağı; yalnız kaydedilmiş tarihler, nedensellik/etkileşim önerisi yok; olay filtreleri, günlük paneli |
| P5 | 8–11 Aralık | 0.18.x | Rapor alma ve doğrulama deneyimi: özgün satır, birim, referans ve kaynak koruma, çok satırlı örnekler, kopya/multi kayıt, hata telafisi, yerel OCR fizibilitesi (otomatik onay yok) |
| P6 | 12–15 Aralık | 0.19.x | Klinik kaynak ve veri denetimi: katalog kapsamı, eksik kimlik ve örnek türü, birim/LOINC/UCUM araştırması, rapor aralığı ile klinik eşik ayrımı, güncel kılavuz incelemesi; onaysız dönüşüm veya evrensel aralık yok |
| P7 | 16–19 Aralık | 0.20.x | Uçtan uca kullanılabilirlik, erişilebilirlik, güvenlik, performans, şifreli yedek/geri yükleme, boş/tek/çok kayıt durumları, masaüstü 1280/1440/1920 + mobil, farklı tarayıcılar |
| P8 | 20 Aralık ve sonrası | 1.0 aday | Kullanıcı değerlendirmesi ve izinli gerçek e-Nabız raporlarının yerel kabulü; kanıtların denetimi; açık kalan kritik hata yoksa 1.0 önerisi. Klinik cihaz onayı iddiası yok. |

Tarih dolduğu için bir faz başarılı sayılmaz. Gecikme halinde PROGRESS.md içinde gerekçe ve yeni hedef kaydedilir; geçilmemiş kabul kapısı atlanmaz. Sürüm numaraları hedef; gerçek sürüm ve commit PROGRESS.md'de tutulur.

## Tasarım ilkeleri
- Ana açılış tahliller; en sık kullanılan sonuç ve geçmiş işlemleri bir/iki tıklama. Sistem seçimi sabit; büyük analiz ekranı, kompakt sağ panel ve liste/pano seçenekleri birlikte çalışır.
- Sağlık sistemi rengi gezinmeyi kolaylaştırır. Rapor durumu metin ve şekille de anlatılır. Sağlık puanı, iyi/kötü sonuç ödülü ve otomatik hastalık tanısı yok.
- Yüzde ve mutlak değişim gözlem farkıdır, klinik iyileşme anlamına gelmez. Önceki değer sıfır/negatifse yüzde gösterilmez; hesap taşması yok.
- Her grafik orijinal ölçüm kimliğini, birimi, laboratuvarı, yöntemi ve aktif profili korur. Eksik yöntem/lab aynı olduklarının kanıtı değildir; bilinmiyor etiketi açıkça görünür. Nitel veya eşitsizlikli değerler kesin sayıya dönüşmez. Aynı gün çoklu ölçümler ayrı kalır, bağlantı ve otomatik delta yapılmaz.
- Geçmiş referanslar değiştiğinde tek ortak bant çizilmez; kayıt bazlı referans her zaman erişilebilir. İlaç olayları zaman ilişkisi dışında sonuç çıkarmaz.
- Yerel, şifreli kasa; gerçek hasta raporları, parola, ham sağlık verisi, kişisel ekran görüntüsü veya özel ana depo içeriği GitHub'a yüklenmez. Harici analiz/telemetri/LLM API eklenmez.
- Mevcut işlevler korunur; şema değişimi gerekiyorsa ayrı plan, eski yedek fikstürü ve geri dönüş testi.

## Çalıştırma protokolü
Her planlı çalışmada önce main ve aday dalı, GitHub Actions, docs/PROGRESS.md ve açık engeller okunur. En yüksek öncelikli tamamlanmamış işi seç; gerekiyorsa kaynakları yeniden araştır ve RESEARCH.md'ye URL, tarih, kullanım sınırı ekle. Bir küçük ama uçtan uca kullanılabilir dilim uygula, test et ve kanıt kaydet. Başarısız aday yayınlanmaz. Yalnız bu repo içinde çalışma yetkisi vardır. Yeni yetki, ücretli hizmet, kişisel veri yükleme, tıbbi iddia veya riskli veri migrasyonu gerektiren işte dur ve açıkça bildir. Onaylanan sürümden sonra kullanıcıya basit değişiklik özeti ve bağlantılar ver. Çakışma varsa güncel main'i yeniden oku, force push kullanma. Başarı iddiası için gerçek koşu sonucunu bekle; bekleyen test veya yayın açıkça bekleyen olarak kalır.

İlgili belgeler: [Kabul kriterleri](ACCEPTANCE.md), [Araştırma kaydı](RESEARCH.md), [İlerleme günlüğü](PROGRESS.md).
