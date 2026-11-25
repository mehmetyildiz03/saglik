# Pera Sağlık

Kişisel sağlık günlüğü ve laboratuvar sonuçlarını anlamlandırma alanı. BioNexus'un işlevsel hedeflerinden esinlenen, özgün ve bağımsız açık kaynak uygulama. Klinik tanı veya tedavi motoru değildir.

## Ürün ilkeleri
- Kullanıcı verileri tarayıcıda, parola ile şifreli kasada tutulur. Sunucuya sağlık verisi gönderilmez.
- Laboratuvar referansı, bilimsel karar eşiği ve kişisel ölçüm birbirinden ayrıdır.
- PDF'den çıkarılan hiçbir değer kullanıcı doğrulaması olmadan kaydedilmez.
- Eksik veri normal kabul edilmez; tek sonuçtan hastalık tanısı konmaz.
- Grafikler, kaynaklar ve açıklamalar erişilebilir ve mobil uyumludur.

## Kurulum
GitHub Pages için depo kökünden statik yayın. Yerel geliştirme için `python3 -m http.server 8000` ve `http://localhost:8000`. PDF özelliği için aşağıdaki dağıtım notlarına bakın.

**Geliştirme durumu:** Üretim için geliştirilen ilk bağımsız sürüm. Klinik doğrulama ve gerçek rapor kabul testleri tamamlanmadan tıbbi karar verme amaçlı kullanılmamalıdır.
