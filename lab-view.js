import {catalogue,norm} from './catalog.js';
import {status} from './core.js';
import {latestGroups,measurementKey} from './measurement.js';
import {filterPeriod} from './dashboard.js';
const byId=new Map(catalogue.map(t=>[t[0],t]));
const searchIndex=new Map(catalogue.map(t=>[t[0],norm([t[1],...t[3]].join(' '))]));
export const defaultLabView=()=>({mode:'latest',query:'',system:'all',state:'all',period:'all',sort:'date'});
export function rowCategory(r){return byId.get(r.testId)?.[2]||'other'}
export function searchMatch(r,query){const tokens=norm(query).split(/\s+/).filter(Boolean);if(!tokens.length)return true;const hay=norm([r.name,searchIndex.get(r.testId)||'',r.lab||'',r.method||'',r.unit||''].join(' '));return tokens.every(t=>hay.includes(t))}
export function stateFor(records){if(records.length!==1)return 'review';const s=status(records[0]);return s==='Aralık altında'||s==='Aralık üstünde'?'out':s==='Aralık içinde'?'in':'review'}
export function labView(rows,opts,end){
 const eligible=filterPeriod(rows,opts.period,end).filter(r=>(opts.system==='all'||rowCategory(r)===opts.system)&&searchMatch(r,opts.query));
 const grouped=opts.mode==='history'?eligible.map(r=>({key:measurementKey(r),date:r.date,records:[r],id:r.id})):latestGroups(eligible).map(g=>({key:g.key,date:g.date,records:g.latest,id:g.latest.length===1?g.latest[0].id:null}));
 const counts={all:grouped.length,out:0,in:0,review:0};for(const item of grouped){item.state=stateFor(item.records);counts[item.state]++}
 const items=grouped.filter(x=>opts.state==='all'||x.state===opts.state);
 items.sort((a,b)=>opts.sort==='name'?a.records[0].name.localeCompare(b.records[0].name,'tr')||b.date.localeCompare(a.date)||a.key.localeCompare(b.key):b.date.localeCompare(a.date)||a.records[0].name.localeCompare(b.records[0].name,'tr')||a.key.localeCompare(b.key));
 return {items,counts,eligible:eligible.length};
}
export function byDay(rows){const days=new Map();for(const r of rows){const day=days.get(r.date)||[];day.push(r);days.set(r.date,day)}return [...days.entries()].sort((a,b)=>b[0].localeCompare(a[0])).map(([date,records])=>({date,records}))}
