import {validMedication} from './health.js';
export const KEY='pera-v1';
const enc=new TextEncoder(),dec=new TextDecoder(),MAX=8*1024*1024;
const b64=b=>{const a=new Uint8Array(b);let s='';for(let i=0;i<a.length;i+=16384)s+=String.fromCharCode(...a.subarray(i,i+16384));return btoa(s)};
const bytes=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
const short=(s,max=160)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
const optional=(s,max=160)=>s===undefined||s===''||short(s,max);
export const today=()=>new Date().toLocaleDateString('sv-SE');
export function validDate(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s&&s>='1900-01-01'&&s<=today()}
export function empty(){return {version:3,profiles:[{id:'self',name:'Ben',referenceMode:'report'}],labs:[],notes:[],meds:[]}}
export function normalizeData(input){
 if(!input||!Array.isArray(input.labs)||!Array.isArray(input.notes))throw Error('Kasa biçimi geçersiz.');
 let d=input;if(d.version===1)d={...empty(),labs:d.labs.map(r=>({...r,profileId:'self',origin:'manual'})),notes:d.notes.map(r=>({...r,profileId:'self'}))};
 if(d.version===2)d={...d,version:3,profiles:d.profiles?.map(p=>({...p,referenceMode:'report'})),meds:[]};
 if(d.version!==3||!Array.isArray(d.meds)||d.meds.length>3000||!Array.isArray(d.profiles)||d.profiles.length<1||d.profiles.length>20||d.labs.length>10000||d.notes.length>3000)throw Error('Kasa sınırları aşıldı veya sürümü desteklenmiyor.');
 const ids=new Set();for(const p of d.profiles){if(!p||!short(p.id,100)||!short(p.name,80)||ids.has(p.id)||!['report','context'].includes(p.referenceMode))throw Error('Profil verisi geçersiz.');ids.add(p.id)}
 const records=new Set();for(const r of [...d.labs,...d.notes,...d.meds]){if(!r||!short(r.id,100)||records.has(r.id)||!ids.has(r.profileId)||!validDate(r.date))throw Error('Kayıt kimliği veya tarihi geçersiz.');records.add(r.id)}
 for(const r of d.labs){if(!short(r.name)||!short(r.unit,80)||!Number.isFinite(r.value)||!optional(r.testId,80)||!optional(r.lab)||!optional(r.method)||!optional(r.rawUnit,80)||!optional(r.reportedFlag,24)||!optional(r.sourceLine,500)||!['manual','pdf','text'].includes(r.origin??'manual')||!(r.low===null&&r.high===null||Number.isFinite(r.low)&&Number.isFinite(r.high)&&r.low<=r.high)||!(r.page===undefined||r.page===null||Number.isInteger(r.page)&&r.page>=1&&r.page<=50))throw Error('Tahlil verisi geçersiz.')}
 for(const r of d.notes){if(!short(r.text,4000))throw Error('Günlük verisi geçersiz.')}
 for(const r of d.meds){if(!validMedication(r,validDate,short))throw Error('İlaç kaydı geçersiz.')}
 return d;
}
export async function derive(password,salt){if(typeof password!=='string'||password.length>1024||salt.length!==16)throw Error('Kasa anahtarı geçersiz.');const k=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
export async function seal(data,key,salt){const json=enc.encode(JSON.stringify(normalizeData(data)));if(json.length>MAX)throw Error('Kasa boyutu sınırı aşıldı.');const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,json);return JSON.stringify({v:1,salt:b64(salt),iv:b64(iv),cipher:b64(cipher)})}
export async function unseal(raw,password){if(typeof raw!=='string'||raw.length>MAX*2)throw Error('Yedek çok büyük.');const e=JSON.parse(raw);if(e.v!==1||typeof e.salt!=='string'||typeof e.iv!=='string'||typeof e.cipher!=='string')throw Error('Kasa biçimi geçersiz.');const salt=bytes(e.salt),iv=bytes(e.iv);if(salt.length!==16||iv.length!==12)throw Error('Kasa biçimi geçersiz.');const key=await derive(password,salt);const data=normalizeData(JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv},key,bytes(e.cipher)))));return {data,key,salt}}
export function status(r){if(!Number.isFinite(r.value)||!Number.isFinite(r.low)||!Number.isFinite(r.high)||r.low>r.high)return 'Referans yok';return r.value<r.low?'Aralık altında':r.value>r.high?'Aralık üstünde':'Aralık içinde'}
export function parseNumber(s){if(typeof s!=='string'||!/^-?\d+(?:[.,]\d+)?$/.test(s.trim()))return null;const n=Number(s.trim().replace(',','.'));return Number.isFinite(n)?n:null}
export function series(rows,name,unit,lab,method){return rows.filter(r=>(r.testId||r.name)===name&&r.unit===unit&&(lab===undefined||(r.lab||'')===lab)&&(method===undefined||(r.method||'')===method)).sort((a,b)=>a.date.localeCompare(b.date))}
export function sameMeasurement(a,b){return a.profileId===b.profileId&&(a.testId||a.name)===(b.testId||b.name)&&a.unit===b.unit&&a.date===b.date&&a.value===b.value&&(a.lab||'')===(b.lab||'')&&(a.method||'')===(b.method||'')}
