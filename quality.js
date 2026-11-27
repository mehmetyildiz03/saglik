// Display limits only; original measurements are never removed or resampled.
export const LIST_SIZE=40,PLOT_SIZE=180;
export function pageWindow(items,page=0,size=LIST_SIZE){
 if(!Number.isInteger(size)||size<1)throw Error('Geçersiz sayfa boyutu.');
 const count=Math.max(1,Math.ceil(items.length/size)),index=Math.max(0,Math.min(count-1,Number.isInteger(page)?page:0)),start=index*size,end=Math.min(start+size,items.length);
 return {items:items.slice(start,end),index,count,start,end,total:items.length}
}
export function recordPage(items,id,size=LIST_SIZE){const index=items.findIndex(r=>r.id===id);return index<0?0:Math.floor(index/size)}
export function plotWindow(rows,chosen,limit=PLOT_SIZE){
 if(!Number.isInteger(limit)||limit<1)throw Error('Geçersiz grafik sınırı.');
 if(rows.length<=limit)return {rows,limited:false,oversized:false};
 const groups=new Map();for(const r of rows){const bucket=groups.get(r.date)||[];bucket.push(r);groups.set(r.date,bucket)}
 const dates=[...groups.keys()].sort(),found=dates.indexOf(chosen),index=found<0?dates.length-1:found;let left=index,right=index,n=groups.get(dates[index]).length;
 if(n>limit)return {rows:[],limited:true,oversized:true};
 while(left>0||right<dates.length-1){const a=left>0?groups.get(dates[left-1]).length:Infinity,b=right<dates.length-1?groups.get(dates[right+1]).length:Infinity;if(n+a>limit&&n+b>limit)break;
 // Contiguous dates only; never bridge an omitted ambiguous date.
 if(n+a<=limit&&(n+b>limit||index-left<=right-index)){left--;n+=a}else{right++;n+=b}
 }
 return {rows:dates.slice(left,right+1).flatMap(d=>groups.get(d)),limited:true,oversized:false,start:dates[left],end:dates[right]}
}
export function storageSize(raw){return typeof raw==='string'?new TextEncoder().encode(raw).byteLength:0}
export function storageError(error){return error?.name==='QuotaExceededError'?'Tarayıcı depolaması dolu. Değişiklik kaydedilmedi; şifreli yedek indirip alanı kontrol et.':error?.name==='SecurityError'?'Tarayıcı depolamasına erişilemiyor. Değişiklik kaydedilmedi.':error?.message||'Kasa yazılamadı.'}
