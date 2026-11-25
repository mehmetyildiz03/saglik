import {catalogue,norm} from './catalog.js';
function num(s){const t=String(s??'').trim();if(!/^-?\d+(?:[.,]\d+)?$/.test(t))return null;const n=Number(t.replace(',','.'));return Number.isFinite(n)?n:null}
export function parseLine(line){const text=String(line).trim().replace(/\s+/g,' ');const candidates=catalogue.flatMap(t=>[t[1],...t[3]].map(a=>({t,a}))).sort((a,b)=>b.a.length-a.a.length);for(const {t,a} of candidates){if(norm(text.slice(0,a.length))!==norm(a)||!/\s/.test(text.charAt(a.length)))continue;const rest=text.slice(a.length).trim();const m=rest.match(/^(-?\d+(?:[.,]\d+)?)\s+(.+)$/);if(!m)continue;for(const unit of [...t[4]].sort((x,y)=>y.length-x.length)){if(m[2].slice(0,unit.length)!==unit)continue;const tail=m[2].slice(unit.length).trim();if(tail&&!/^\s/.test(m[2].slice(unit.length)))continue;let low=null,high=null;if(tail){const bounds=tail.match(/^(-?\d+(?:[.,]\d+)?)\s*[-–]\s*(-?\d+(?:[.,]\d+)?)$/);if(!bounds)continue;low=num(bounds[1]);high=num(bounds[2]);if(low===null||high===null||low>high)continue;}return {testId:t[0],name:t[1],value:num(m[1]),unit,low,high,raw:text};}}return null}
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
