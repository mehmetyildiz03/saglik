export const evidence=[
  {
    "id": "lab",
    "group": "all",
    "title": "Rapor referansı nasıl okunur?",
    "org": "NIH / MedlinePlus",
    "year": "2025",
    "kind": "Referans bilgisi",
    "url": "https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/",
    "section": "What is a reference range?",
    "tests": [],
    "summary": "Kendi raporundaki aralık ve birim esas alınır. Farklı laboratuvarların yöntemleri ve aralıkları değişebilir. Aralık içi sonuç sağlık garantisi, aralık dışı sonuç hastalık tanısı değildir.",
    "scope": "Genel eğitim. Sayısal evrensel referans oluşturmaz."
  },
  {
    "id": "cbc-tr",
    "group": "blood",
    "title": "Türkiye hemogram referans araştırması",
    "org": "Ozarda ve arkadaşları · Biochemia Medica",
    "year": "2017",
    "kind": "Popülasyon referans çalışması",
    "url": "https://doi.org/10.11613/BM.2017.038",
    "section": "Methods, results and reference intervals",
    "tests": [
      "hgb",
      "rbc",
      "wbc",
      "plt",
      "hct",
      "mcv",
      "mch",
      "mchc",
      "rdw",
      "neut",
      "lym",
      "neutpct",
      "lympct",
      "mono",
      "monopct",
      "eos",
      "eospct",
      "baso",
      "basopct",
      "rdwsd",
      "mpv",
      "pdw"
    ],
    "summary": "12 laboratuvarda 3.363 K2-EDTA tam kan örneği üzerinden referans dağılımları araştırılmıştır. Yaş, cinsiyet, bölge ve analiz sistemi dikkate alınmalıdır.",
    "scope": "Kaynak adayı. Cihaz ve popülasyon uygunluğu ile tabloların sayısal aktarımı doğrulanmadan otomatik referans olarak kullanılmaz."
  },
  {
    "id": "ada-a1c",
    "group": "metabolism",
    "title": "HbA1c: tanı ölçütü ve ölçüm koşulları",
    "org": "ADA · Standards of Care",
    "year": "2026",
    "kind": "Klinik karar eşiği",
    "url": "https://doi.org/10.2337/dc26-s002",
    "section": "Table 2.1",
    "tests": [
      "a1c"
    ],
    "summary": "Gebelik dışı kişiler için standardize laboratuvar HbA1c ≥%6,5 (≥48 mmol/mol) diyabet tanı ölçütlerinden biridir. Belirgin hiperglisemi yoksa doğrulayıcı sonuç gerekir.",
    "scope": "Eğitim; kişisel tanı, tedavi hedefi veya referans aralığı değil. Eritrosit döngüsü, hemoglobin varyantları ve diğer etkenler HbA1c yorumunu değiştirebilir."
  },
  {
    "id": "ada-fpg",
    "group": "metabolism",
    "title": "Açlık plazma glukozu",
    "org": "ADA · Standards of Care",
    "year": "2026",
    "kind": "Klinik karar eşiği",
    "url": "https://doi.org/10.2337/dc26-s002",
    "section": "Table 2.1",
    "tests": [
      "fpg",
      "glucose",
      "fasting-glucose"
    ],
    "summary": "En az 8 saat kalori alınmamış plazma örneğinde ≥126 mg/dL (≥7,0 mmol/L), gebelik dışı diyabet tanı ölçütlerinden biridir. Açlık durumu belirsiz ölçüm bu eşikle otomatik karşılaştırılmaz.",
    "scope": "Klinik bağlam ve doğrulama gerekir. Gebelik ölçütleri farklıdır."
  },
  {
    "id": "kdigo",
    "group": "kidney",
    "title": "eGFR ve idrar albümin/kreatinin oranı",
    "org": "KDIGO",
    "year": "2024",
    "kind": "Klinik bağlam",
    "url": "https://doi.org/10.1016/j.kint.2023.10.016",
    "section": "Practice points 1.1.1 and 1.1.3",
    "tests": [
      "egfr",
      "uacr",
      "creat"
    ],
    "summary": "Böbrek değerlendirmesinde glomerüler filtrasyon ve idrar albümini birlikte ele alınır. Kroniklik en az üç aylık süre ile kanıtlanır; tek anormal ölçüm kronik hastalık tanısı değildir.",
    "scope": "Otomatik evreleme, akut/kronik ayrımı veya böbrek risk puanı yapılmaz."
  },
  {
    "id": "lipids",
    "group": "heart",
    "title": "Kan yağları: farklı göstergeler, farklı amaçlar",
    "org": "ACC/AHA",
    "year": "2026",
    "kind": "Klinik kılavuz",
    "url": "https://doi.org/10.1016/j.jacc.2025.11.016",
    "section": "3.2–3.4",
    "tests": [
      "tc",
      "ldl",
      "hdl",
      "tg",
      "apob",
      "lpa",
      "nonhdl"
    ],
    "summary": "Non-HDL-C, total kolesterolden HDL-C çıkarılarak hesaplanır. LDL-C, ApoB ve Lp(a) farklı biyolojik ölçümlerdir. Tedavi hedefleri kişinin risk grubuna göre değişir.",
    "scope": "Kişisel tedavi hedefi veya risk hesabı üretilmez. Lp(a) kütle ve molar birimleri sabit katsayıyla çevrilmez."
  },
  {
    "id": "ferritin",
    "group": "nutrient",
    "title": "Ferritin ve inflamasyon",
    "org": "WHO",
    "year": "2020",
    "kind": "Klinik kılavuz",
    "url": "https://www.who.int/publications/i/item/9789240000124",
    "section": "Recommendations",
    "tests": [
      "ferritin",
      "iron"
    ],
    "summary": "Ferritin demir depolarının değerlendirilmesinde kullanılır; enfeksiyon ve inflamasyon ferritin yorumunu değiştirir. Tek yüksek ferritin demir yüklenmesini kanıtlamaz.",
    "scope": "Yaş, klinik bağlam ve inflamasyon bilgisi gerekir; sabit ferritin hedefi oluşturulmaz."
  },
  {
    "id": "b12",
    "group": "nutrient",
    "title": "B12: toplam ve aktif ölçüm aynı değildir",
    "org": "NICE NG239",
    "year": "2024",
    "kind": "Klinik karar eşiği",
    "url": "https://www.nice.org.uk/guidance/ng239/chapter/Recommendations",
    "section": "1.3.9, Table 1",
    "tests": [
      "b12"
    ],
    "summary": "16 yaş üzerindeki kişilerde NICE, toplam B12 için 180–350 ng/L (133–258 pmol/L) bandını belirsiz sonuç olarak ele alır. Aktif B12 için ayrı eşikler kullanır. Yerel doğrulanmış eşikler değişebilir.",
    "scope": "Gebelik, kullanılan takviyeler ve örnek türü değerlendirmeyi etkiler. Otomatik eksiklik tanısı konmaz."
  },
  {
    "id": "vitd",
    "group": "nutrient",
    "title": "D vitamini: önleme ve klinik endikasyon ayrımı",
    "org": "Endocrine Society",
    "year": "2024",
    "kind": "Klinik kılavuz",
    "url": "https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease",
    "section": "Guideline scope",
    "tests": [
      "vitd"
    ],
    "summary": "2024 kılavuzu, belirlenmiş tedavi veya test endikasyonu olmayan kişilerde hastalık önleme yaklaşımına odaklanır; 2011 yaklaşımını günceller.",
    "scope": "Tüm bireylere tek ideal hedef veya takviye dozu verilmez."
  },
  {
    "id": "thyroid",
    "group": "thyroid",
    "title": "TSH, FT4 ve FT3 birlikte nasıl ele alınır?",
    "org": "NICE NG145",
    "year": "2023",
    "kind": "Klinik bağlam",
    "url": "https://www.nice.org.uk/guidance/ng145/chapter/recommendations",
    "section": "1.2.8–1.2.11",
    "tests": [
      "tsh",
      "ft4",
      "ft3"
    ],
    "summary": "Test seçimi yaşa ve ikincil tiroid bozukluğu şüphesine göre değişir. Yüksek doz biyotin bazı testlerde yalancı yüksek ya da düşük sonuçlara yol açabilir.",
    "scope": "Tek TSH sonucuyla tanı veya ilaç dozu önerisi yapılmaz."
  },
  {
    "id": "urinalysis",
    "group": "urine",
    "title": "İdrar analizi: üç farklı inceleme",
    "org": "NIH / MedlinePlus",
    "year": "2024",
    "kind": "Klinik bağlam",
    "url": "https://medlineplus.gov/urinalysis.html",
    "section": "Summary",
    "tests": [
      "urine-ph",
      "urine-sg",
      "urine-protein-quant",
      "urine-albumin",
      "urine-creat",
      "urine-rbc",
      "urine-wbc",
      "urine-protein",
      "urine-glucose",
      "urine-ketone",
      "urine-blood",
      "urine-bili",
      "urine-urobilinogen"
    ],
    "summary": "İdrar analizi fiziksel özellikleri, kimyasal maddeleri ve mikroskopik bulguları inceler. Strip sonucu ile nicel konsantrasyon veya mikroskopik hücre sayısı birbirinin yerine geçmez.",
    "scope": "Eğitim amaçlı; tek bir bulgu ile tanı veya tedavi önerisi yapılmaz."
  },
  {
    "id": "urine-nitrite",
    "group": "urine",
    "title": "Nitrit: negatif sonuç enfeksiyonu dışlamaz",
    "org": "NIH / MedlinePlus",
    "year": "2024",
    "kind": "Klinik bağlam",
    "url": "https://medlineplus.gov/lab-tests/nitrites-in-urine/",
    "section": "What do the results mean?",
    "tests": [
      "urine-nitrite",
      "urine-le"
    ],
    "summary": "Bazı bakteriler nitrit üretmez; bu nedenle negatif nitrit sonucu enfeksiyonu tek başına dışlamaz. Belirtiler, diğer testler ve gerektiğinde kültür değerlendirilir.",
    "scope": "Otomatik enfeksiyon tanısı veya antibiyotik önerisi yoktur."
  },
  {
    "id": "liver-markers",
    "group": "liver",
    "title": "Karaciğer enzimleri ile işlev göstergeleri farklıdır",
    "org": "AASLD Liver Fellow Network",
    "year": "2025",
    "kind": "Klinik eğitim",
    "url": "https://www.aasld.org/liver-fellow-network/core-series/back-basics/how-approach-elevated-liver-enzymes",
    "section": "What are liver enzymes?",
    "tests": [
      "alt",
      "ast",
      "alp",
      "ggt",
      "bilirubin",
      "direct-bili",
      "albumin"
    ],
    "summary": "ALT, AST, ALP ve GGT doku hasarıyla ilişkili olabilir; albümin ve pıhtılaşma göstergeleri farklı bilgi verir. AST ve ALP karaciğer dışı dokulardan da kaynaklanabilir.",
    "scope": "Eğitim yazısı; klinik kılavuz veya tanı motoru değildir."
  }
];
export const forTest=id=>evidence.filter(s=>s.tests.includes(id));
export const forGroup=group=>evidence.filter(s=>s.group===group);
