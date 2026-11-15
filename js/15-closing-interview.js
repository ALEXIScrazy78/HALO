// HALO | 15 closing interview
/* ---------- CIERRE ---------- */
function vCierre(){const ss=S.ss;
 return stepper()+`<div class="grid g2"><div class="card"><div class="row">${zambi(80)}<h2>Closing interview</h2></div>
 <p><b>How do you feel now?</b></p><div class="moods">${MOODS.map((m,i)=>`<button class="mood ${ss.moodEnd===i+1?'on':''}" data-me="${i+1}"><span>${m[0]}</span>${m[1]}</button>`).join('')}</div>
 <p style="margin-top:16px"><b>Was the support activity helpful?</b></p><div class="scale">${['Yes','A little','No','I did not try it'].map(o=>`<button data-u="${o}" class="${ss.util===o?'on':''}">${o}</button>`).join('')}</div>
 <p style="margin-top:16px"><b>Is there anything else you would like to share with Zambi?</b></p><textarea class="diary" id="cm" style="min-height:70px">${esc(ss.comment)}</textarea>
 <div class="row" style="margin-top:12px"><button class="btn p" id="save">Save session</button></div></div>
 <div class="card" id="endc"><h3>Summary</h3><div class="small muted">With your permission, history stores check-in scores, activity results, observed metrics, and initial/final mood. This prototype does not retain video, audio, or journal content.</div></div></div>`}
function bindCierre(){$$('[data-me]').forEach(b=>b.onclick=()=>{S.ss.moodEnd=+b.dataset.me;$$('[data-me]').forEach(x=>x.classList.toggle('on',x===b))});
 $$('[data-u]').forEach(b=>b.onclick=()=>{S.ss.util=b.dataset.u;$$('[data-u]').forEach(x=>x.classList.toggle('on',x===b))});
 $('#cm').oninput=e=>S.ss.comment=e.target.value;
 $('#save').onclick=()=>{const ss=S.ss,dx=ss.dx||computeDx();const rec={id:ss.id,date:ss.date,astro:ss.astro,scn:ss.scn,mood:ss.mood,moodEnd:ss.moodEnd,util:ss.util,f2:Object.fromEntries(DIMS.map(d=>[d.k,dx.dims[d.k].sc])),f3:ss.f3,f1:{metrics:ss.f1.metrics},levels:Object.fromEntries(DIMS.map(d=>[d.k,dx.dims[d.k].lv])),plan:ss.plan||[]};
  if(ss.consent.hist){H.push(rec);saveH()}
  const delta=ss.mood&&ss.moodEnd?ss.moodEnd-ss.mood:null;
  $('#endc').innerHTML=`<div style="text-align:center">${zambi(120)}<h2>Thank you, ${esc(ss.astro.split(' ')[0])}!</h2><p>${delta>0?'You reported feeling better at the end of the session.':delta===0?'Your reported mood was unchanged.':delta<0?'Thank you for sharing. Contact your health team if you need support.':'Session saved.'}</p><div class="note b" style="text-align:left">${FACTS[factI++%FACTS.length]}</div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn p" data-go="historial">Ver mi historial</button><button class="btn" data-go="inicio">New session</button></div></div>`;
  toast(ss.consent.hist?'Session saved to your history':'Session completed (not saved, as requested)')}}

