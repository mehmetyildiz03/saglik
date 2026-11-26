import {catalogue,norm} from './catalog.js';
import {status,validDate} from './core.js';
import {latestGroups,measurementKey,changeSummary,exact} from './measurement.js';
import {filterPeriod} from './dashboard.js';
const byId=new Map(catalogue.map(t=>[t[0],t]));
const searchIndex=new Map(catalogue.map(t=>[t[0],norm([t[1],...t[3]].join(' '))]));
export const defaultLabView=()=>({mode:'latest',query:'',system:'all',state:'all',period:'all',sort:'system',day:'all',pinnedOnly:false,graphFocus:'',graphPage:0,graphBand:true});
export function rowCategory(r){return byId.get(r.testId)?.[2]||'other'}
export function searchMatch(r,query){const tokens=norm(query).split(/\s+/).filter(Boolean);if(!tokens.length)return true;const hay=norm([r.name,searchIndex.get(r.testId)||'',r.lab||'',r.method||'',r.unit||''].join(' '));return tokens.every(t=>hay.includes(t))}
export function stateFor(records){if(records.length!==1)return 'review';const s=status(records[0]);return s==='Aralık altında'||s==='Aralık üstünde'?'out':s==='Aralık içinde'?'in':'review'}
export function visibleScope(rows,opts){return opts.pinnedOnly?rows.filter(r=>Array.isArray(opts.pinIds)&&opts.pinIds.includes(r.testId)):rows}
export function labView(rows,opts,end){
 const eligible=filterPeriod(visibleScope(rows,opts),opts.period,end).filter(r=>(opts.system==='all'||rowCategory(r)===opts.system)&&searchMatch(r,opts.query)&&(opts.mode!=='history'||!opts.day||opts.day==='all'||r.date===opts.day));
 const grouped=opts.mode==='history'?eligible.map(r=>({key:measurementKey(r),date:r.date,records:[r],id:r.id})):latestGroups(eligible).map(g=>({key:g.key,date:g.date,records:g.latest,id:g.latest.length===1?g.latest[0].id:null,change:changeSummary(g),history:g.all}));
 const counts={all:grouped.length,out:0,in:0,review:0};for(const item of grouped){item.state=stateFor(item.records);counts[item.state]++}
 const items=grouped.filter(x=>opts.state==='all'||x.state===opts.state);
 items.sort((a,b)=>opts.sort==='name'?a.records[0].name.localeCompare(b.records[0].name,'tr')||b.date.localeCompare(a.date)||a.key.localeCompare(b.key):b.date.localeCompare(a.date)||a.records[0].name.localeCompare(b.records[0].name,'tr')||a.key.localeCompare(b.key));
 return {items,counts,eligible:eligible.length};
}
export function byDay(rows){const days=new Map();for(const r of rows){const day=days.get(r.date)||[];day.push(r);days.set(r.date,day)}return [...days.entries()].sort((a,b)=>b[0].localeCompare(a[0])).map(([date,records])=>({date,records}))}

// Separate profiles even when this helper is called outside the active-profile UI.
export function compareSelectedDates(rows,dates,opts={}){
 if(!Array.isArray(dates)||dates.length<2||dates.length>3||dates.some((d,i)=>!validDate(d)||(i>0&&d<=dates[i-1])))return [];
 const groups=new Map(),positions=new Map(dates.map((date,i)=>[date,i]));
 for(const r of visibleScope(rows,opts)){
  const i=positions.get(r.date);if(i===undefined)continue;
  if((opts.system&&opts.system!=='all'&&rowCategory(r)!==opts.system)||!searchMatch(r,opts.query||''))continue;
  if(opts.profileId!==undefined&&r.profileId!==opts.profileId)continue;
  if(opts.labFilter!==undefined&&(r.lab||'')!==opts.labFilter||opts.methodFilter!==undefined&&(r.method||'')!==opts.methodFilter)continue;
  const key=measurementKey(r),identity=JSON.stringify([r.profileId??null,key]);
  let g=groups.get(identity);if(!g){g={key,profileId:r.profileId,name:r.name,category:rowCategory(r),unit:r.unit,lab:r.lab||'',method:r.method||'',columns:dates.map(date=>({date,records:[],delta:null}))};groups.set(identity,g)}
  g.columns[i].records.push(r);
 }
 for(const g of groups.values()){
  for(let i=1;i<g.columns.length;i++){const a=g.columns[i-1].records,b=g.columns[i].records;if(a.length===1&&b.length===1&&exact(a[0])&&exact(b[0])){const d=b[0].value-a[0].value;if(Number.isFinite(d))g.columns[i].delta=Number(d.toPrecision(12))}}
 }
 return [...groups.values()].sort((a,b)=>a.name.localeCompare(b.name,'tr')||a.key.localeCompare(b.key)||String(a.profileId).localeCompare(String(b.profileId)));
}
// Compatibility for existing two-date callers.
export function compareDates(rows,older,newer,opts={}){
 return compareSelectedDates(rows,[older,newer],opts).map(g=>({key:g.key,profileId:g.profileId,name:g.name,category:g.category,before:g.columns[0].records,after:g.columns[1].records,delta:g.columns[1].delta}));
}
