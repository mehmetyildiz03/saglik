import {catalogue} from './catalog.js';
import {latestGroups,resultLabel} from './measurement.js';
export const physiology={
  "heart": {
    "title": "Bir damla kanın yolculuğu",
    "subtitle": "Oksijenin akciğerden dokulara taşındığı döngü",
    "source": "https://www.nhlbi.nih.gov/health/heart/blood-flow",
    "organization": "NHLBI / NIH · How Blood Flows through the Heart",
    "layout": "cycle",
    "nodes": [
      {
        "title": "Sağ kalp",
        "short": "Sağ kalp",
        "art": "heart",
        "tone": "blue",
        "desc": "Dokulardan dönen oksijeni azalmış kan sağ kulakçık ve sağ karıncıktan geçerek akciğere pompalanır.",
        "tests": [],
        "limit": "Bu adımın işlevi lipid tahlili ile doğrudan ölçülmez."
      },
      {
        "title": "Akciğerler",
        "short": "Akciğer",
        "art": "lungs",
        "tone": "blue",
        "desc": "Akciğerlerde kan oksijen alır ve karbondioksiti bırakır; ardından sol kalbe döner.",
        "tests": [],
        "limit": "Bu çizim oksijen satürasyonu veya akciğer fonksiyonu ölçümü değildir."
      },
      {
        "title": "Sol kalp",
        "short": "Sol kalp",
        "art": "heart",
        "tone": "rose",
        "desc": "Sol karıncık oksijenden zengin kanı aort yoluyla vücuda pompalar.",
        "tests": [],
        "limit": "Kolesterol değerinden kalbin pompalama gücü çıkarılamaz."
      },
      {
        "title": "Damarlar ve dokular",
        "short": "Dokular",
        "art": "vessel",
        "tone": "rose",
        "desc": "Kan dokulara oksijen taşır ve venöz dolaşımla geri döner. Lipid ve lipoprotein ölçümleri damar hastalığı riskinin değerlendirilmesinde kullanılan göstergelerdir.",
        "tests": [
          "ldl",
          "hdl",
          "tc",
          "tg",
          "apob",
          "lpa",
          "nonhdl"
        ],
        "limit": "Bu ölçümler damarın açıklığını, plak varlığını veya kan akış hızını doğrudan göstermez."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        0
      ]
    ]
  },
  "kidney": {
    "title": "Nefron: süz, geri kazan, uzaklaştır",
    "subtitle": "Filtrasyon ve tübüler işlevin ayrı rolleri",
    "source": "https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work",
    "organization": "NIDDK / NIH · Your Kidneys & How They Work",
    "layout": "flow",
    "nodes": [
      {
        "title": "Glomerüler filtrasyon",
        "short": "Filtrasyon",
        "art": "filter",
        "tone": "blue",
        "desc": "Küçük moleküller ve sıvı glomerülden süzülür; büyük proteinler ve kan hücrelerinin çoğu dolaşımda kalır.",
        "tests": [
          "creat",
          "egfr",
          "uacr"
        ],
        "limit": "eGFR bir tahmindir; tek ölçüm kronik böbrek hastalığını göstermez."
      },
      {
        "title": "Tübüller",
        "short": "Tübüller",
        "art": "tube",
        "tone": "mint",
        "desc": "Süzüntüdeki su ve gerekli maddelerin önemli bir kısmı kana geri kazandırılır. Tübüller ayrıca atık ve asitlerin atılmasına katkı sağlar.",
        "tests": [
          "na",
          "k",
          "chloride",
          "serum-ca",
          "serum-mg",
          "serum-p"
        ],
        "limit": "Kan elektrolitleri yalnız böbreğin değil, birçok sistemin etkisiyle değişir."
      },
      {
        "title": "Kana geri dönüş",
        "short": "Geri emilim",
        "art": "vessel",
        "tone": "rose",
        "desc": "Geri emilen su ve maddeler tübüllerin çevresindeki damarlara geçer.",
        "tests": [],
        "limit": "Bu süreç tahlil sonuçlarından nicel olarak simüle edilmez."
      },
      {
        "title": "İdrar oluşumu",
        "short": "İdrar",
        "art": "drop",
        "tone": "peach",
        "desc": "Geri kazanılmayan su ve atık maddeler idrarı oluşturur; idrar analizi başka bir inceleme alanıdır.",
        "tests": [
          "uacr",
          "serum-urea",
          "bun"
        ],
        "limit": "Konsantrasyon, idrar hacmi ve örnek türü birbirinden farklı bilgilerdir."
      }
    ],
    "links": [
      [
        0,
        1
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ]
    ]
  },
  "blood": {
    "title": "Kanın dört bileşeni",
    "subtitle": "Hemogramdaki hücrelerin işlevini keşfet",
    "source": "https://www.hematology.org/education/patients/blood-basics",
    "organization": "American Society of Hematology · Blood Basics",
    "layout": "cells",
    "nodes": [
      {
        "title": "Eritrositler",
        "short": "Eritrosit",
        "art": "rbc",
        "tone": "rose",
        "desc": "Hemoglobin içeren eritrositler oksijen taşır. Hücre sayısı, hacmi ve hemoglobin miktarı farklı ölçümlerdir.",
        "tests": [
          "rbc",
          "hgb",
          "hct",
          "mcv",
          "mch",
          "mchc",
          "rdw",
          "rdwsd"
        ],
        "limit": "Tek eritrosit indeksi aneminin nedenini belirlemez."
      },
      {
        "title": "Lökositler",
        "short": "Lökosit",
        "art": "wbc",
        "tone": "lilac",
        "desc": "Beyaz kan hücreleri bağışıklık yanıtına katılır. Alt tiplerin mutlak sayısı ve yüzdesi ayrı değerlendirilir.",
        "tests": [
          "wbc",
          "neut",
          "lym",
          "neutpct",
          "lympct",
          "mono",
          "monopct",
          "eos",
          "eospct",
          "baso",
          "basopct"
        ],
        "limit": "Lökosit sayısının değişmesi tek başına enfeksiyon tanısı değildir."
      },
      {
        "title": "Trombositler",
        "short": "Trombosit",
        "art": "platelet",
        "tone": "peach",
        "desc": "Trombositler damar hasarında pıhtı oluşumuna katkı sağlar. Sayı ve hacim indeksleri farklı bilgiler taşır.",
        "tests": [
          "plt",
          "mpv",
          "pdw"
        ],
        "limit": "Trombosit sayısı pıhtılaşma işlevini bütünüyle ölçmez."
      },
      {
        "title": "Plazma",
        "short": "Plazma",
        "art": "drop",
        "tone": "mint",
        "desc": "Kanın sıvı bölümü proteinler, elektrolitler ve başka çözünmüş maddeler taşır.",
        "tests": [],
        "limit": "Bu alan hemogramdaki hücre sayılarını plazma biyokimyası ile birleştirmez."
      }
    ],
    "links": []
  },
  "liver": {
    "title": "Karaciğerin farklı işlevleri",
    "subtitle": "Hasar belirteçleri ile işlev ölçümleri aynı değildir",
    "source": "https://medlineplus.gov/lab-tests/liver-function-tests/",
    "organization": "MedlinePlus / NIH · Liver Function Tests",
    "layout": "cells",
    "nodes": [
      {
        "title": "Hücre enzimleri",
        "short": "Enzimler",
        "art": "liver",
        "tone": "peach",
        "desc": "ALT ve AST hücre hasarıyla değişebilen enzimlerdir. AST karaciğer dışında da bulunur.",
        "tests": [
          "alt",
          "ast"
        ],
        "limit": "Enzim düzeyi karaciğerin tüm işlevlerinin nicel ölçümü değildir."
      },
      {
        "title": "Safra yolları",
        "short": "Safra yolları",
        "art": "tube",
        "tone": "mint",
        "desc": "ALP ve GGT safra yolu kaynaklı değişikliklerin değerlendirilmesinde yardımcı olabilir; ALP kemik gibi başka kaynaklardan da gelebilir.",
        "tests": [
          "alp",
          "ggt"
        ],
        "limit": "Tek enzim sonucundan tıkanıklık tanısı konulamaz."
      },
      {
        "title": "Bilirubin işlenmesi",
        "short": "Bilirubin",
        "art": "drop",
        "tone": "peach",
        "desc": "Yaşlanan eritrositlerin yıkımı sırasında oluşan bilirubin karaciğerde işlenir ve atılır.",
        "tests": [
          "bilirubin",
          "direct-bili"
        ],
        "limit": "Bilirubin artışının karaciğer dışı nedenleri de olabilir."
      },
      {
        "title": "Protein sentezi",
        "short": "Proteinler",
        "art": "protein",
        "tone": "lilac",
        "desc": "Albümin karaciğerde üretilen bir proteindir; dolaşımda çeşitli maddelerin taşınmasına ve sıvı dengesine katkı sağlar.",
        "tests": [
          "albumin"
        ],
        "limit": "Albümin düzeyi beslenme, inflamasyon ve protein kaybından da etkilenebilir."
      }
    ],
    "links": []
  }
};

const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e}
function H(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e}
const colors={blue:['#dcecf8','#3c6d9a'],rose:['#f7e0e3','#ad5065'],mint:['#dcefe3','#33745c'],peach:['#faead6','#99652c'],lilac:['#ebe4f8','#755b9e']};
function symbol(g,art,x,y,ink){
 const q=S('g',{transform:'translate('+x+' '+y+')',fill:'none',stroke:ink,'stroke-width':2.8,'stroke-linecap':'round','stroke-linejoin':'round'});
 const add=(tag,a)=>q.append(S(tag,a));
 if(art==='heart')add('path',{d:'M0 15 C-10 6 -23 -4 -17 -15 C-12 -24 -3 -20 0 -13 C7 -24 20 -21 20 -9 C20 1 9 10 0 15Z',fill:ink,stroke:'none'});
 else if(art==='lungs'){add('path',{d:'M-4 -16V-3L-10 3M4 -16V-3L10 3M-6 -5C-20 -18 -23 2 -22 12C-18 22 -7 15 -6 6Z M6 -5C20 -18 23 2 22 12C18 22 7 15 6 6Z',fill:ink,'fill-opacity':.22});}
 else if(art==='vessel'){add('path',{d:'M-23 -9H23 M-23 9H23'});for(const cx of [-13,0,13])add('ellipse',{cx,cy:0,rx:4,ry:3,fill:ink});}
 else if(art==='filter'){add('circle',{cx:0,cy:0,r:21,'fill-opacity':.15,fill:ink});add('path',{d:'M-20 0C-5 -23 16 -18 9 1S-12 20 -8 0S20 -9 20 7'});}
 else if(art==='tube'){add('path',{d:'M-20 -15V7Q-20 19 -10 19Q0 19 0 7V-7Q0 -19 10 -19Q20 -19 20 -7V14','stroke-width':6});}
 else if(art==='drop'){add('path',{d:'M0 -23 C-9 -10 -17 -1 -17 8A17 17 0 0 0 17 8C17 -1 9 -10 0 -23Z',fill:ink,'fill-opacity':.26});}
 else if(art==='rbc'){for(const [cx,cy] of [[-9,-6],[10,8]]){add('ellipse',{cx,cy,rx:13,ry:8,fill:ink,'fill-opacity':.35});add('ellipse',{cx,cy,rx:5,ry:3});}}
 else if(art==='wbc'){add('circle',{cx:0,cy:0,r:21,fill:ink,'fill-opacity':.16});add('path',{d:'M-10 -5C-15 -18 3 -18 4 -9S19 -9 12 5S-5 17 -6 8Z',fill:ink,'fill-opacity':.65});}
 else if(art==='platelet'){for(const [cx,cy,r] of [[-12,-9,6],[9,-7,4],[2,9,7],[-13,10,3]])add('circle',{cx,cy,r,fill:ink,'fill-opacity':.7});}
 else if(art==='liver')add('path',{d:'M-25 -12Q-3 -26 23 -13Q28 -1 16 10L-3 17Q-23 13 -25 -12Z',fill:ink,'fill-opacity':.42});
 else if(art==='protein'){for(const [cx,cy] of [[-17,-8],[0,8],[17,-8]])add('circle',{cx,cy,r:7,fill:ink,'fill-opacity':.35});add('path',{d:'M-11 -3L-5 3 M5 3L11 -3'});}
 g.append(q);
}
export function physiologyView(group,rows){
 const spec=physiology[group];if(!spec)return null;
 const root=H('section',undefined,'physiology'),heading=H('div',undefined,'phys-head');heading.append(H('p','ETKİLEŞİMLİ FİZYOLOJİ','eyebrow'),H('h2',spec.title),H('p',spec.subtitle,'muted'));root.append(heading);
 const grid=H('div',undefined,'phys-grid'),figure=H('div',undefined,'phys-figure'),svg=S('svg',{viewBox:'0 0 440 310',role:'img','aria-label':spec.title+'. Şema ölçekli değildir. Ayrıntılar yanındaki düğmelerden seçilebilir.'});
 svg.append(S('rect',{x:0,y:0,width:440,height:310,rx:22,fill:'#f5f8f3'}));
 const positions=spec.layout==='cycle'?[[110,76],[330,76],[330,234],[110,234]]:[[110,76],[330,76],[110,234],[330,234]];
 const defs=S('defs'),marker=S('marker',{id:'phys-arrow-'+group,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto-start-reverse'});marker.append(S('path',{d:'M0 0L10 5L0 10Z',fill:'#76988a'}));defs.append(marker);svg.append(defs);
 const shorten=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),ax=Math.abs(dx/d),ay=Math.abs(dy/d),dist=Math.min(ax?75/ax:Infinity,ay?55/ay:Infinity);return [a[0]+dx/d*dist,a[1]+dy/d*dist,b[0]-dx/d*(dist+4),b[1]-dy/d*(dist+4)]};
 for(const [a,b] of spec.links){const [x1,y1,x2,y2]=shorten(positions[a],positions[b]);svg.append(S('line',{x1,y1,x2,y2,stroke:'#76988a','stroke-width':2.6,'marker-end':'url(#phys-arrow-'+group+')'}))}
 const groups=[];spec.nodes.forEach((node,i)=>{const [x,y]=positions[i],[bg,ink]=colors[node.tone],g=S('g',{'data-step':i,class:'phys-node'});g.append(S('rect',{x:x-75,y:y-55,width:150,height:110,rx:20,fill:bg,stroke:ink,'stroke-width':1.5}));symbol(g,node.art,x,y-11,ink);const label=S('text',{x,y:y+36,fill:'#233c36','text-anchor':'middle','font-size':13,'font-weight':700});label.textContent=node.short;g.append(label);const n=S('text',{x:x-57,y:y-33,fill:ink,'font-size':12,'font-weight':800});n.textContent=String(i+1);g.append(n);svg.append(g);groups.push(g)});
 figure.append(svg,H('p','Öğretici şema · anatomik ölçek veya kişisel organ simülasyonu değildir.','muted'));
 const right=H('div',undefined,'phys-right'),controls=H('div',undefined,'phys-controls'),detail=H('div',undefined,'phys-detail');detail.setAttribute('aria-live','polite');const buttons=[];
 function select(i){const node=spec.nodes[i];groups.forEach((g,j)=>g.classList.toggle('selected',i===j));buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));detail.replaceChildren();detail.append(H('p','ADIM '+(i+1)+' / '+spec.nodes.length,'eyebrow'),H('h3',node.title),H('p',node.desc));
 if(node.tests.length){const area=H('div',undefined,'phys-measures');for(const id of node.tests){const t=catalogue.find(t=>t[0]===id);if(!t)continue;const gs=latestGroups(rows.filter(r=>r.testId===id));if(!gs.length)continue;for(const g of gs){const line=H('div',undefined,'phys-measure');line.append(H('strong',t[1]),H('span',g.ambiguous?'Aynı gün '+g.latest.length+' kayıt':resultLabel(g.latest[0])),H('small',g.date+' · '+(g.latest[0].lab||'Lab. belirsiz')));area.append(line)}}detail.append(H('h4','İlişkili ölçümler'));if(!area.children.length)area.append(H('p','Bu adımla ilişkili kayıt henüz bulunmuyor.','muted'));detail.append(area)}
 detail.append(H('p',node.limit,'phys-limit'));}
 spec.nodes.forEach((node,i)=>{const b=H('button',(i+1)+'. '+node.short,'phys-control');b.type='button';b.setAttribute('aria-pressed','false');b.onclick=()=>select(i);controls.append(b);buttons.push(b)});
 right.append(controls,detail);grid.append(figure,right);root.append(grid);const source=H('a',spec.organization+' ↗','phys-source');source.href=spec.source;source.target='_blank';source.rel='noopener noreferrer';root.append(source);select(0);return root
}
