import {exact,measurementKey,trendConnections,resultLabel,safeReference} from './measurement.js';
import {rangeBand,filterPeriod} from './dashboard.js';
const dayTime=d=>Date.parse(d+'T00:00:00Z');
const round=n=>Number.isFinite(n)?Number(n.toPrecision(12)):null;
function identityOK(rows){return rows.length>0&&rows.every(r=>measurementKey(r)===measurementKey(rows[0])&&r.profileId===rows[0].profileId&&Number.isFinite(dayTime(r.date)))}
function groupedDays(rows){const map=new Map();for(const r of rows){const a=map.get(r.date)||[];a.push(r);map.set(r.date,a)}return [...map.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([date,records])=>({date,records}))}
export function trendSummary(rows,selectedDate){
 if(!identityOK(rows))return null;
 const days=groupedDays(rows),valid=days.filter(d=>d.records.length===1&&exact(d.records[0])),values=valid.map(d=>d.records[0].value).sort((a,b)=>a-b),n=values.length;
 const middle=Math.floor(n/2),median=n?(n%2?values[middle]:values[middle-1]/2+values[middle]/2):null;
 const index=days.findIndex(d=>d.date===selectedDate),current=days[index],previous=index>0?days[index-1]:null;
 let change=null;if(current?.records.length===1&&previous?.records.length===1&&exact(current.records[0])&&exact(previous.records[0])){
  const a=previous.records[0],b=current.records[0],delta=round(b.value-a.value);
  if(delta!==null){const percent=a.value>0?round(((b.value-a.value)/a.value)*100):null;change={delta,percent,previous:a,current:b}}
 }
 return {count:n,total:rows.length,days:days.length,excluded:rows.length-n,min:n?values[0]:null,max:n?values[n-1]:null,median,change,latestDate:days.at(-1).date,metadataKnown:!!(rows[0].lab&&rows[0].method)}
}
export function axisDates(dates,maxTicks){
 if(dates.length<=maxTicks)return [...dates];const first=dayTime(dates[0]),last=dayTime(dates.at(-1)),out=[dates[0]];
 for(let i=1;i<maxTicks-1;i++){const target=first+(last-first)*i/(maxTicks-1);let best=null;for(const d of dates.slice(1,-1)){if(out.includes(d)||dayTime(d)<=dayTime(out.at(-1)))continue;if(!best||Math.abs(dayTime(d)-target)<Math.abs(dayTime(best)-target))best=d}if(best&&dayTime(best)-dayTime(out.at(-1))>=(last-first)/(maxTicks*1.5)&&last-dayTime(best)>=(last-first)/(maxTicks*1.5))out.push(best)}
 out.push(dates.at(-1));return out
}
export function trendModel(rows,{width=440,height=200,axes=true,limit=0,band=true}={}){
 if(!identityOK(rows))return null;
 const map=new Map();for(const r of rows){if(!Number.isFinite(dayTime(r.date)))return null;const a=map.get(r.date)||[];a.push(r);map.set(r.date,a)}
 let dates=[...map.keys()].sort();if(limit>0)dates=dates.slice(-limit);if(dates.length<2)return null;
 const days=dates.map(date=>({date,records:map.get(date)})),full=days.flatMap(d=>d.records),numeric=full.filter(exact);if(new Set(numeric.map(r=>r.date)).size<2)return null;
 const reference=band?rangeBand(full):null,values=numeric.map(r=>r.value);if(reference)values.push(reference.low,reference.high);
 const scale=Math.max(1,...values.map(Math.abs)),min=Math.min(...values.map(v=>v/scale)),max=Math.max(...values.map(v=>v/scale)),span=max-min||Math.max(.05,Math.abs(min)*.12),lo=min-span*.12,hi=max+span*.12;
 const left=axes?53:5,right=width-(axes?18:5),top=axes?12:4,bottom=height-(axes?28:4),first=dayTime(dates[0]),last=dayTime(dates.at(-1)),x=d=>left+(right-left)*(dayTime(d)-first)/(last-first),y=v=>bottom-(bottom-top)*((v/scale-lo)/(hi-lo));
 const points=numeric.map(r=>({id:r.id,date:r.date,value:r.value,x:x(r.date),y:y(r.value),record:r}));const byId=new Map(points.map(p=>[p.id,p]));
 const lines=trendConnections(full).map(([a,b])=>[byId.get(a.id),byId.get(b.id)]).filter(([a,b])=>a&&b);
 const ticks=Array.from({length:4},(_,i)=>{const scaled=lo+(hi-lo)*i/3;const v=scaled*scale;return {y:bottom-(bottom-top)*i/3,label:Number.isFinite(v)?String(Number(v.toPrecision(4))):''}});
 return {width,height,left,right,top,bottom,days,points,lines,ticks,dateTicks:axisDates(dates,width>=700?5:3).map(date=>({date,x:x(date)})),dayPositions:days.map(d=>({date:d.date,x:x(d.date)})),latestDate:dates.at(-1),reference:reference?{...reference,y:y(reference.high),height:y(reference.low)-y(reference.high)}:null,gaps:days.filter(d=>d.records.length!==1||!exact(d.records[0])).map(d=>({date:d.date,x:x(d.date),count:d.records.length}))};
}
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function H(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function dateLabel(d){return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'))}
function chartSVG(model,small,selected,onPick){
 const {width,height,left,right,top,bottom,points,lines,ticks,days,reference,gaps,dateTicks,dayPositions,latestDate}=model,svg=S('svg',{viewBox:'0 0 '+width+' '+height,class:small?'lab-sparkline':'lab-trend-svg',role:'img','aria-label':small?'Son 12 ölçüm tarihindeki sayısal eğilim; kesintiler belirsiz ölçümleri gösterir.':'Ölçüm tarihlerine göre grafik. Değerleri tarih seçicisinden ve veri tablosundan inceleyebilirsin.'});
 if(reference)svg.append(S('rect',{x:left,y:reference.y,width:right-left,height:reference.height,rx:4,fill:'var(--chart-band, #e5f2ea)',class:'trend-reference-band'}));
 if(!small){
  for(const t of ticks){svg.append(S('line',{x1:left,x2:right,y1:t.y,y2:t.y,stroke:'var(--chart-grid, #dfe7ee)','stroke-width':1}));const label=S('text',{x:left-7,y:t.y+4,'text-anchor':'end',fill:'var(--chart-label, #657789)','font-size':11});label.textContent=t.label;svg.append(label)}
  if(reference){for(const y of [reference.y,reference.y+reference.height])svg.append(S('line',{x1:left,x2:right,y1:y,y2:y,stroke:'var(--chart-line, #167b81)','stroke-width':1,'stroke-opacity':.55,'stroke-dasharray':'4 4',class:'trend-reference-boundary'}))}
  for(const [i,tick] of dateTicks.entries()){const align=i===0?'start':i===dateTicks.length-1?'end':'middle',t=S('text',{x:tick.x,y:height-8,fill:'var(--chart-label, #657789)','font-size':11,'text-anchor':align});t.textContent=dateLabel(tick.date);svg.append(t)}
 }
 for(const gap of gaps){if(!small)svg.append(S('line',{x1:gap.x,x2:gap.x,y1:top,y2:bottom,stroke:'var(--chart-label, #657789)','stroke-width':1,'stroke-dasharray':'3 4',class:'trend-gap'}))}
 if(!small&&selected){const pos=dayPositions.find(d=>d.date===selected);if(pos)svg.append(S('line',{x1:pos.x,x2:pos.x,y1:top,y2:bottom,stroke:'var(--ink, #17283e)','stroke-width':1.5,'stroke-opacity':.55,class:'trend-selected-guide','data-date':selected}))}
 for(const [a,b] of lines)svg.append(S('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'var(--chart-line, #167b81)','stroke-width':small?1.8:2.8,'stroke-linecap':'round',class:'trend-segment'}));
 for(const p of points){const active=p.date===selected&&!small,latest=p.date===latestDate&&!small&&days.at(-1).records.length===1;
  if(latest)svg.append(S('rect',{x:p.x-7,y:p.y-7,width:14,height:14,rx:3,fill:'none',stroke:'var(--chart-line, #167b81)','stroke-width':1.7,class:'trend-latest-mark','data-date':p.date}));
  const dot=S('circle',{cx:p.x,cy:p.y,r:small?2.2:active?5.7:4,fill:active?'var(--ink, #17283e)':'var(--chart-line, #167b81)',stroke:'var(--surface, #fff)','stroke-width':small?.7:1.5,class:'trend-dot'});svg.append(dot);
  if(!small&&onPick){const hit=S('circle',{cx:p.x,cy:p.y,r:12,fill:'transparent',class:'trend-point-hit','data-date':p.date});const title=S('title');title.textContent=dateLabel(p.date)+' · '+resultLabel(p.record);hit.append(title);hit.addEventListener('click',()=>onPick(p.date));svg.append(hit)}
 }
 return svg
}
export function sparkline(rows){const model=trendModel(rows,{width:100,height:27,axes:false,limit:12,band:false});return model?chartSVG(model,true,null,null):null}
function textValue(value,unit){return value===null?'—':String(round(value))+(unit&&unit!=='1'?' '+unit:'')}
function signed(value){return (value>0?'+':'')+String(value)}
export function displayPercent(value){if(!Number.isFinite(value))return '—';if(value===0)return '0%';const magnitude=Math.abs(value);if(magnitude<.01)return (value>0?'Artış':'Azalış')+' < %0,01';const digits=magnitude>=1e6?magnitude.toExponential(2).replace('.',','):new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(magnitude);return (value>0?'+':'−')+digits+'%'}
function statCell(name,value){const d=H('div',undefined,'analysis-stat');d.append(H('small',name),H('strong',value));return d}
export function trendPanel(rows,initialDate,today,onOpen,{wide=false}={}){
 const p=H('section',undefined,'panel lab-detail-chart lab-trend-panel'),header=H('div',undefined,'trend-heading');header.append(H('h2','Zaman içindeki değişim'),H('p','Ölçüm grubu · '+(rows[0]?.unit==='1'?'Boyutsuz':rows[0]?.unit||''),'muted'));p.append(header);
 const controls=H('div',undefined,'trend-controls'),period=H('select');period.name='trendPeriod';period.setAttribute('aria-label','Grafik dönemi');for(const [id,label] of [['all','Tüm geçmiş'],['365','Son 1 yıl'],['90','Son 90 gün'],['30','Son 30 gün']]){const o=H('option',label);o.value=id;period.append(o)}const select=H('select');select.name='trendDate';select.setAttribute('aria-label','Grafikteki ölçüm tarihi');controls.append(period,select);p.append(controls);
 const summary=H('div',undefined,'analysis-stats'),metadata=H('p',undefined,'analysis-scope'),graphic=H('div',undefined,'trend-graphic'),readout=H('div',undefined,'trend-readout');readout.setAttribute('role','status');
 const chartTools=H('div',undefined,'analysis-chart-tools'),bandLabel=H('label',undefined,'analysis-band-toggle'),bandCheck=H('input');bandCheck.type='checkbox';bandCheck.checked=true;bandCheck.setAttribute('aria-label','Ortak rapor referans bandı');bandLabel.append(bandCheck,H('span','Rapor bandı'));const last=H('button','Son ölçüm','quiet analysis-last');last.type='button';last.setAttribute('aria-label','Grafikte son ölçümü seç');chartTools.append(bandLabel,last);
 const changeBox=H('div',undefined,'analysis-change'),recordsPanel=H('details',undefined,'analysis-data'),tableSummary=H('summary','Ölçüm tablosu'),tableWrap=H('div',undefined,'analysis-table-wrap');recordsPanel.append(tableSummary,tableWrap);p.append(summary,metadata,chartTools,graphic,readout,changeBox,recordsPanel);let chosen=initialDate,shown=30;
 function drawTable(full){
  tableWrap.replaceChildren();tableSummary.textContent='Ölçüm tablosu · '+full.length+' kayıt';
  if(!full.length){tableWrap.append(H('p','Bu dönemde kayıt yok.','muted'));return}
  const table=H('table',undefined,'analysis-table');table.setAttribute('aria-label','Grafikte seçilen dönemin özgün ölçüm kayıtları');const thead=H('thead'),tr=H('tr');for(const name of ['Tarih','Sonuç','Rapor referansı','Kaynak','']){const th=H('th',name);th.scope='col';tr.append(th)}thead.append(tr);table.append(thead);
  const tbody=H('tbody'),sorted=[...full].sort((a,b)=>b.date.localeCompare(a.date)||String(a.id).localeCompare(String(b.id)));for(const r of sorted.slice(0,shown)){const row=H('tr');if(r.date===chosen)row.dataset.selected='true';row.append(H('td',dateLabel(r.date)),H('td',resultLabel(r)),H('td',safeReference(r)||'—'),H('td',({manual:'Manuel',pdf:'PDF',text:'Metin'})[r.origin||'manual']||'Belirtilmedi'));const cell=H('td'),open=H('button','Kaydı aç','quiet');open.type='button';open.setAttribute('aria-label',dateLabel(r.date)+' · '+resultLabel(r)+' kaydını aç');open.onclick=()=>onOpen(r.date,r.id);cell.append(open);row.append(cell);tbody.append(row)}table.append(tbody);tableWrap.append(table);
  if(sorted.length>shown){const more=H('button','30 kayıt daha göster','quiet');more.type='button';more.onclick=()=>{shown+=30;drawTable(full);const next=tableWrap.querySelector('tbody tr:nth-child('+(shown-29)+') button');if(next)next.focus()};tableWrap.append(more)}
 }
 function draw(){
  const full=filterPeriod(rows,period.value,today),dates=[...new Set(full.map(r=>r.date))].sort().reverse();select.replaceChildren();graphic.replaceChildren();readout.replaceChildren();summary.replaceChildren();changeBox.replaceChildren();
  if(!dates.includes(chosen))chosen=dates[0]||null;for(const date of dates){const o=H('option',dateLabel(date));o.value=date;select.append(o)}select.value=chosen||'';select.disabled=!dates.length;last.disabled=!dates.length||chosen===dates[0];
  const stats=trendSummary(full,chosen),unit=rows[0]?.unit;
  if(stats){summary.append(statCell('Tek kesin ölçüm',stats.count+' / '+stats.total+' kayıt'),statCell('En düşük',textValue(stats.min,unit)),statCell('En yüksek',textValue(stats.max,unit)),statCell('Medyan',textValue(stats.median,unit)));metadata.textContent=(stats.excluded?stats.excluded+' kayıt özet hesabına alınmadı (nitel, sınır veya aynı gün çoklu). ':'')+(stats.metadataKnown?'Kayıtlı laboratuvar ve yöntem aynı. ':'Laboratuvar veya yöntem eksik; karşılaştırılabilirlik doğrulanmış değil. ')+'İstatistikler yalnız seçilen döneme ait.'}else metadata.textContent='Seçilen dönemde özet hesaplanamadı.';
  const common=rangeBand(full);bandCheck.disabled=!common;const model=trendModel(full,{width:wide?800:440,height:wide?310:210,band:bandCheck.checked});
  if(model){
   graphic.append(chartSVG(model,false,chosen,date=>{chosen=date;draw()}));const key=H('div',undefined,'analysis-legend');const selectedKey=H('span',undefined,'legend-selected');selectedKey.append(H('i'),H('span','Seçili tarih'));const latestKey=H('span',undefined,'legend-latest');latestKey.append(H('i'),H('span','Dönemin son tek kesin sonucu'));key.append(selectedKey,latestKey);if(model.reference){const rangeKey=H('span',undefined,'legend-range');rangeKey.append(H('i'),H('span','Ortak rapor aralığı '+model.reference.low+' – '+model.reference.high));key.append(rangeKey)}graphic.append(key);
   if(!model.reference)graphic.append(H('p',common?'Ortak rapor bandı gizlendi.':'Ortak referans bandı yok; kayıt bazlı aralıklar tabloda.','chart-legend'));if(model.gaps.length)graphic.append(H('p','Kesik dikey işaret: nitel, sınır bildiren veya birden çok ölçümlü tarih. Bu tarihlerin üzerinden bağlantı kurulmaz.','chart-legend'))
  }else graphic.append(H('p','Bu dönemde grafik için iki farklı kesin ölçüm tarihi yok. Kayıtlar tabloda korunur.','muted trend-empty'));
  if(chosen){const selected=full.filter(r=>r.date===chosen),info=H('div');info.append(H('small',dateLabel(chosen)+(chosen===dates[0]?' · Son tarih':'')),H('strong',selected.length===1?resultLabel(selected[0]):selected.length+' ayrı kayıt'));readout.append(info);
   const b=H('button','Ölçümü aç','quiet trend-open');b.type='button';b.onclick=()=>onOpen(chosen,selected.length===1?selected[0].id:null);readout.append(b);
   if(stats?.change){const c=stats.change,absolute=H('div',undefined,'analysis-change-value');absolute.append(H('small','Önceki tarihe göre fark'),H('strong',signed(c.delta)+(unit&&unit!=='1'?' '+unit:'')));const pct=H('div',undefined,'analysis-change-value');pct.append(H('small','Yüzde fark'),H('strong',displayPercent(c.percent)));changeBox.append(absolute,pct,H('p','Önceki: '+dateLabel(c.previous.date)+' · '+resultLabel(c.previous)+'. Sayısal fark, klinik iyileşme/kötüleşme anlamına gelmez.','muted'))}else changeBox.append(H('p','Önceki ölçümle fark için iki ardışık tarihte tek kesin sonuç gerekli.','muted'))
  }
  drawTable(full)
 }
 period.onchange=()=>{shown=30;draw()};select.onchange=()=>{chosen=select.value;draw()};bandCheck.onchange=draw;last.onclick=()=>{const full=filterPeriod(rows,period.value,today);chosen=full.map(r=>r.date).sort().at(-1)||null;draw();select.focus()};draw();return p
}
