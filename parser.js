import {catalogue,norm} from './catalog.js';
const aliases={
 'mg/dL':['mg/dl','mg/dℓ'], 'g/dL':['g/dl'], 'ng/mL':['ng/ml'], 'pg/mL':['pg/ml'],
 'µg/dL':['ug/dL','μg/dL','mcg/dL','µg/dl'], 'µg/L':['ug/L','μg/L','mcg/L'],
 'µmol/L':['umol/L','μmol/L'], 'µIU/mL':['uIU/mL','μIU/mL','µIU/ml'],
 'mmol/L':['mmol/l'], 'mIU/L':['mIU/l'], 'pmol/L':['pmol/l'], 'nmol/L':['nmol/l'],
 '10^3/µL':['10³/µL','10³/uL','10³/μL','10^3/uL','10^3/μL','x10^3/µL','x10^3/uL','x10^3/μL','×10³/µL','10*3/uL'],
 '10^6/µL':['10⁶/µL','10⁶/uL','10⁶/μL','10^6/uL','10^6/μL','x10^6/µL','x10^6/uL','x10^6/μL','×10⁶/µL','10*6/uL'],
 '10^9/L':['10⁹/L','x10^9/L','×10⁹/L','10*9/L'],
 '10^12/L':['10¹²/L','x10^12/L','×10¹²/L','10*12/L'],
 'K/µL':['K/uL','K/μL'], 'M/µL':['M/uL','M/μL'],
 'mL/min/1.73 m²':['mL/min/1.73m²','mL/min/1.73 m2','mL/dk/1.73 m²','mL/dk/1.73 m2','mL/dk/1.73m2']
};
const unitSyntax=s=>String(s??'').trim().replace(/\s*\/\s*/g,'/').replace(/\s+/g,' ');
export function normalizeUnit(raw,allowed){
 const u=unitSyntax(raw);const matches=allowed.filter(x=>[x,...(aliases[x]||[])].some(a=>unitSyntax(a)===u));
 return matches.length===1?matches[0]:null;
}
function num(s){const t=String(s??'').trim();if(!/^-?\d+(?:[.,]\d+)?$/.test(t))return null;const n=Number(t.replace(',','.'));return Number.isFinite(n)?n:null}
const names=catalogue.flatMap(t=>[t[1],...t[3]].map(a=>({t,a}))).sort((a,b)=>b.a.length-a.a.length);
const flagPattern='H|L|Y|D|Yüksek|Düşük|\\*';
const headPattern=new RegExp('^(?:('+flagPattern+')\\s+)?(-?\\d+(?:[.,]\\d+)?)(?:\\s+('+flagPattern+'))?\\s+(.+)$','i');
const trailingFlag=new RegExp('(?:^|\\s)('+flagPattern+')$','i');
export function parseLine(line){
 const raw=String(line).trim();if(!raw||raw.length>500)return null;
 const text=unitSyntax(raw);const found=[];
 for(const {t,a} of names){
  const name=unitSyntax(a);if(norm(text.slice(0,name.length))!==norm(name)||!/\s/.test(text.charAt(name.length)))continue;
  const rest=text.slice(name.length).trim(),m=rest.match(headPattern);if(!m||m[1]&&m[3])continue;
  const rawValue=num(m[2]);if(rawValue===null)continue;
  const unitCandidates=t[4].flatMap(u=>[u,...(aliases[u]||[])].map(raw=>({u,raw:unitSyntax(raw)}))).sort((a,b)=>b.raw.length-a.raw.length);
  for(const candidate of unitCandidates){
   if(!m[4].startsWith(candidate.raw)||m[4].length>candidate.raw.length&&!/\s/.test(m[4].charAt(candidate.raw.length)))continue;
   const unit=normalizeUnit(candidate.raw,t[4]);if(!unit)continue;
   let suffix=m[4].slice(candidate.raw.length).trim(),reportedFlag=m[1]||m[3]||'',low=null,high=null;
   const flag=suffix.match(trailingFlag);if(flag){if(reportedFlag)continue;reportedFlag=flag[1];suffix=suffix.slice(0,flag.index).trim()}
   if(suffix){const bounds=suffix.match(/^(-?\d+(?:[.,]\d+)?)\s*[-–−]\s*(-?\d+(?:[.,]\d+)?)$/);if(!bounds)continue;low=num(bounds[1]);high=num(bounds[2]);if(low===null||high===null||low>high)continue;}
   found.push({testId:t[0],name:t[1],value:rawValue,unit,rawUnit:candidate.raw,reportedFlag,low,high,raw});
  }
 }
 const distinct=new Map(found.map(r=>[JSON.stringify([r.testId,r.value,r.unit,r.low,r.high,r.reportedFlag]),r]));
 return distinct.size===1?[...distinct.values()][0]:null;
}
export function parseRows(rows){const recognized=[],unresolved=[];for(const {text,page} of rows){if(!text.trim())continue;const r=parseLine(text);if(r)recognized.push({...r,page});else unresolved.push({text,page});}return {recognized,unresolved}}

export async function extractPDF(file,onProgress=()=>{}){
 if(!file||file.size>20*1024*1024)throw Error('PDF en fazla 20 MB olabilir.');
 const data=new Uint8Array(await file.arrayBuffer());
 if(new TextDecoder().decode(data.slice(0,5))!=='%PDF-')throw Error('Geçerli bir PDF dosyası seç.');
 let pdfjs;
 try{pdfjs=await import('./vendor/pdf.mjs')}catch{throw Error('PDF motoru bu yayında henüz kurulu değil. Metin içe aktarma kullanılabilir.')}
 pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf.worker.mjs',import.meta.url).href;
 const task=pdfjs.getDocument({data,isEvalSupported:false,enableXfa:false,cMapUrl:new URL('./vendor/cmaps/',import.meta.url).href,cMapPacked:true,standardFontDataUrl:new URL('./vendor/standard_fonts/',import.meta.url).href,wasmUrl:new URL('./vendor/wasm/',import.meta.url).href});
 try{
 const doc=await task.promise;if(doc.numPages>50)throw Error('En fazla 50 sayfalık PDF desteklenir.');
 const rows=[];
 for(let page=1;page<=doc.numPages;page++){
 onProgress(page,doc.numPages);const pg=await doc.getPage(page),tc=await pg.getTextContent();
 const bands=[];
 for(const item of tc.items){if(!('str' in item)||!item.str.trim())continue;const [, , , ,x,y]=item.transform;let band=bands.find(b=>Math.abs(b.y-y)<=2);if(!band){band={y,items:[]};bands.push(band)}band.items.push({x,text:item.str});}
 bands.sort((a,b)=>b.y-a.y);for(const b of bands){rows.push({page,text:b.items.sort((a,b)=>a.x-b.x).map(i=>i.text).join(' ').trim()});}
 pg.cleanup();
 }
 if(!rows.length)throw Error('Metin bulunamadı. Taranmış PDF/OCR henüz desteklenmiyor.');
 return parseRows(rows);
 }finally{await task.destroy()}
}
export function parseText(text){if(text.length>200000)throw Error('Metin çok uzun.');return parseRows(text.split(/\r?\n/).map(text=>({text,page:null})))}
