import {systems} from './catalog.js';
import {rowCategory} from './lab-view.js';
export const systemNames=Object.fromEntries(systems.map(s=>[s[0],s[1]]));
export function systemSummary(items){
 const counts=new Map();
 for(const item of items){if(!item.records?.length)continue;const id=rowCategory(item.records[0]),s=counts.get(id)||{id,name:systemNames[id]||'Diğer',count:0,out:0,review:0};s.count++;if(item.state==='out')s.out++;if(item.state==='review')s.review++;counts.set(id,s)}
 return [...new Set([...systems.map(s=>s[0]),'other'])].map(id=>counts.get(id)).filter(Boolean)
}
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
export function systemIcon(id){
 const s=S('svg',{viewBox:'0 0 36 36',width:36,height:36,fill:'none','aria-hidden':'true',class:'atlas-icon-svg','stroke-linecap':'round','stroke-linejoin':'round'});
 const path=(d,fill='none',stroke='currentColor',w=1.8)=>s.append(S('path',{d,fill,stroke,'stroke-width':w}));
 const ellipse=(cx,cy,rx,ry,fill='none')=>s.append(S('ellipse',{cx,cy,rx,ry,fill,stroke:'currentColor','stroke-width':1.6}));
 if(id==='heart'){path('M18 30S4 22 4 13C4 5 14 3 18 10C22 3 32 5 32 13C32 22 18 30 18 30Z','currentColor','none');path('M7 18h6l3-6 4 11 3-5h6','none','var(--icon-contrast, #fff)',1.6)}
 else if(id==='blood'){ellipse(12,12,8,5,'currentColor');ellipse(12,12,4,2,'var(--icon-contrast, #fff)');ellipse(24,24,8,5,'currentColor');ellipse(24,24,4,2,'var(--icon-contrast, #fff)');ellipse(26,9,3,3)}
 else if(id==='metabolism'){path('M20 3 7 21h10l-1 12 13-19H19Z','currentColor','none')}
 else if(id==='kidney'){path('M13 5C3 2 1 22 9 26c5 3 10-2 7-7-2-3-6-2-5-6 1-3 6-6 2-8ZM23 5c10-3 12 17 4 21-5 3-10-2-7-7 2-3 6-2 5-6-1-3-6-6-2-8Z','currentColor','none');path('M15 20q3 2 3 11m3-11q-3 2-3 11')}
 else if(id==='liver'){path('M5 9Q14 3 31 9L33 16Q28 25 17 29Q9 28 5 19Z','currentColor','none');path('M19 8q4 9-3 20','none','var(--icon-contrast,#fff)',1.6)}
 else if(id==='thyroid'){path('M16 14C9 3 4 7 5 16s7 13 11 5v-7ZM20 14c7-11 12-7 11 2s-7 13-11 5v-7Z','currentColor','none');path('M18 8v20M15 18h6')}
 else if(id==='nutrient'){path('M18 3v30M3 18h30M7 7l22 22M29 7 7 29','none','currentColor',3);ellipse(18,18,6,6,'var(--icon-contrast,#fff)')}
 else if(id==='immune'){path('M18 4 30 9v10c0 6-7 11-12 14C13 30 6 25 6 19V9Z','currentColor','none');path('M12 18l4 4 8-9','none','var(--icon-contrast,#fff)',2.4)}
 else if(id==='urine'){path('M18 3C15 9 7 17 7 24a11 11 0 0 0 22 0C29 17 21 9 18 3Z','currentColor','none');path('M12 24q1 5 5 6','none','var(--icon-contrast,#fff)',2)}
 else {for(const [x,y] of [[11,11],[25,11],[11,25],[25,25]])s.append(S('rect',{x:x-5,y:y-5,width:10,height:10,rx:3,fill:'currentColor'}))}
 return s
}
