import {resultLabel,exact,safeReference,measurementKey} from './measurement.js';
export function validMedication(r,validDate,short){
 return r&&short(r.name,160)&&short(r.dose,120)&&short(r.schedule,160)&&validDate(r.date)&&(r.end===null||validDate(r.end)&&r.end>=r.date)&&['prescription','otc','supplement','other'].includes(r.kind)&&typeof r.note==='string'&&r.note.length<=1000;
}
export const activeMedication=(m,date)=>m.date<=date&&(m.end===null||m.end>=date);
export function timeline(data,profileId){
 const events=[];
 for(const r of data.labs)if(r.profileId===profileId)events.push({date:r.date,kind:'lab',id:r.id,recordId:r.id,key:measurementKey(r),title:r.name,detail:resultLabel(r),reference:safeReference(r),origin:r.origin||'manual'});
 for(const r of data.notes)if(r.profileId===profileId)events.push({date:r.date,kind:'note',id:r.id,recordId:r.id,title:'Günlük notu',detail:r.text});
 for(const m of data.meds)if(m.profileId===profileId){events.push({date:m.date,kind:'medicine',id:m.id+':start',recordId:m.id,phase:'start',title:m.name+' · Başlangıç kaydı',detail:m.dose+' · '+m.schedule});if(m.end)events.push({date:m.end,kind:'medicine',id:m.id+':end',recordId:m.id,phase:'end',title:m.name+' · Bitiş kaydı',detail:'Kullanıcının kaydettiği bitiş tarihi'});}
 return events.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export function nonHDL(tc,hdl,confirmedSameSample){
 if(!confirmedSameSample||!tc||!hdl||tc.testId!=='tc'||hdl.testId!=='hdl'||tc.profileId!==hdl.profileId||tc.date!==hdl.date||tc.unit!==hdl.unit||!['mg/dL','mmol/L'].includes(tc.unit)||!exact(tc)||!exact(hdl)||tc.value<=0||hdl.value<=0||tc.value<hdl.value||(tc.lab||'')!==(hdl.lab||''))return null;
 const raw=tc.value-hdl.value;
 return {value:Number(raw.toPrecision(12)),unit:tc.unit,date:tc.date,sourceIds:[tc.id,hdl.id],formula:'TC − HDL-C',source:'https://doi.org/10.1016/j.jacc.2025.11.016'};
}
