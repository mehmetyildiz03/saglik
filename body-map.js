import {systems,catalogue} from './catalog.js';
const ns='http://www.w3.org/2000/svg';
function S(tag,attrs={}){const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e}
function H(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e}
export function bodyMap(rows,onSelect){
 const root=H('div',null,'body-map'),figure=H('div',null,'body-figure'),svg=S('svg',{viewBox:'0 0 300 430',role:'img','aria-label':'Şematik insan vücudu. Tahlil grupları yanındaki düğmelerden seçilebilir.'});
 svg.append(S('ellipse',{cx:150,cy:218,rx:119,ry:197,fill:'#f5f9f3'}));
 for(let i=0;i<3;i++)svg.append(S('ellipse',{cx:150,cy:218,rx:86+i*16,ry:164+i*13,fill:'none',stroke:'#dce8dc','stroke-width':1}));
 svg.append(S('circle',{cx:150,cy:53,r:28,fill:'#d6e4d7',stroke:'#9db7a4','stroke-width':1.5}));
 svg.append(S('path',{d:'M134 80 L134 94 Q110 98 97 110 L65 177 Q60 187 69 192 Q76 197 82 187 L115 143 L118 202 Q111 221 112 248 L113 322 L103 393 Q102 403 114 405 Q125 407 128 395 L143 312 L150 267 L157 312 L172 395 Q175 407 186 405 Q198 403 197 393 L187 322 L188 248 Q189 221 182 202 L185 143 L218 187 Q224 197 231 192 Q240 187 235 177 L203 110 Q190 98 166 94 L166 80 Z',fill:'#d6e4d7',stroke:'#9db7a4','stroke-width':1.5,'stroke-linejoin':'round'}));
 const organs=[
 ['thyroid','M150 111 C141 99 129 103 132 115 C134 125 145 122 150 116 C155 122 166 125 168 115 C171 103 159 99 150 111 Z','#a797d0',150,111],
 ['heart','M150 145 C137 129 123 143 133 157 L150 175 L168 157 C178 143 163 129 150 145 Z','#d67f86',150,151],
 ['liver','M120 179 Q143 169 168 179 Q176 187 168 196 L140 203 Q122 201 120 179 Z','#c89a6d',140,187],
 ['kidney','M128 213 Q116 210 116 225 Q116 238 129 240 Q142 235 134 226 Q129 222 136 217 Z M172 213 Q184 210 184 225 Q184 238 171 240 Q158 235 166 226 Q171 222 164 217 Z','#7b9fc8',172,226],
 ['metabolism','M144 209 Q155 201 164 210 Q171 220 159 226 Q150 232 140 224 Q135 216 144 209 Z','#e8b879',151,218]];
 for(const [id,d,fill,x,y] of organs){const g=S('g');g.append(S('path',{d,fill,stroke:'#fff','stroke-width':1.8}));const has=rows.some(r=>catalogue.some(t=>t[0]===r.testId&&t[2]===id));g.append(S('circle',{cx:x,cy:y,r:has?4:2.5,fill:has?'#20352f':'#fff',stroke:'#20352f','stroke-width':1}));svg.append(g)}
 const guide=H('p','Şematik anlatım · Organ işlevi veya hastalık derecesi göstermez.','muted');figure.append(svg,guide);
 const menu=H('div',null,'body-menu');for(const [id,title,icon,desc] of systems){const count=rows.filter(r=>(catalogue.find(t=>t[0]===r.testId)?.[2]||'other')===id).length;const b=H('button',null,'body-link');b.type='button';b.append(H('span',icon,'body-icon'),H('span',title,'body-title'),H('span',count?count+' kayıt':'Veri yok','body-count'));b.addEventListener('click',()=>onSelect(id));menu.append(b)}
 root.append(figure,menu);return root
}
