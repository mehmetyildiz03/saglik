import {labView,rowCategory,stateFor} from './lab-view.js';
import {validDate,status} from './core.js';
import {systems} from './catalog.js';
import {exact,resultLabel,safeReference,measurementKey} from './measurement.js';
import {rangeBand} from './dashboard.js';
import {axisDates,systemChart} from './trend-view.js';
import {systemNames,systemIcon} from './atlas.js';
import {PLOT_SIZE} from './quality.js';
export const GRAPH_PAGE_SIZE=12;
const systemOrder=new Map(systems.map((s,i)=>[s[0],i]));
export function systemGraphModel(rows,opts,end){
 const scoped=rows.filter(r=>r.profileId===opts.profileId&&validDate(r.date));
 const result=labView(scoped,{...opts,mode:'latest'},end);
 const items=result.items.filter(g=>g.history?.length&&g.history.every(r=>r.profileId===opts.profileId&&measurementKey(r)===g.key));
 if(opts.sort==='system')items.sort((a,b)=>(systemOrder.get(rowCategory(a.records[0]))??99)-(systemOrder.get(rowCategory(b.records[0]))??99)||a.records[0].name.localeCompare(b.records[0].name,'tr')||a.key.localeCompare(b.key));
 const dates=[...new Set(items.flatMap(g=>g.history.map(r=>r.date)))].sort();
 if(!dates.length)return {...result,items,dates,domain:null};
 let start=dates[0],finish=dates.at(-1);if(['30','90','365'].includes(String(opts.period))&&validDate(end)){const day=new Date(end+'T00:00:00Z');day.setUTCDate(day.getUTCDate()-Number(opts.period)+1);start=day.toISOString().slice(0,10);finish=end}
 const ticks=axisDates([...new Set([start,...dates,finish])].sort(),3);
 return {...result,items,dates,domain:{start,end:finish,ticks}};
}
export function graphSelection(item,focus){
 const date=focus||item.date,records=item.history.filter(r=>r.date===date);
 return {date,records,latest:date===item.date,state:records.length?stateFor(records):'missing'};
}
const dateFormatter=new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'short',year:'2-digit',timeZone:'UTC'});const dateLabel=d=>dateFormatter.format(new Date(d+'T00:00:00Z'));
function E(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n}
function B(txt,fn,cls){const b=E('button',txt,cls);b.type='button';b.onclick=fn;return b}
function selectField(root,name,label,options,value,fn){const l=E('label',label),s=E('select');s.name=name;s.setAttribute('aria-label',label);for(const [v,t] of options){const o=E('option',t);o.value=v;s.append(o)}s.value=value;s.onchange=()=>fn(s.value);l.append(s);root.append(l);return s}
function renderCard(item,domain,focus,showBand,onOpen){
 const row=item.records[0],group=rowCategory(row),card=E('article',undefined,'system-graph-card');card.dataset.system=group;
 const title=E('div',undefined,'system-graph-heading'),symbol=E('span',undefined,'system-graph-symbol');symbol.append(systemIcon(group));const text=E('div');text.append(E('small',systemNames[group]||'Diğer'),E('h3',row.name),E('p',(row.unit==='1'?'Boyutsuz':row.unit||'Nitel sonuç')+' · '+(row.lab||'Lab. belirtilmemiş')+' · '+(row.method||'Yöntem belirtilmemiş'),'system-graph-meta'));title.append(symbol,text);card.append(title);
 const selected=graphSelection(item,focus),read=E('div',undefined,'system-graph-readout');read.dataset.state=selected.state;const label=E('div');label.append(E('small',(selected.latest?'Son kayıt · ':'Seçili tarih · ')+dateLabel(selected.date)));
 label.append(E('strong',selected.records.length===1?resultLabel(selected.records[0]):selected.records.length?selected.records.length+' ayrı kayıt':'Kayıt yok'));read.append(label);
 if(selected.records.length===1){const r=selected.records[0],state=status(r);read.append(E('span',state,'system-graph-status'));}else if(selected.records.length>1)read.append(E('span','Ayrı ölçümler','system-graph-status'));
 card.append(read);
 const plot=E('div',undefined,'system-graph-plot'),svg=systemChart(item.history,domain,selected.date,showBand);
 if(svg){plot.append(svg);const common=rangeBand(item.history);plot.append(E('small',common&&showBand?'Rapor bandı: '+common.low+' – '+common.high:common?'Ortak rapor bandı gizlendi':'Ortak rapor bandı yok','system-graph-note'))}
 else plot.append(E('p',item.history.length>PLOT_SIZE?item.history.length+' kayıt · Ortak ekseni korumak için daha kısa dönem seç veya ayrıntıda tarih pencerelerini incele.':'Sayısal grafik yok. Ölçümler aşağıda korunur.','system-graph-empty'));
 card.append(plot);
 const records=E('div',undefined,'system-graph-records');
 if(selected.records.length>20){records.append(B(selected.records.length+' ayrı ölçümü aç →',()=>onOpen({key:item.key,date:selected.date,id:null}),'system-graph-record'))}else if(selected.records.length){for(const r of selected.records){const b=B('',()=>onOpen({key:item.key,date:r.date,id:r.id}),'system-graph-record');b.setAttribute('aria-label',row.name+' · '+dateLabel(r.date)+' · '+resultLabel(r)+' kaydını aç');b.append(E('span',selected.records.length>1?resultLabel(r)+' · ':''),E('span',safeReference(r)?'Ref. '+safeReference(r):'Ref. belirtilmemiş'),E('span','İncele →','system-graph-open'));records.append(b)}}
 else records.append(B('Son kayıt: '+dateLabel(item.date)+' →',()=>onOpen({key:item.key,date:item.date,id:item.id}),'system-graph-record'));
 card.append(records);return card
}
export function systemGraphsView(root,model,{period,focus='',page=0,showBand=true,onPeriod,onFocus,onPage,onBand,onOpen}){
 const controls=E('div',undefined,'system-graphs-controls');const heading=E('div',undefined,'system-graphs-heading');heading.append(E('strong','Sistem grafikleri'),E('small',dateLabel(model.domain.start)+' – '+dateLabel(model.domain.end)+' · ortak zaman ekseni'));controls.append(heading);
 const fieldset=E('div',undefined,'system-graphs-fields');
 selectField(fieldset,'graphPeriod','Grafik dönemi',[['all','Tüm geçmiş'],['30','Son 30 gün'],['90','Son 90 gün'],['365','Son 1 yıl']],String(period),onPeriod);
 if(!model.dates.includes(focus))focus='';
 const dateSelect=selectField(fieldset,'graphFocus','Ortak tarih odağı',[['','Her grafikte son kayıt'],...model.dates.slice().reverse().map(d=>[d,dateLabel(d)])],focus,value=>{focus=value;onFocus(value);drawCards()});
 const band=E('label',undefined,'system-graphs-band'),check=E('input');check.type='checkbox';check.checked=showBand;check.setAttribute('aria-label','Sistem grafiklerinde rapor bandı');check.onchange=()=>{showBand=check.checked;onBand(showBand);drawCards()};band.append(check,E('span','Rapor bantları'));fieldset.append(band);controls.append(fieldset);root.append(controls);
 const warning=E('p','Tarih ekseni ortak, değer eksenleri ve birimler ayrıdır. Çizgi eğimlerini tahliller arasında doğrudan kıyaslama. Laboratuvar/yöntem eksikse karşılaştırılabilirlik doğrulanmış değildir.','system-graphs-caption');root.append(warning);
 const grid=E('div',undefined,'system-graphs-grid'),pager=E('div',undefined,'system-graphs-pager'),count=Math.ceil(model.items.length/GRAPH_PAGE_SIZE);grid.setAttribute('aria-label','Tahlillerin ayrı grafikleri');root.append(grid,pager);
 function drawCards(){page=Math.min(Math.max(0,page),count-1);grid.replaceChildren();pager.replaceChildren();
 for(const item of model.items.slice(page*GRAPH_PAGE_SIZE,(page+1)*GRAPH_PAGE_SIZE))grid.append(renderCard(item,model.domain,focus,showBand,onOpen));
 const prev=B('← Önceki',()=>move(-1),'quiet'),next=B('Sonraki →',()=>move(1),'quiet');prev.disabled=page===0;next.disabled=page>=count-1;const label=E('span',(page*GRAPH_PAGE_SIZE+1)+'–'+Math.min((page+1)*GRAPH_PAGE_SIZE,model.items.length)+' / '+model.items.length+' grafik');label.setAttribute('role','status');pager.append(prev,label,next);pager.hidden=count<=1;
 function move(delta){page+=delta;onPage(page);drawCards();const title=grid.querySelector('h3');if(title){title.tabIndex=-1;title.focus({preventScroll:true});title.scrollIntoView({block:'nearest'})}}
 }
 drawCards();return root
}
