# Kaynak ve karar matrisi
İlk inceleme 2026-11-26. Kaynaklar uygulama tasarım kararlarını destekler; tek başlarına klinik ürün validasyonu değildir. Sayısal klinik eşikler bu araştırma kapsamında üretilmedi.

| Kaynak | Kullanım kararı | Sınır |
| --- | --- | --- |
| NIH/NLM MedlinePlus — [How to Understand Your Lab Results](https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/) | Rapor referansını koru, yöntem/lab ve birim farkını göster, aynı laboratuvar eğilimini tercih et. Aralık dışı sonuç tanı değildir. | Genel hasta eğitimi; belirli hastalık karar eşikleri değildir. |
| HL7 FHIR R5 — [Observation, 10.1.5.6–10.1.5.8](https://www.hl7.org/fhir/observation.html) | Sonuç türü, karşılaştırma işareti, etkili ölçüm tarihi ve referans aralığı ayrı kavramlar. Gelecekte birlikte çalışabilirlik için araştırma zemini. | Mevcut kasa FHIR uyumlu olarak sertifikalı değildir. Şema migrasyonu yok. |
| UK Office for National Statistics — [Line chart](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart) | Düzensiz aralıklı veride gerçek noktalar; kesintileri saklamama, açıklamalar ve ayrı küçük grafikler. | Genel görselleştirme ilkeleri; klinik trend yorumu değil. |
| UK ONS — [Principles](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles) | Doğru, erişilebilir, sezgisel, tutarlı grafik. | Görsel kalite kullanıcı ve tarayıcı kabulü ile ayrıca ölçülür. |
| W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | 1.4.1, 1.4.3, 1.4.11, 2.1.1, 2.4.7; renk tek bilgi kanalı değil, kontrast ve klavye hedefleri. | Tam AA uyumu iddia edilmez; ölçüm ve denetim gerekir. |

## Gelecek araştırma kuyruğu
P2: laboratuvarlar arası karşılaştırılabilirlik ve biyolojik/analitik değişkenlik; RCV ancak ölçüm yöntemi ve kaynak doğrulanırsa ayrı çalışma, şu an uygulanmaz.
P3: ONS small multiples ve erişilebilir veri görselleştirme.
P4: FHIR MedicationStatement/MedicationUsage ve provenance; olaylar sadece kayıt tarihi.
P5: güncel PDF.js resmi belgeleri, e-Nabız rapor biçimleri, yerel OCR ve güvenlik; gerçek kişisel dosya depoya alınmaz.
P6: Türkiye kaynaklı referans aralığı literatürü, yaş/cinsiyet/örnek/method ve kılavuzlara özgü klinik eşikler. LOINC/UCUM eşleme araştırması; bilimsel kaynak, sürüm, geçerlilik, örnek popülasyonu ve birim notu olmadan uygulama yok.
P7: OWASP browser storage, Web Crypto, WCAG ve Playwright test metodolojisi. Kasa anahtarı ve sağlık verileri ağ üzerinden gönderilmez.

2026-11-26 — P2 kaynak yeniden kontrolü: [MedlinePlus](https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/) laboratuvar ve yöntem farkının referans yorumunu etkilediğini, aynı laboratuvarın trend için tercih edilmesini ve raporun kendi referansının kullanılmasını açıklar. [ONS görselleştirme ilkeleri](https://service-manual.ons.gov.uk/data-visualisation/guidance/principles) basit ve bağlamı koruyan karşılaştırmayı destekler. Karar: aynı ölçüm grubu ve profil ayrımı, her hücrede özgün referans, eksik metadata uyarısı, yalnız tanımlı seçili tarihler arasında betimsel fark. Klinik anlamlı değişim/RCV hesaplanmadı; analitik ve biyolojik değişkenlik için doğrulanmış veri gerekir.

2026-11-26 — P3: [ONS small multiple charts](https://service-manual.ons.gov.uk/data-visualisation/chart-types/small-multiple-charts) çizgi karmaşasını azaltmak için küçük panelleri, ortak eksenleri ve en çok 12 paneli önerir. Farklı tıbbi büyüklükler tek değer ölçeğine çevrilmez: ONS karşılaştırılabilir seriler için ortak Y ölçeği önerir; burada farklı birimler nedeniyle bağımsız Y ekseni ve açık uyarı kullanılır, panel eğimleri karşılaştırılmaz. [ONS line chart](https://service-manual.ons.gov.uk/data-visualisation/chart-types/line-chart) düzensiz tarih noktaları ve veri boşluklarının korunmasını destekler. [MedlinePlus](https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/) lab/yöntem ve rapor referansı ayrımını destekler. Klinik risk veya normal aralık türetilmedi.
