import {catalogue} from './catalog.js';
import {latestGroups,exact} from './measurement.js';
export const moduleNames={watch:'Takip listem',systems:'Sağlık sistemleri',trend:'Ölçüm grafiği',activity:'Son kayıtlar'};
const allowed=Object.keys(moduleNames),ids=new Set(catalogue.map(t=>t[0]));
export const defaultDashboard=()=>({modules:[...allowed],pins:['ldl','hgb','a1c','creat']});
export function validDashboard(d){
 return !!d&&Array.isArray(d.modules)&&d.modules.length>=1&&d.modules.length<=allowed.length&&new Set(d.modules).size===d.modules.length&&d.modules.every(id=>allowed.includes(id))&&Array.isArray(d.pins)&&d.pins.length<=8&&new Set(d.pins).size===d.pins.length&&d.pins.every(id=>ids.has(id));
}
export function dashboardFor(profile){return profile.dashboard&&validDashboard(profile.dashboard)?{modules:[...profile.dashboard.modules],pins:[...profile.dashboard.pins]}:defaultDashboard()}
export function moveItem(values,index,delta){const next=[...values],to=index+delta;if(index>=0&&index<next.length&&to>=0&&to<next.length)[next[index],next[to]]=[next[to],next[index]];return next}
export function pinGroups(rows,testId){return latestGroups(rows.filter(r=>r.testId===testId))}
export function countCoverage(rows,known){const observed=new Set(rows.map(r=>r.testId));return {present:known.filter(t=>observed.has(t[0])).length,total:known.length}}
export function rangeBand(rows){
 if(!rows.length||!rows.every(r=>exact(r)&&!r.referenceText&&Number.isFinite(r.low)&&Number.isFinite(r.high)&&r.low<r.high))return null;
 const {low,high}=rows[0];return rows.every(r=>r.low===low&&r.high===high)?{low,high}:null
}
export function filterPeriod(rows,days,end){
 if(days==='all')return [...rows];if(![30,90,365].includes(Number(days))||!(/^\d{4}-\d{2}-\d{2}$/).test(end))return [];
 const start=new Date(end+'T00:00:00Z');start.setUTCDate(start.getUTCDate()-Number(days)+1);const iso=start.toISOString().slice(0,10);
 return rows.filter(r=>r.date>=iso&&r.date<=end)
}
