import {catalogue,norm} from './catalog.js';
import {status} from './core.js';
import {latestGroups,measurementKey,changeSummary,exact} from './measurement.js';
import {filterPeriod} from './dashboard.js';
const byId=new Map(catalogue.map(t=>[t[0],t]));
const searchIndex=new Map(catalogue.map(t=>[t[0],norm([t[1],...t[3]].join(' '))]));
export const defaultLabView=()=>({mode:'latest',query:'',system:'all',state:'all',period:'all',sort:'system',day:'all',pinnedOnly:false});
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

export function compareDates(rows,older,newer,opts={}){
 if(!older||!newer||older>=newer)return [];
 const groups=new Map();
 for(const r of visibleScope(rows,opts)){if(r.date!==older&&r.date!==newer)continue;if(opts.system&&opts.system!=='all'&&rowCategory(r)!==opts.system||!searchMatch(r,opts.query||''))continue;
 const key=measurementKey(r),g=groups.get(key)||{key,name:r.name,category:rowCategory(r),before:[],after:[]};g[r.date===older?'before':'after'].push(r);groups.set(key,g)}
 return [...groups.values()].map(g=>{const a=g.before,b=g.after;const delta=a.length===1&&b.length===1&&exact(a[0])&&exact(b[0])?b[0].value-a[0].value:null;return {...g,delta:delta!==null&&Number.isFinite(delta)?Number(delta.toPrecision(12)):null}}).sort((a,b)=>a.name.localeCompare(b.name,'tr')||a.key.localeCompare(b.key));
}
