// HALO | 11 check in
/* ---------- FASE 2 ---------- */
function vFase2(){const qs=questions(S.scn),ans=S.ss.f2,n=Object.keys(ans).length;
 return stepper()+`<div class="sectitle"><h2>Phase 2 · Psychological check-in</h2><span class="pill">${SCN[S.scn].n}</span></div>
 <div class="card"><h3>How are you feeling right now?</h3><div class="moods" style="margin-top:10px">${MOODS.map((m,i)=>`<button class="mood ${S.ss.mood===i+1?'on':''}" data-mood="${i+1}"><span>${m[0]}</span>${m[1]}</button>`).join('')}</div></div>
 <div class="card" style="margin-top:16px"><div class="row" style="justify-content:space-between"><div><b>Think about your experiences over the past seven days.</b><div class="small muted">${qs.length} questions · about 3 minutes</div></div><div style="min-width:200px"><div class="small muted" id="cnt">${n} of ${qs.length} answers</div><div class="bar"><div id="pbar" style="width:${n/qs.length*100}%"></div></div></div></div>
 ${DIMS.map(d=>`<div class="dimh" style="margin-top:18px"><div class="ico">${d.ico}</div><h3>${d.n}</h3></div>${qs.filter(q=>q.dim===d.k).map(q=>`<div class="q"><p>${esc(q.t)}${q.id.endsWith('_s')?' <span class="tag">'+SCN[S.scn].n+'</span>':''}</p><div class="scale">${SCALE.map((s,v)=>`<button data-q="${q.id}" data-v="${v}" class="${ans[q.id]===v?'on':''}">${s}</button>`).join('')}</div></div>`).join('')}`).join('')}
 <div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn g" id="clr">Clear answers</button><button class="btn p" id="next2">Continue to cognitive activities →</button></div></div>`}
function bindFase2(){const qs=questions(S.scn);
 $$('[data-mood]').forEach(b=>b.onclick=()=>{S.ss.mood=+b.dataset.mood;$$('[data-mood]').forEach(x=>x.classList.toggle('on',x===b))});
 $$('[data-q]').forEach(b=>b.onclick=()=>{S.ss.f2[b.dataset.q]=+b.dataset.v;$$(`[data-q="${b.dataset.q}"]`).forEach(x=>x.classList.toggle('on',x===b));const n=Object.keys(S.ss.f2).length;$('#cnt').textContent=`${n} of ${qs.length} answers`;$('#pbar').style.width=n/qs.length*100+'%'});
 $('#clr').onclick=()=>{S.ss.f2={};render()};
 $('#next2').onclick=()=>{const n=Object.keys(S.ss.f2).length;if(n<qs.length&&!confirm2())return;go('fase3')};
}
let warned=false;function confirm2(){if(warned)return true;warned=true;toast(`Some answers are missing. Press again to continue anyway.`);return false}

