import {catalogue,norm,systems} from './catalog.js';
// Reference terms for the selected catalog extension. Never used as assigned patient-result LOINC codes.
export const termReferences={
  "serum-tibc": {
    "code": "2500-7",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-uibc": {
    "code": "2501-5",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-transferrin": {
    "code": "3034-6",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-tsat": {
    "code": "2502-3",
    "sample": "Serum",
    "property": "Kütle oranı",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-cystatin-c": {
    "code": "33863-2",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-lipase": {
    "code": "3040-3",
    "sample": "Serum",
    "property": "Enzim aktivitesi / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-amylase": {
    "code": "1798-8",
    "sample": "Serum",
    "property": "Enzim aktivitesi / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-ck": {
    "code": "2157-6",
    "sample": "Serum",
    "property": "Enzim aktivitesi / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-ipth": {
    "code": "2731-8",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-protein-total": {
    "code": "2885-2",
    "sample": "Serum",
    "property": "Kütle / hacim",
    "scope": "Yalnız açık serum ifadesi. LOINC kaynak terimi serum/plazma; raporun örnek ve yöntem bilgisi ayrıca doğrulanmalı."
  },
  "serum-ldh-lp": {
    "code": "14804-9",
    "sample": "Serum",
    "property": "Enzim aktivitesi / hacim",
    "scope": "Reaksiyon yönü açıkça belirtilmeli; diğer LDH yöntemiyle birleştirilmez."
  },
  "serum-ldh-pl": {
    "code": "14805-6",
    "sample": "Serum",
    "property": "Enzim aktivitesi / hacim",
    "scope": "Reaksiyon yönü açıkça belirtilmeli; diğer LDH yöntemiyle birleştirilmez."
  }
};

export function catalogInfo(id){const t=catalogue.find(t=>t[0]===id);if(!t)return null;const source=termReferences[id]||null;return {id:t[0],name:t[1],system:t[2],aliases:[...new Set(t[3])],units:[...t[4]],source}}
export function catalogSearch(query='',group='all',kind='all'){const q=norm(query);return catalogue.filter(t=>(group==='all'||t[2]===group)&&(kind==='all'||kind==='linked'&&!!termReferences[t[0]]||kind==='qualitative'&&!t[4].length)&&(!q||norm([t[0],t[1],...t[3],...t[4],termReferences[t[0]]?.code||''].join(' ')).includes(q))).map(t=>catalogInfo(t[0]))}
const E=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n};
function select(root,name,label,options){const l=E('label',label),s=E('select');s.name=name;for(const [v,t] of options){const o=E('option',t);o.value=v;s.append(o)}l.append(s);root.append(l);return s}
export function terminologyInfo(id,{compact=false}={}){const info=catalogInfo(id);if(!info)return null;const p=E('section',undefined,'term-info');p.append(E('p',info.units.length?'Katalog birimleri: '+info.units.join(' · '):'Nitel sonuç · Sayısal birim yok','term-unit-list'));if(info.source){const a=E('a','LOINC kaynak terimi '+info.source.code+' ↗');a.href='https://loinc.org/'+info.source.code+'/';a.target='_blank';a.rel='noopener noreferrer';p.append(E('p','Örnek: '+info.source.sample+' · '+info.source.property,'muted'),a);if(!compact)p.append(E('p',info.source.scope+' Bu bağlantı kayıt için atanmış LOINC kodu değildir.','muted'));else if(info.id.startsWith('serum-ldh'))p.append(E('p','Reaksiyon yönü zorunlu.','muted'))}else if(!compact)p.append(E('p','Ölçüm kimliği Pera kataloğuna aittir; LOINC eşlemesi henüz doğrulanmadı.','muted'));return p}
export function catalogueView(root){
 const p=E('section',undefined,'panel catalog-explorer');p.append(E('h2','Tahlil kataloğu'),E('p','Desteklenen tahlil adları ve birimler. Kaynak terimleri araştırma bağlantılarıdır; hasta kayıtlarına otomatik LOINC kodu atanmaz. Serum ibareli tahlillerde örnek türü doğrulanmalıdır. Bunlar referans aralığı veya tanı eşiği değildir.','muted'));
 const controls=E('div',undefined,'catalog-controls'),l=E('label','Tahlil ara'),q=E('input');q.type='search';q.name='catalogSearch';q.placeholder='Örn. TIBC, sistatin C, 2500-7';l.append(q);controls.append(l);
 const group=select(controls,'catalogSystem','Sistem',[['all','Tüm sistemler'],...systems.map(s=>[s[0],s[1]])]),kind=select(controls,'catalogKind','Tür',[['all','Tüm tahliller'],['linked','LOINC kaynak terimi bulunan'],['qualitative','Nitel sonuçlar']]);p.append(controls);
 const count=E('p',undefined,'catalog-count');count.setAttribute('role','status');const list=E('div',undefined,'catalog-grid'),pager=E('div',undefined,'catalog-pager');p.append(count,list,pager);let page=0;
 function draw(){const items=catalogSearch(q.value,group.value,kind.value),max=Math.max(1,Math.ceil(items.length/12));page=Math.max(0,Math.min(page,max-1));count.textContent=items.length+' desteklenen tahlil · Sayfa '+(page+1)+' / '+max;list.replaceChildren();pager.replaceChildren();for(const info of items.slice(page*12,(page+1)*12)){const card=E('article',undefined,'catalog-item');card.dataset.system=info.system;card.append(E('small',systems.find(s=>s[0]===info.system)?.[1]||'Diğer','catalog-system'),E('h3',info.name),terminologyInfo(info.id,{compact:true}));const d=E('details');d.append(E('summary','Rapor adı / kısaltma örnekleri'),E('p',info.aliases.join(' · '),'muted'));card.append(d);list.append(card)}if(!items.length)list.append(E('p','Bu aramaya uygun tahlil yok. Örnek türü belirsiz sonuçlar otomatik eşleştirilmez.','empty'));for(const [label,delta,disabled] of [['← Önceki',-1,page===0],['Sonraki →',1,page===max-1]]){const b=E('button',label,'quiet');b.type='button';b.disabled=disabled;b.onclick=()=>{page+=delta;draw();pager.querySelector('button:not(:disabled)')?.focus()};pager.append(b)}pager.hidden=max===1}
 q.oninput=group.onchange=kind.onchange=()=>{page=0;draw()};draw();root.append(p);return p
}
