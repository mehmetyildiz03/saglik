import {exact,measurementKey,trendConnections,resultLabel} from './measurement.js';
import {rangeBand,filterPeriod} from './dashboard.js';
const dayTime=d=>Date.parse(d+'T00:00:00Z');
export function trendModel(rows,{width=440,height=200,axes=true,limit=0,band=true}={}){
 if(!rows.length||rows.some(r=>measurementKey(r)!==measurementKey(rows[0])||r.profileId!==rows[0].profileId))return null;
 const map=new Map();for(const r of rows){if(!Number.isFinite(dayTime(r.date)))return null;const a=map.get(r.date)||[];a.push(r);map.set(r.date,a)}
 let dates=[...map.keys()].sort();if(limit>0)dates=dates.slice(-limit);if(dates.length<2)return null;
 const days=dates.map(date=>({date,records:map.get(date)})),full=days.flatMap(d=>d.records),numeric=full.filter(exact);if(new Set(numeric.map(r=>r.date)).size<2)return null;
 const reference=band?rangeBand(full):null,values=numeric.map(r=>r.value);if(reference)values.push(reference.low,reference.high);
 const scale=Math.max(1,...values.map(Math.abs)),min=Math.min(...values.map(v=>v/scale)),max=Math.max(...values.map(v=>v/scale)),span=max-min||Math.max(.05,Math.abs(min)*.12),lo=min-span*.12,hi=max+span*.12;
 const left=axes?53:5,right=width-(axes?18:5),top=axes?12:4,bottom=height-(axes?28:4),first=dayTime(dates[0]),last=dayTime(dates.at(-1)),x=d=>left+(right-left)*(dayTime(d)-first)/(last-first),y=v=>bottom-(bottom-top)*((v/scale-lo)/(hi-lo));
 const points=numeric.map(r=>({id:r.id,date:r.date,value:r.value,x:x(r.date),y:y(r.value),record:r}));const byId=new Map(points.map(p=>[p.id,p]));
 const lines=trendConnections(full).map(([a,b])=>[byId.get(a.id),byId.get(b.id)]).filter(([a,b])=>a&&b);
 const ticks=Array.from({length:4},(_,i)=>{const scaled=lo+(hi-lo)*i/3;const v=scaled*scale;return {y:bottom-(bottom-top)*i/3,label:Number.isFinite(v)?String(Number(v.toPrecision(4))):''}});
 return {width,height,left,right,top,bottom,days,points,lines,ticks,reference:reference?{...reference,y:y(reference.high),height:y(reference.low)-y(reference.high)}:null,gaps:days.filter(d=>d.records.length!==1||!exact(d.records[0])).map(d=>({date:d.date,x:x(d.date),count:d.records.length}))};
}
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function H(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function dateLabel(d){return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'))}
function chartSVG(model,small,selected,onPick){
 const {width,height,left,right,top,bottom,points,lines,ticks,days,reference,gaps}=model,svg=S('svg',{viewBox:'0 0 '+width+' '+height,class:small?'lab-sparkline':'lab-trend-svg',role:'img','aria-label':small?'Son 12 ölçüm tarihindeki sayısal eğilim; kesintiler belirsiz ölçümleri gösterir.':'Ölçüm tarihlerine göre grafik. Tarih seçicisinden tüm kayıtlar incelenebilir.'});
 if(reference)svg.append(S('rect',{x:left,y:reference.y,width:right-left,height:reference.height,rx:4,fill:'#e5f2ea'}));
 if(!small){for(const t of ticks){svg.append(S('line',{x1:left,x2:right,y1:t.y,y2:t.y,stroke:'#dfe7ee','stroke-width':1}));const label=S('text',{x:left-7,y:t.y+4,'text-anchor':'end',fill:'#657789','font-size':10});label.textContent=t.label;svg.append(label)}for(const [d,x,align] of [[days[0].date,left,'start'],[days.at(-1).date,right,'end']]){const t=S('text',{x,y:height-8,fill:'#657789','font-size':10,'text-anchor':align});t.textContent=dateLabel(d);svg.append(t)}}
 for(const gap of gaps){if(!small)svg.append(S('line',{x1:gap.x,x2:gap.x,y1:top,y2:bottom,stroke:'#b9c6d0','stroke-width':1,'stroke-dasharray':'3 4'}))}
 for(const [a,b] of lines)svg.append(S('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#167b81','stroke-width':small?1.8:2.8,'stroke-linecap':'round'}));
 for(const p of points){const active=p.date===selected&&!small;const dot=S('circle',{cx:p.x,cy:p.y,r:small?2.2:active?5.6:3.9,fill:active?'#17283e':'#167b81',stroke:'#fff','stroke-width':small?.7:1.5});svg.append(dot);if(!small&&onPick){const hit=S('circle',{cx:p.x,cy:p.y,r:12,fill:'transparent',class:'trend-point-hit','data-date':p.date});const title=S('title');title.textContent=dateLabel(p.date)+' · '+resultLabel(p.record);hit.append(title);hit.addEventListener('click',()=>onPick(p.date));svg.append(hit)}}
 return svg
}
export function sparkline(rows){const model=trendModel(rows,{width:100,height:27,axes:false,limit:12,band:false});return model?chartSVG(model,true,null,null):null}
export function trendPanel(rows,initialDate,today,onOpen){
 const p=H('section',undefined,'panel lab-detail-chart lab-trend-panel'),header=H('div',undefined,'trend-heading');header.append(H('h2','Zaman içindeki değişim'),H('p','Aynı ölçüm grubu · '+(rows[0]?.unit==='1'?'Boyutsuz':rows[0]?.unit||''),'muted'));p.append(header);
 const controls=H('div',undefined,'trend-controls'),period=H('select');period.name='trendPeriod';period.setAttribute('aria-label','Grafik dönemi');for(const [id,label] of [['all','Tüm geçmiş'],['365','Son 1 yıl'],['90','Son 90 gün'],['30','Son 30 gün']]){const o=H('option',label);o.value=id;period.append(o)}const select=H('select');select.name='trendDate';select.setAttribute('aria-label','Grafikteki ölçüm tarihi');controls.append(period,select);p.append(controls);
 const graphic=H('div',undefined,'trend-graphic'),readout=H('div',undefined,'trend-readout');readout.setAttribute('role','status');p.append(graphic,readout);let chosen=initialDate;
 function draw(){
  const full=filterPeriod(rows,period.value,today),dates=[...new Set(full.map(r=>r.date))].sort().reverse();select.replaceChildren();graphic.replaceChildren();readout.replaceChildren();
  if(!dates.includes(chosen))chosen=dates[0]||null;for(const date of dates){const o=H('option',dateLabel(date));o.value=date;select.append(o)}select.value=chosen||'';select.disabled=!dates.length;
  const model=trendModel(full);if(model){graphic.append(chartSVG(model,false,chosen,date=>{chosen=date;draw()}));graphic.append(H('p',model.reference?'Yeşil bant: aynı rapor referansı '+model.reference.low+' – '+model.reference.high+'.':'Ortak referans bandı yok.','chart-legend'));if(model.gaps.length)graphic.append(H('p','Kesik çizgi: nitel, sınır bildiren veya birden çok ölçümlü tarih.','chart-legend'))}else graphic.append(H('p','Bu dönemde grafik için iki farklı kesin ölçüm tarihi yok.','muted trend-empty'));
  if(!chosen)return;const selected=full.filter(r=>r.date===chosen);const info=H('div');info.append(H('small',dateLabel(chosen)),H('strong',selected.length===1?resultLabel(selected[0]):selected.length+' ayrı kayıt'));readout.append(info);if(selected.length){const b=H('button','Ölçümü aç','quiet trend-open');b.type='button';b.onclick=()=>onOpen(chosen,selected.length===1?selected[0].id:null);readout.append(b)}
 }
 period.onchange=()=>draw();select.onchange=()=>{chosen=select.value;draw()};draw();return p
}
