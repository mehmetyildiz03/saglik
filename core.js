export const KEY='pera-v1'; export const empty=()=>({version:1,labs:[],notes:[]});
const enc=new TextEncoder(),dec=new TextDecoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
const bytes=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
export async function derive(password,salt){const k=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function seal(data,key,salt){const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(data)));return JSON.stringify({v:1,salt:b64(salt),iv:b64(iv),cipher:b64(cipher)});}
export async function unseal(raw,password){const envelope=JSON.parse(raw);if(envelope.v!==1)throw Error('Desteklenmeyen kasa');const salt=bytes(envelope.salt),key=await derive(password,salt);const data=JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},key,bytes(envelope.cipher))));if(data.version!==1||!Array.isArray(data.labs)||!Array.isArray(data.notes))throw Error('Geçersiz veri');return {data,key,salt};}
export function status(r){if(!Number.isFinite(r.value)||!Number.isFinite(r.low)||!Number.isFinite(r.high)||r.low>r.high)return 'Referans yok';return r.value<r.low?'Aralık altında':r.value>r.high?'Aralık üstünde':'Aralık içinde';}
export function parseNumber(s){if(typeof s!=='string'||! /^-?\d+(?:[.,]\d+)?$/.test(s.trim()))return null;const n=Number(s.trim().replace(',','.'));return Number.isFinite(n)?n:null;}
export const series=(rows,name,unit)=>rows.filter(r=>r.name===name&&r.unit===unit).sort((a,b)=>a.date.localeCompare(b.date));
