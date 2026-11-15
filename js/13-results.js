// HALO | 13 results
/* ---------- DIAGNÓSTICO ---------- */
function computeDx(){const ss=S.ss,qs=questions(ss.scn),b=base(),tp=topics(ss.f1.text+' '+(ss.diaryShare?ss.diary:'')),f3=ss.f3,m=ss.f1.metrics;
 const pv=f3.pvt&&b.pvt?pct(f3.pvt.mean,b.pvt):null,mpP=f3.mp&&b.mp?pct(f3.mp.mean,b.mp):null,dsP=f3.dsst&&b.dsst?pct(f3.dsst.ok,b.dsst):null;
 const fatObj=(pv!=null&&pv>=15)||(f3.pvt&&f3.pvt.lapses>=3)||(mpP!=null&&mpP>=20)||(dsP!=null&&dsP<=-20);
 const out={};
 DIMS.forEach(d=>{const items=qs.filter(q=>q.dim===d.k&&ss.f2[q.id]!=null).map(q=>q.inv?4-ss.f2[q.id]:ss.f2[q.id]);
  const sc=items.length?Math.round(avg(items)*25):null,prev=b.f2[d.k];let lv=0;const ev=[];
  if(sc!=null){if(sc>=75)lv=2;else if(sc>=50||(prev!=null&&sc-prev>=20))lv=1;ev.push(`Check-in: ${sc}/100${prev!=null?` (your average: ${Math.round(prev)})`:''}`)}else ev.push('Check-in: no responses');
  if(tp[d.k]>0){ev.push(`You mentioned this ${tp[d.k]} ${tp[d.k]===1?'time':'times'} while speaking with Zambi`);if(lv===0&&tp[d.k]>=2)lv=1}
  if(d.k==='fatiga'||d.k==='sueno'){if(f3.pvt)ev.push(`Stellar Reflex: ${f3.pvt.mean} ms${pv!=null?` (${pv>=0?'+':''}${Math.round(pv)} % vs. your baseline)`:''}, ${f3.pvt.lapses} lapses`);
   if(d.k==='fatiga'){if(f3.dsst)ev.push(`Star Code: ${f3.dsst.ok} correct${dsP!=null?` (${dsP>=0?'+':''}${Math.round(dsP)} %)`:''}`);if(f3.mp)ev.push(`Meteor Chase: ${f3.mp.mean} ms${mpP!=null?` (${mpP>=0?'+':''}${Math.round(mpP)} %)`:''}`)}
   if(fatObj){lv=Math.max(lv,1);if(sc!=null&&sc>=50)lv=2}}
  if(d.k==='fatiga'&&m&&b.pauses&&m.pausesPerMin>b.pauses*1.3)ev.push(`Additional observation: longer pauses in speech than your baseline (${m.pausesPerMin} vs. ${rd(b.pauses,1)}/min)`);
  out[d.k]={sc,lv,ev}});
 const obs=[];if(m){if(b.pauses&&m.pausesPerMin>b.pauses*1.3)obs.push('More long speech pauses than in prior sessions.');if(b.pauses&&m.pausesPerMin<b.pauses*.7)obs.push('Fewer speech pauses than in prior sessions.');if(b.motion&&m.motion!=null&&m.motion<b.motion*.7)obs.push('Less movement on camera than in prior sessions.');if(b.motion&&m.motion!=null&&m.motion>b.motion*1.3)obs.push('More movement on camera than in prior sessions.')}
 ss.dx={dims:out,obs,mode:m?m.mode:null};return ss.dx}
const LVN=['Good','Needs attention','Priority follow-up'];
function vDx(){const dx=computeDx(),ss=S.ss,lvls=DIMS.map(d=>dx.dims[d.k].lv),mx=Math.max(...lvls);
 const head=mx===0?'No elevated indicators in this prototype summary. Keep supporting your well-being.':mx===1?`There are ${lvls.filter(l=>l===1).length} areas worth paying attention to this week.`:'Some indicators warrant review with the health team.';
 return stepper()+`<div class="card" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">${zambi(96)}<div style="flex:1;min-width:260px"><span class="pill">${SCN[ss.scn].n} · session ${past().length+1}</span><h2 style="margin-top:8px">${head}</h2><p class="muted" style="margin:6px 0 0">This summary combines your conversation, check-in, and activities with previous sessions. It is not a clinical diagnosis.</p></div>${ss.mood?`<div style="text-align:center"><div style="font-size:40px">${MOODS[ss.mood-1][0]}</div><div class="small muted">Mood at start</div></div>`:''}</div>
 <div class="grid g3" style="margin-top:16px">${DIMS.map(d=>{const r=dx.dims[d.k];return`<div class="card dcard lv${r.lv}"><div class="row" style="justify-content:space-between"><div class="row"><span style="font-size:22px">${d.ico}</span><h3>${d.n}</h3></div><span class="lvl">${LVN[r.lv]}</span></div><div class="bar" style="margin:10px 0"><div style="width:${r.sc??0}%;background:var(--lc)"></div></div>${r.ev.map(e=>`<div class="ev">${esc(e)}</div>`).join('')}
  <div class="recs" style="margin-top:10px"><b class="small">${d.strat}</b><ul class="small">${REC[d.k][ss.scn].slice(0,r.lv?3:1).map(t=>`<li>${t}</li>`).join('')}</ul></div></div>`}).join('')}
 <div class="card"><h3>Observable changes</h3><p class="small muted">From your conversation with Zambi${dx.mode==='demo'?' (simulated in demo mode)':''}. These describe changes relative to your own baseline, not emotions.</p>${dx.obs.length?dx.obs.map(o=>`<div class="ev" style="--lc:var(--sc)">${o}</div>`).join(''):'<div class="small">No notable differences from previous sessions.</div>'}
  ${mx===2?'<div class="note" style="margin-top:12px">Consider speaking with the medical or behavioral health team. If you feel unsafe, notify your designated crew medical officer immediately.</div>':''}</div></div>
 <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn p" id="next4">Choose a support activity →</button></div>`}

