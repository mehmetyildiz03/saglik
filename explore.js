import {physiology} from './physiology.js';
import {systemIcon,systemNames} from './atlas.js';
// Educational questions only. No patient measurements, diagnoses or health scores.
export const stations=[
 {id:'heart',name:'Dolaşım istasyonu',tag:'01 · DOLAŞIM',subtitle:'Oksijenin yolculuğunu izle.',question:'Oksijenden zengin kanı vücuda hangi bölüm pompalar?',options:['Sağ karıncık','Sol karıncık','Akciğerler'],answer:1,node:2},
 {id:'blood',name:'Hücre laboratuvarı',tag:'02 · HEMOGRAM',subtitle:'Kanın küçük dünyasını tanı.',question:'Oksijen taşımada başlıca görevli kan hücresi hangisidir?',options:['Eritrosit','Trombosit','Lökosit'],answer:0,node:0},
 {id:'kidney',name:'Filtrasyon merkezi',tag:'03 · BÖBREK',subtitle:'Süzme ve geri kazanımı keşfet.',question:'Süzüntüdeki su ve gerekli maddelerin önemli bir kısmı nerede geri kazanılır?',options:['Safra yollarında','Akciğerlerde','Böbrek tübüllerinde'],answer:2,node:1},
 {id:'liver',name:'Enzim atölyesi',tag:'04 · KARACİĞER',subtitle:'Enzimlerin ne anlattığını öğren.',question:'ALT ve AST ölçümleri karaciğerin bütün işlevlerini tek başına gösterir mi?',options:['Hayır','Evet','Her zaman, aynı birimdeyse'],answer:0,node:0}
];
export function newExploration(){return {selected:'heart',answers:{}}}
export function answerQuestion(state,id,index){
 const station=stations.find(s=>s.id===id);if(!station||!Number.isInteger(index)||index<0||index>=station.options.length||state.answers[id]===station.answer)return state;
 return {...state,answers:{...state.answers,[id]:index}};
}
export function learned(state){return stations.filter(s=>state.answers[s.id]===s.answer).map(s=>s.id)}
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n}
function E(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n}
function B(txt,fn,cls){const n=E('button',txt,cls);n.type='button';n.onclick=fn;return n}
export function stationArt(id){
 const s=S('svg',{viewBox:'0 0 220 100',class:'station-art','aria-hidden':'true',fill:'none'});
 s.append(S('circle',{cx:110,cy:50,r:45,fill:'var(--system-tint)'}),S('circle',{cx:110,cy:50,r:37,stroke:'currentColor','stroke-opacity':.18,'stroke-dasharray':'3 5'}));
 s.append(S('path',{d:'M10 64C40 5 174 95 210 31',stroke:'currentColor','stroke-width':1.5,'stroke-opacity':.23,'stroke-dasharray':'4 6'}));
 for(const [x,y,r] of [[30,24,4],[50,78,6],[184,22,7],[193,76,3],[76,15,2],[150,83,3]])s.append(S('circle',{cx:x,cy:y,r,fill:'currentColor',opacity:.20}));
 const icon=systemIcon(id);icon.setAttribute('x','76');icon.setAttribute('y','16');icon.setAttribute('width','68');icon.setAttribute('height','68');icon.setAttribute('class','station-main-icon');s.append(icon);
 return s;
}
export function exploreView(root,state,{update,onLabs,onPhysiology,onBack}){
 const completed=learned(state),station=stations.find(s=>s.id===state.selected)||stations[0],lesson=physiology[station.id],node=lesson.nodes[station.node],picked=state.answers[station.id],correct=picked===station.answer;
 const title=E('div',undefined,'explore-title'),heading=E('div');heading.append(E('p','PERA / KEŞİF TURU','explore-eyebrow'),E('h1','Vücudun küçük dünyaları'),E('p','Dört kısa durak. Her birinde bir işlevi öğren, sonra ilgili tahlillerine dön.','muted'));title.append(heading,B('← Tahliller',onBack,'quiet'));root.append(title);
 const progress=E('section',undefined,'explore-progress');const progressText=E('div');progressText.append(E('strong',completed.length+' / '+stations.length+' keşif tamamlandı'),E('small','Yalnız öğrenme ilerlemesi · sağlık puanı değil'));progress.append(progressText);const dots=E('div',undefined,'explore-progress-dots');dots.setAttribute('aria-label',completed.length+' tamamlanan öğrenme durağı');for(const st of stations){const dot=E('span',completed.includes(st.id)?'✓':'', 'explore-progress-dot');dot.dataset.system=st.id;dot.dataset.done=String(completed.includes(st.id));dot.append(systemIcon(st.id));dots.append(dot)}progress.append(dots);root.append(progress);
 const layout=E('div',undefined,'explore-layout'),grid=E('section',undefined,'explore-stations');grid.setAttribute('aria-label','Keşif durakları');
 for(const st of stations){const b=B('',()=>update({...state,selected:st.id},true),'station-card');b.dataset.system=st.id;b.setAttribute('aria-pressed',String(st.id===station.id));b.setAttribute('aria-label',st.name);const top=E('div',undefined,'station-top');top.append(E('span',st.tag,'station-tag'));if(completed.includes(st.id))top.append(E('span','✓ Öğrenildi','station-done'));b.append(top,stationArt(st.id),E('strong',st.name,'station-name'),E('small',st.subtitle,'station-subtitle'),E('span',st.id===station.id?'Şu an buradasın':'Durağı aç →','station-link'));grid.append(b)}
 const panel=E('section',undefined,'explore-lesson');panel.dataset.system=station.id;panel.setAttribute('aria-label','Seçilen keşif durağı');const hero=E('div',undefined,'explore-lesson-hero');hero.append(stationArt(station.id));const text=E('div');text.append(E('small',systemNames[station.id]),E('h2',station.name),E('p',lesson.subtitle));hero.append(text);panel.append(hero);
 const lessonText=E('div',undefined,'explore-fact');lessonText.append(E('span','MERAK KÖŞESİ','explore-eyebrow'),E('h3',node.title),E('p',node.desc));panel.append(lessonText);
 const q=E('div',undefined,'explore-quiz');q.append(E('p','MİNİ SORU','explore-eyebrow'),E('h3',station.question));for(const [i,option] of station.options.entries()){const b=B('',()=>update(answerQuestion(state,station.id,i),false),'quiz-option');b.dataset.option=String(i);b.setAttribute('aria-pressed',String(picked===i));b.disabled=correct;b.append(E('span',String.fromCharCode(65+i),'quiz-letter'),E('span',option));if(picked===i)b.append(E('span',correct?'✓':'↺','quiz-mark'));if(picked===i)b.dataset.feedback=correct?'correct':'retry';q.append(b)}
 const feedback=E('div',undefined,'quiz-feedback');feedback.setAttribute('role','status');if(picked!==undefined){feedback.dataset.correct=String(correct);feedback.append(E('strong',correct?'Bir keşif tamamlandı!':'Bir daha dene.'),E('p',correct?node.limit:'Yukarıdaki kısa bilgiyi yeniden okuyabilirsin.'))}q.append(feedback);panel.append(q);
 const actions=E('div',undefined,'explore-actions');actions.append(B('İlgili tahlillerim →',()=>onLabs(station.id),'primary'),B('Fizyoloji şemasını aç',()=>onPhysiology(station.id),'quiet'));if(correct){const next=stations.find(s=>!completed.includes(s.id));if(next)actions.append(B('Sıradaki durak →',()=>update({...state,selected:next.id},true),'explore-next'));else actions.append(E('p','Dört durağı da keşfettin. Dilediğinde tekrar inceleyebilirsin.','explore-finish'))}panel.append(actions);const source=E('a',lesson.organization,'explore-source');source.href=lesson.source;source.target='_blank';source.rel='noopener noreferrer';panel.append(source,E('p','Eğitim içeriği. Kendi organ işlevini veya hastalık riskini ölçmez.','explore-disclaimer'));layout.append(grid,panel);root.append(layout)
}
