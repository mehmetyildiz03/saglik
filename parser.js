import {catalogue,norm} from './catalog.js';
import {parseResult,isQualitativeTest,qualitativeValue} from './measurement.js';
const aliases={
 'mg/dL':['mg/dl','mg/dℓ'], 'g/dL':['g/dl'], 'ng/mL':['ng/ml'], 'pg/mL':['pg/ml'],
 'mg/L':['mg/l'], 'g/L':['g/l'], 'ng/dL':['ng/dl'], 'mEq/L':['mEq/l'], 'U/L':['U/l'], 'IU/L':['IU/l'],
 'µg/dL':['ug/dL','μg/dL','mcg/dL','µg/dl'], 'µg/L':['ug/L','μg/L','mcg/L'],
 'µmol/L':['umol/L','μmol/L'], 'µIU/mL':['uIU/mL','μIU/mL','µIU/ml'],
 'mmol/L':['mmol/l'], 'mIU/L':['mIU/l'], 'pmol/L':['pmol/l'], 'nmol/L':['nmol/l'],
 '10^3/µL':['10³/µL','10³/uL','10³/μL','10^3/uL','10^3/μL','x10^3/µL','x10^3/uL','x10^3/μL','×10³/µL','10*3/uL'],
 '10^6/µL':['10⁶/µL','10⁶/uL','10⁶/μL','10^6/uL','10^6/μL','x10^6/µL','x10^6/uL','x10^6/μL','×10⁶/µL','10*6/uL'],
 '10^9/L':['10⁹/L','x10^9/L','×10⁹/L','10*9/L'],
 '10^12/L':['10¹²/L','x10^12/L','×10¹²/L','10*12/L'],
 '/HPF':['/hpf'], 'hücre/µL':['hücre/uL','hücre/μL'],
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
const headPattern=new RegExp('^(?:('+flagPattern+')\\s+)?((?:<=|>=|<|>|≤|≥)?\\s*-?\\d+(?:[.,]\\d+)?)(?:\\s+('+flagPattern+'))?(?:\\s+(.+))?$','i');
const trailingFlag=new RegExp('(?:^|\\s)('+flagPattern+')$','i');
function parseReference(suffix){
 if(suffix&&/^(?:Ref\.?|Referans(?: aralığı)?)\s*:/iu.test(suffix)){suffix=suffix.replace(/^(?:Ref\.?|Referans(?: aralığı)?)\s*:\s*/iu,'');if(!suffix)return null}
 if(!suffix)return {low:null,high:null,referenceText:''};
 const b=suffix.match(/^(-?\d+(?:[.,]\d+)?)\s*[-–−]\s*(-?\d+(?:[.,]\d+)?)$/);
 if(b){const low=num(b[1]),high=num(b[2]);return low!==null&&high!==null&&low<=high?{low,high,referenceText:''}:null}
 if(/^(?:<=|>=|<|>|≤|≥)\s*-?\d+(?:[.,]\d+)?$/.test(suffix))return {low:null,high:null,referenceText:suffix};
 return null;
}
export function parseLine(line){
 const raw=String(line).trim();if(!raw||raw.length>500)return null;
 const text=raw.replace(/\s+/g,' ');const found=[];
 for(const {t,a} of names){
  const name=a.trim().replace(/\s+/g,' ');if(norm(text.slice(0,name.length))!==norm(name)||!/[ :]/.test(text.charAt(name.length)))continue;
  const rest=text.slice(name.length).trim().replace(/^:\s*/,'');
  if(isQualitativeTest(t[0])){
   const fields=rest.split(/\s+(?:Ref\.?|Referans)\s*:\s*/i);if(fields.length>2)continue;
   const result=qualitativeValue(fields[0],t[0]);const ref=fields[1]===undefined?'':qualitativeValue(fields[1],t[0]);
   if(result===null||ref===null)continue;
   found.push({testId:t[0],name:t[1],value:null,comparator:'',resultText:result,unit:'',rawUnit:'',reportedFlag:'',low:null,high:null,referenceText:ref,raw});continue;
  }
  const m=rest.match(headPattern);if(!m||m[1]&&m[3])continue;
  const result=parseResult(m[2],t[0]);if(!result)continue;
  const remainder=unitSyntax(m[4]||'');
  const unitCandidates=t[4].filter(u=>u!=='1').flatMap(u=>[u,...(aliases[u]||[])].map(raw=>({u,raw:unitSyntax(raw)}))).sort((a,b)=>b.raw.length-a.raw.length);
  if(t[4].includes('1'))unitCandidates.push({u:'1',raw:''});
  for(const candidate of unitCandidates){
   if(candidate.raw&&(!remainder.startsWith(candidate.raw)||remainder.length>candidate.raw.length&&!/\s/.test(remainder.charAt(candidate.raw.length))))continue;
   const unit=candidate.u==='1'?'1':normalizeUnit(candidate.raw,t[4]);if(!unit)continue;
   let suffix=remainder.slice(candidate.raw.length).trim(),reportedFlag=m[1]||m[3]||'';
   const flag=suffix.match(trailingFlag);if(flag){if(reportedFlag)continue;reportedFlag=flag[1];suffix=suffix.slice(0,flag.index).trim()}
   const reference=parseReference(suffix);if(!reference)continue;
   found.push({testId:t[0],name:t[1],...result,unit,rawUnit:candidate.raw,reportedFlag,...reference,raw});
  }
 }
 const distinct=new Map(found.map(r=>[JSON.stringify([r.testId,r.value,r.comparator,r.resultText,r.unit,r.low,r.high,r.referenceText,r.reportedFlag]),r]));
 return distinct.size===1?[...distinct.values()][0]:null;
}
export function unresolvedReason(line){
 const raw=String(line).trim(),text=raw.replace(/\s+/g,' ');if(raw.length>500)return 'long';
 const known=names.some(({a})=>{const n=a.trim().replace(/\s+/g,' ');return norm(text.slice(0,n.length))===norm(n)&&(text.length===n.length||/[ :]/.test(text.charAt(n.length)))});
 return known?'fields':'identity'
}
export function parseRows(rows){const recognized=[],unresolved=[];let count=0;for(const {text,page} of rows){if(!text.trim())continue;if(++count>10000)throw Error('Rapor 10.000 metin satırı sınırını aşıyor. Daha küçük parçalara ayır. Hiçbir kayıt kaydedilmedi.');const r=parseLine(text);if(r)recognized.push({...r,page});else unresolved.push({text,page,reason:unresolvedReason(text)});}return {recognized,unresolved}}
export function repairLine(source,edited){
 if(!source||typeof source.text!=='string'||!source.text.trim()||source.text.length>500)return null;
 const parsed=parseLine(edited);if(!parsed)return null;
 // The edited text is not the original report. Keep original raw line and page, do not invent original flags/units.
 return {...parsed,page:source.page??null,raw:source.text,rawUnit:'',reportedFlag:'',repaired:true}
}
export function pdfTextRows(items,page){
 const tokens=items.filter(i=>typeof i?.str==='string'&&i.str.trim()&&Number.isFinite(i.transform?.[4])&&Number.isFinite(i.transform?.[5])).map(i=>({x:i.transform[4],y:i.transform[5],text:i.str}));
 tokens.sort((a,b)=>b.y-a.y||a.x-b.x);const bands=[];
 for(const token of tokens){let band=bands.at(-1);if(!band||Math.abs(band.y-token.y)>2){band={y:token.y,items:[]};bands.push(band)}band.items.push(token)}
 return bands.map(b=>({page,text:b.items.sort((a,b)=>a.x-b.x).map(i=>i.text).join(' ').trim()}))
}

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
 const rows=[],emptyPages=[];
 for(let page=1;page<=doc.numPages;page++){
 onProgress(page,doc.numPages);const pg=await doc.getPage(page),tc=await pg.getTextContent();
 const pageRows=pdfTextRows(tc.items,page);if(!pageRows.length)emptyPages.push(page);for(const row of pageRows){if(rows.length>=10000)throw Error('Rapor 10.000 metin satırı sınırını aşıyor. Daha küçük parçalara ayır.');rows.push(row)}
 pg.cleanup();
 }
 if(!rows.length)throw Error('Metin bulunamadı. Taranmış PDF/OCR henüz desteklenmiyor.');
 return {...parseRows(rows),pageCount:doc.numPages,emptyPages};
 }finally{await task.destroy()}
}
export function parseText(text){if(text.length>200000)throw Error('Metin çok uzun.');return parseRows(text.split(/\r?\n/).map(text=>({text,page:null})))}
