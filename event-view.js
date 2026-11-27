import {validDate} from './core.js';
import {filterPeriod} from './dashboard.js';
import {pageWindow,PLOT_SIZE} from './quality.js';
export const eventKinds=[['all','Tümü'],['lab','Tahliller'],['medicine','İlaç kayıtları'],['note','Notlar']];
const originLabel={manual:'Manuel',pdf:'PDF',text:'Metin aktarımı'};
export function eventDays(events,{kind='all',start=null,end=null,period='all',today=null}={}){
 if(start&&!validDate(start)||end&&!validDate(end)||start&&end&&start>end)return [];
 const eligible=filterPeriod(events.filter(e=>validDate(e.date)&&eventKinds.slice(1).some(k=>k[0]===e.kind)&&(kind==='all'||e.kind===kind)&&(!start||e.date>=start)&&(!end||e.date<=end)),period,today);
 const days=new Map();for(const e of eligible){let day=days.get(e.date);if(!day){day={date:e.date,events:[],counts:{lab:0,medicine:0,note:0}};days.set(e.date,day)}day.events.push(e);day.counts[e.kind]++}
 return [...days.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
export function eventPosition(date,start,end,left,right){
 if(![date,start,end].every(validDate)||date<start||date>end||start>end||![left,right].every(Number.isFinite)||right<left)return null;
 const t=d=>Date.parse(d+'T00:00:00Z'),a=t(start),b=t(end);return a===b?(left+right)/2:left+(right-left)*(t(date)-a)/(b-a)
}
const ns='http://www.w3.org/2000/svg',labels={lab:'Tahlil',medicine:'İlaç',note:'Not'};
function S(tag,attrs={}){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function E(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n}
function B(txt,fn,cls){const n=E('button',txt,cls);n.type='button';n.onclick=fn;return n}
const dateFormatter=new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});const dateLabel=d=>dateFormatter.format(new Date(d+'T00:00:00Z'));
function select(root,name,label,options,value,fn){const l=E('label',label),s=E('select');s.name=name;s.setAttribute('aria-label',label);for(const [id,t] of options){const o=E('option',t);o.value=id;s.append(o)}s.value=value;s.onchange=()=>fn(s.value);l.append(s);root.append(l);return s}
function eventRows(root,day,onOpen,page=0){
 root.replaceChildren();if(!day){root.append(E('p','Bir olay tarihi seç.','muted'));return}
 const window=pageWindow(day.events,page,20);for(const e of window.items){
  const row=E('article',undefined,'event-record');row.dataset.kind=e.kind;row.dataset.eventDate=e.date;
  const symbol=E('span',e.kind==='lab'?'●':e.kind==='medicine'?(e.phase==='end'?'■':'▲'):'◆','event-symbol');symbol.setAttribute('aria-hidden','true');
  const body=E('div',undefined,'event-record-body'),meta=E('small',e.kind==='lab'?'Tahlil · '+(originLabel[e.origin]||'Kaynak belirtilmemiş'):e.kind==='medicine'?'Bildirilen ilaç kullanım kaydı':'Kişisel not');body.append(meta,E('strong',e.title),E('p',e.detail));if(e.reference)body.append(E('small','Rapor ref. '+e.reference));row.append(symbol,body);
  const open=B('Aç →',()=>onOpen(e),'event-open quiet');open.setAttribute('aria-label',e.title+' kaydını aç');row.append(open);root.append(row)
 }
 if(window.count>1){const pager=E('div',undefined,'quality-pager'),prev=B('← Önceki',()=>move(-1),'quiet'),next=B('Sonraki →',()=>move(1),'quiet'),label=E('span',window.start+1+'–'+window.end+' / '+window.total+' olay');prev.disabled=window.index===0;next.disabled=window.index===window.count-1;label.setAttribute('role','status');pager.append(prev,label,next);root.append(pager);function move(delta){eventRows(root,day,onOpen,window.index+delta);root.querySelector('.event-open')?.focus({preventScroll:true})}}
}
function dayCounts(day){return [['lab','tahlil'],['medicine','ilaç olayı'],['note','not']].filter(([k])=>day.counts[k]).map(([k,label])=>day.counts[k]+' '+label).join(' · ')}
function stripSVG(days,{start,end,width,left,right},selected,onPick){
 const s=S('svg',{viewBox:'0 0 '+width+' 76',class:'event-strip-svg',role:'img','aria-label':'Grafik zaman eksenindeki olaylar: daire tahlil, üçgen ilaç başlangıcı, kare ilaç bitişi, baklava not. Tarih seçicisinden ayrıntıları incele.'});
 const lanes=[['lab',14],['medicine',37],['note',60]];for(const [kind,y] of lanes){const t=S('text',{x:left-7,y:y+3.5,'text-anchor':'end',fill:'var(--chart-label)','font-size':10});t.textContent=labels[kind];s.append(t,S('line',{x1:left,x2:right,y1:y,y2:y,stroke:'var(--chart-grid)','stroke-width':1}));
  for(const day of days){if(!day.counts[kind])continue;const x=eventPosition(day.date,start,end,left,right);if(x===null)continue;const g=S('g',{class:'event-marker','data-date':day.date,'data-kind':kind});if(kind==='lab')g.append(S('circle',{cx:x,cy:y,r:4.8,fill:'var(--event-lab)'}));else if(kind==='note')g.append(S('path',{d:'M'+x+' '+(y-5)+'l5 5 -5 5 -5 -5Z',fill:'var(--event-note)'}));else{const events=day.events.filter(e=>e.kind==='medicine');if(events.some(e=>e.phase==='start'))g.append(S('path',{d:'M'+x+' '+(y-6)+'l6 11h-12Z',fill:'var(--event-med)'}));if(events.some(e=>e.phase==='end'))g.append(S('rect',{x:x-4,y:y-4,width:8,height:8,fill:'var(--surface)',stroke:'var(--event-med)','stroke-width':2}))}
  const title=S('title');title.textContent=dateLabel(day.date)+' · '+dayCounts(day);g.append(title);g.append(S('circle',{cx:x,cy:y,r:10,fill:'transparent'}));g.addEventListener('click',()=>onPick(day.date));s.append(g)}
 }
 if(selected){const x=eventPosition(selected,start,end,left,right);if(x!==null)s.append(S('line',{x1:x,x2:x,y1:3,y2:70,stroke:'var(--event-focus)','stroke-width':1.5,'stroke-dasharray':'4 3','pointer-events':'none',class:'event-strip-focus','data-date':selected}))}
 return s
}
export function eventStrip(events,domain,{kind='all',focus='',onKind,onFocus,onOpen,onTimeline}){
 const root=E('section',undefined,'chart-events'),heading=E('div',undefined,'chart-events-heading');heading.append(E('strong','Sağlık olayları'),B('Geçmişi aç →',()=>onTimeline(focus||null),'quiet event-history-link'));root.append(heading);
 root.append(E('p','Yalnız grafiğin tarih aralığındaki kayıtlar. Olay ve ölçümün yakınlığı neden-sonuç göstermez.','chart-events-caption'));
 const controls=E('div',undefined,'chart-events-controls'),plot=E('div',undefined,'event-strip-plot'),details=E('div',undefined,'chart-event-details');root.append(controls,plot,details);
 select(controls,'eventKind','Olay türü',eventKinds,kind,v=>{kind=v;onKind(v);draw()});
 const date=select(controls,'eventFocus','Olay tarihi',[['','Olay tarihi seç']],focus,v=>pick(v));
 function pick(v){focus=v;onFocus(v);draw()}
 function draw(){
  const days=eventDays(events,{kind,start:domain.start,end:domain.end});if(focus&&!days.some(d=>d.date===focus)){focus='';onFocus('')}
  date.replaceChildren();for(const [v,t] of [['','Olay tarihi seç'],...days.map(d=>[d.date,dateLabel(d.date)+' · '+d.events.length+' olay'])]){const o=E('option',t);o.value=v;date.append(o)}date.value=focus;date.disabled=!days.length;
  plot.replaceChildren();if(days.length>PLOT_SIZE)plot.append(E('p',days.length+' olay günü · Yoğun işaretler yerine tarih seçicisinden bir günü incele. Tüm günler seçilebilir.','muted'));else if(days.length)plot.append(stripSVG(days,domain,focus,pick));else plot.append(E('p','Bu tarih aralığında seçili türde olay yok.','muted'));
  details.replaceChildren();if(focus){const day=days.find(d=>d.date===focus);details.append(E('p',dateLabel(focus)+' · '+dayCounts(day),'event-day-label'));const list=E('div');details.append(list);eventRows(list,day,onOpen)}
 }
 draw();return root
}
export function timelineView(root,events,{today,kind='all',focus='',period='all',onState,onOpen,onDayLabs,onAddNote,onAddMedicine}){
 let shown=24;const shell=E('section',undefined,'timeline-workspace'),top=E('div',undefined,'timeline-summary'),filters=E('div',undefined,'timeline-tools'),main=E('div',undefined,'timeline-columns'),dates=E('div',undefined,'timeline-days'),detail=E('div',undefined,'timeline-day-detail');shell.append(top,filters,main);main.append(dates,detail);root.append(shell);
 const kindControls=E('div',undefined,'timeline-kind-controls');filters.append(kindControls);
 const fieldset=E('div',undefined,'timeline-selects');filters.append(fieldset);select(fieldset,'eventPeriod','Dönem',[['all','Tüm geçmiş'],['30','Son 30 gün'],['90','Son 90 gün'],['365','Son 1 yıl']],period,v=>{period=v;shown=24;draw()});const picker=select(fieldset,'timelineDate','Olay tarihi',[['','Tarih seç']],focus,v=>{focus=v;draw();detail.querySelector('h2')?.focus({preventScroll:true})});
 function draw(){
  const scope=eventDays(events,{period,today}),days=eventDays(events,{kind,period,today});if(!days.some(d=>d.date===focus))focus=days[0]?.date||'';onState({kind,focus,period});
  top.replaceChildren();for(const [id,title] of [['days','Olay günü'],['lab','Tahlil kaydı'],['medicine','İlaç başlangıç/bitiş'],['note','Kişisel not']]){const tile=E('div',undefined,'timeline-summary-tile');tile.dataset.kind=id;tile.append(E('small',title),E('strong',String(id==='days'?scope.length:scope.reduce((n,d)=>n+d.counts[id],0))));top.append(tile)}
  kindControls.replaceChildren();for(const [id,title] of eventKinds){const b=B(title,()=>{kind=id;shown=24;draw();kindControls.querySelector('[aria-pressed=true]')?.focus()},'quiet');b.setAttribute('aria-pressed',String(kind===id));kindControls.append(b)}
  picker.replaceChildren();for(const [id,title] of [['','Tarih seç'],...days.map(d=>[d.date,dateLabel(d.date)])]){const o=E('option',title);o.value=id;picker.append(o)}picker.value=focus;picker.disabled=!days.length;
  dates.replaceChildren();detail.replaceChildren();if(!days.length){dates.append(E('p','Bu görünümde olay yok.','muted'));detail.append(E('h2','Henüz kayıt yok'),E('p','Tahlil, ilaç veya not ekledikçe geçmişin burada görünecek.','muted'));return}
  dates.append(E('h2','Olay günleri'));const shownDays=days.slice(0,shown);if(focus&&!shownDays.some(d=>d.date===focus))shownDays.push(days.find(d=>d.date===focus));
  for(const day of shownDays){const b=B('',()=>{focus=day.date;draw();dates.querySelector('[aria-pressed=true]')?.focus({preventScroll:true})},'timeline-day-button');b.setAttribute('aria-pressed',String(day.date===focus));b.dataset.date=day.date;b.append(E('strong',dateLabel(day.date)),E('small',dayCounts(day)),E('span',String(day.events.length),'timeline-count'));dates.append(b)}
  if(days.length>shown)dates.append(B('24 gün daha göster',()=>{shown+=24;draw();dates.querySelector('[aria-pressed=true]')?.focus()},'quiet'));
  const day=days.find(d=>d.date===focus),allDay=scope.find(d=>d.date===focus),h=E('h2',dateLabel(focus));h.tabIndex=-1;detail.append(h,E('p',dayCounts(day),'muted'));const actions=E('div',undefined,'timeline-day-actions');if(allDay?.counts.lab)actions.append(B('Bu günün tahlilleri',()=>onDayLabs(focus),'quiet'));actions.append(B('Not ekle',()=>onAddNote(focus),'quiet'),B('İlaç kaydı ekle',()=>onAddMedicine(focus),'quiet'));detail.append(actions);const list=E('div',undefined,'timeline-event-records');detail.append(list);eventRows(list,day,onOpen)
 }
 draw();return shell
}
