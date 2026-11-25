import {catalogue,norm} from './catalog.js';
export const comparators=['','<','<=','>','>='];
export const comparatorText=c=>({'<=':'≤','>=':'≥'}[c]||c||'');
export const comparatorCode=c=>({'≤':'<=','≥':'>='}[c]||c||'');
const words=['Negatif','Pozitif','Negative','Positive','Eser','Trace','1+','2+','3+','4+','+','++','+++','++++'];
export function isQualitativeTest(id){return catalogue.some(t=>t[0]===id&&t[4].length===0)}
export function qualitativeValue(text,id){const s=String(text??'').trim();const allowed=id==='urine-nitrite'?words.slice(0,4):words;return allowed.some(w=>norm(w)===norm(s))?s:null}
export function parseResult(input,testId){
 const text=String(input??'').trim();
 if(isQualitativeTest(testId)){const v=qualitativeValue(text,testId);return v===null?null:{value:null,comparator:'',resultText:v}}
 const m=text.match(/^(<=|>=|<|>|≤|≥)?\s*(-?\d+(?:[.,]\d+)?)$/);
 if(!m)return null;const value=Number(m[2].replace(',','.'));if(!Number.isFinite(value))return null;
 return {value,comparator:comparatorCode(m[1]),resultText:''};
}
export const exact=r=>Number.isFinite(r?.value)&&!(r.comparator||r.resultText);
export function resultLabel(r){if(r.resultText)return r.resultText;return comparatorText(r.comparator)+String(r.value)+(r.unit&&r.unit!=='1'?' '+r.unit:'')}
export function inputResult(r){return !r?'':r.resultText||comparatorText(r.comparator)+String(r.value)}
export function validResult(r){
 if(!comparators.includes(r.comparator??'')||typeof (r.resultText??'')!=='string')return false;
 if(r.resultText)return isQualitativeTest(r.testId)&&qualitativeValue(r.resultText,r.testId)!==null&&r.value===null&&!r.comparator&&r.unit===''&&r.low===null&&r.high===null;
 if(isQualitativeTest(r.testId)||!Number.isFinite(r.value)||typeof r.unit!=='string'||!r.unit.trim()||r.unit.length>80)return false;
 if(r.unit==='1'&&r.testId&& !catalogue.find(t=>t[0]===r.testId)?.[4].includes('1'))return false;
 return true;
}
export function referenceTextValid(text){return typeof text==='string'&&text.length<=160&&!/[\r\n]/.test(text)}
export function safeReference(r){if(r.referenceText)return r.referenceText;if(Number.isFinite(r.low)&&Number.isFinite(r.high))return r.low+' – '+r.high;return ''}
export function measurementKey(r){return JSON.stringify([r.testId||r.name,r.unit,r.lab||'',r.method||''])}
export function latestGroups(rows){
 const groups=new Map();for(const r of rows){const k=measurementKey(r),a=groups.get(k)||[];a.push(r);groups.set(k,a)}
 return [...groups.entries()].map(([key,all])=>{const dates=[...new Set(all.map(r=>r.date))].sort().reverse(),latest=all.filter(r=>r.date===dates[0]);return {key,all,latest,ambiguous:latest.length!==1,date:dates[0]}}).sort((a,b)=>b.date.localeCompare(a.date)||a.key.localeCompare(b.key))
}
export function changeSummary(group){
 if(!group||group.ambiguous||!exact(group.latest[0]))return null;
 const previousDates=[...new Set(group.all.filter(r=>r.date<group.date).map(r=>r.date))].sort().reverse();
 if(!previousDates.length)return null;const previous=group.all.filter(r=>r.date===previousDates[0]);
 if(previous.length!==1||!exact(previous[0]))return null;
 const delta=group.latest[0].value-previous[0].value;
 return {delta:Number(delta.toPrecision(12)),previous:previous[0],current:group.latest[0]};
}
