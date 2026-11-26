import {parseResult,inputResult,referenceTextValid,isQualitativeTest,resultLabel,safeReference} from './measurement.js';
import {catalogue,norm} from './catalog.js';
import {normalizeUnit,repairLine} from './parser.js';
import {parseNumber,validDate} from './core.js';
export const REVIEW_PAGE=40;
export const reasons={long:'Satır 500 karakterden uzun; özgün kaynak güvenle saklanamıyor.',identity:'Tahlil adı kesin eşleşmedi veya bu satır başlık/açıklama.',fields:'Tahlil adı tanındı; sonuç, birim veya referans ayrıştırılamadı.'};
export function newReview(result){
 return {rows:result.recognized.map(r=>draft(r)),unresolved:result.unresolved.map((r,i)=>({...r,id:i,repaired:false})),common:{date:'',lab:'',method:''}}
}
function draft(r){return {r,value:inputResult(r),unit:r.unit,low:String(r.low??''),high:String(r.high??''),refText:r.referenceText||'',rowDate:'',approved:false}}
export function revise(row,key,value){if(!['value','unit','low','high','refText','rowDate'].includes(key))return;row[key]=value;row.approved=false}
export function reviseCommon(state,key,value){if(!['date','lab','method'].includes(key))return;state.common[key]=value;for(const row of state.rows)row.approved=false}
export function stageRepair(state,id,line){
 const source=state.unresolved.find(r=>r.id===id&&!r.repaired);if(!source)return null;const r=repairLine(source,line);if(!r)return null;
 const row=draft(r);state.rows.push(row);source.repaired=true;return row
}
export function reviewValue(row,common){
 const r=row.r,t=catalogue.find(t=>t[0]===r.testId),qual=isQualitativeTest(r.testId),parsed=parseResult(row.value,r.testId),date=row.rowDate||common.date,refText=String(row.refText).trim(),bounds=!!(row.low.trim()||row.high.trim()),low=parseNumber(row.low),high=parseNumber(row.high),unit=qual?'':normalizeUnit(row.unit||(t?.[4].length===1&&t[4][0]==='1'?'1':''),t?.[4]||[]);
 if(!t||!parsed)return {error:'Sonuç veya tahlil kimliği geçersiz.'};
 if(qual&&row.unit.trim()||!qual&&!unit)return {error:'Birim bu tahlille uyumlu değil.'};
 if(!referenceTextValid(refText)||bounds&&(low===null||high===null||low>high||qual||!!refText))return {error:'Rapor referansını kontrol et.'};
 if(!validDate(date))return {error:'Ölçüm tarihi gerekli.',parsed:{...parsed,unit,low,high,referenceText:refText}};
 return {parsed:{...parsed,unit,low,high,referenceText:refText},date}
}
export function reviewQuery(state,{query='',page='all',filter='all'}={}){
 const q=norm(query);return state.rows.filter(row=>(page==='all'||String(row.r.page??'text')===page)&&(filter==='all'||filter==='approved'&&row.approved||filter==='pending'&&!row.approved||filter==='repaired'&&row.r.repaired)&&(!q||norm(row.r.name+' '+row.r.testId+' '+row.r.raw).includes(q)))
}
export function unresolvedQuery(state,query='',page='all'){
 const q=norm(query);return state.unresolved.filter(r=>!r.repaired&&(page==='all'||String(r.page??'text')===page)&&(!q||norm(r.text).includes(q)))
}
export function reviewPage(rows,page){const count=Math.max(1,Math.ceil(rows.length/REVIEW_PAGE)),index=Math.max(0,Math.min(count-1,page));return {rows:rows.slice(index*REVIEW_PAGE,(index+1)*REVIEW_PAGE),index,count,total:rows.length}}
export function reviewDisplay(row,common){const checked=reviewValue(row,common);return {error:checked.error||'',value:checked.parsed?resultLabel(checked.parsed):row.value,reference:checked.parsed?safeReference(checked.parsed):''}}
