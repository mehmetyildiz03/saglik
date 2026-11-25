import {exact,safeReference,resultLabel} from './measurement.js';
export const UI_KEY='pera-appearance-v1';
export function appearance(input){
 return {theme:input?.theme==='dark'?'dark':'light',layout:input?.layout==='cards'?'cards':'list'};
}
export function readAppearance(storage){try{return appearance(JSON.parse(storage.getItem(UI_KEY)||'{}'))}catch{return appearance(null)}}
export function saveAppearance(storage,next){const safe=appearance(next);try{storage.setItem(UI_KEY,JSON.stringify(safe))}catch{}return safe}
export function rangeModel(r){
 if(!exact(r)||r.referenceText||!Number.isFinite(r.low)||!Number.isFinite(r.high)||r.low>=r.high)return null;
 const kind=r.value<r.low?'low':r.value>r.high?'high':'in';
 const scale=Math.max(1,Math.abs(r.low),Math.abs(r.high)),lo=r.low/scale,hi=r.high/scale;
 // Outside positions are deliberately categorical, never a severity scale.
 let pos=kind==='low'?10:kind==='high'?90:20+60*((r.value/scale-lo)/(hi-lo));
 if(!Number.isFinite(pos))pos=r.value===r.low?20:r.value===r.high?80:50;
 return {kind,pos:Math.min(90,Math.max(10,pos)),low:r.low,high:r.high,reference:safeReference(r),value:resultLabel(r)};
}
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const s=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))s.setAttribute(k,String(v));return s}
function H(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
export function rangeDisplay(r,{mini=false}={}){
 const m=rangeModel(r);if(!m)return null;
 const root=H('div',undefined,mini?'ref-mini':'ref-display');root.setAttribute('data-range-state',m.kind);
 const svg=S('svg',{viewBox:'0 0 300 28',class:'reference-track',role:'img','aria-label':m.value+'; rapor referansı '+m.reference+'; '+(m.kind==='low'?'Aralık altında':m.kind==='high'?'Aralık üstünde':'Aralık içinde')+'. Aralık dışındaki işaretler yalnız yönü gösterir.'});
 const zones=[[0,60,'ref-out-zone'],[60,180,'ref-in-zone'],[240,60,'ref-out-zone']];
 for(const [x,width,cls] of zones)svg.append(S('rect',{x:x+2,y:10,width:width-4,height:8,rx:4,class:cls}));
 svg.append(S('line',{x1:60,x2:60,y1:6,y2:22,class:'ref-boundary'}),S('line',{x1:240,x2:240,y1:6,y2:22,class:'ref-boundary'}));
 svg.append(S('circle',{cx:m.pos*3,cy:14,r:7,class:'ref-marker'}));
 if(m.kind!=='in'){const x=m.pos*3;svg.append(S('path',{d:m.kind==='low'?'M'+(x+1)+' 10l-4 4 4 4':'M'+(x-1)+' 10l4 4 -4 4',class:'ref-arrow'}))}
 root.append(svg);
 if(!mini){const labels=H('div',undefined,'reference-labels');labels.append(H('span','Altında'),H('span',String(m.low)+' – '+String(m.high)),H('span','Üstünde'));root.append(labels,H('p','Rapor aralığı; dıştaki konum yalnız yönü belirtir, sapmanın büyüklüğünü göstermez.','ref-explainer'))}
 return root
}
