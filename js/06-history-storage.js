// HALO | 06 history storage
/* ================= historial ================= */
const KEY='kawsay3_hist';
function seed(){const now=Date.now(),D=864e5;const mk=(dAgo,scn,f2,pvt,mp,dsst,pauses,motion,m1,m2)=>({id:'s'+dAgo,date:new Date(now-dAgo*D).toISOString(),astro:'Anka Quispe',scn,mood:m1,moodEnd:m2,f2,f3:{pvt:{mean:pvt,lapses:pvt>320?3:0},mp:{mean:mp},dsst:{ok:dsst}},f1:{metrics:{pausesPerMin:pauses,motion,speakRatio:.62,mode:'demo'}},levels:{}});
 return[mk(21,'viaje',{estres:30,sueno:25,conflictos:17,soledad:33,fatiga:25},282,690,30,6.1,8.2,4,4),mk(14,'viaje',{estres:33,sueno:33,conflictos:17,soledad:42,fatiga:33},288,705,29,6.5,7.9,4,4),mk(7,'viaje',{estres:42,sueno:42,conflictos:25,soledad:50,fatiga:42},296,720,28,7.0,7.4,3,4)]}
function loadH(){try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch(e){}return seed()}
function saveH(){try{localStorage.setItem(KEY,JSON.stringify(H))}catch(e){}}
let H=loadH();
const past=()=>H.filter(h=>h.astro===S.astro);
function base(){const p=past();const g=f=>avg(p.map(f).filter(v=>v!=null&&!isNaN(v)));return{pvt:g(h=>h.f3?.pvt?.mean),mp:g(h=>h.f3?.mp?.mean),dsst:g(h=>h.f3?.dsst?.ok),pauses:g(h=>h.f1?.metrics?.pausesPerMin),motion:g(h=>h.f1?.metrics?.motion),f2:Object.fromEntries(DIMS.map(d=>[d.k,g(h=>h.f2?.[d.k])]))}}

