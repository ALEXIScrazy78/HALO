// HALO | 14 support activity
/* ---------- APOYO ---------- */
function vApoyo(){const dx=S.ss.dx||computeDx(),ss=S.ss;const order=[...DIMS].sort((a,b)=>dx.dims[b.k].lv-dx.dims[a.k].lv);const top=order[0];
 return stepper()+`<div class="sectitle"><h2>Support activity</h2><span class="pill">Suggested for: ${top.n}</span></div>
 <div class="grid g2"><div class="card" style="text-align:center"><h3>Breathe with Zambi · 1 minute</h3><p class="small muted">Breathe in as the circle expands and breathe out as it contracts.</p><div class="breath" id="br">Ready</div><button class="btn p" id="bstart">Start</button></div>
 <div class="card"><h3>Your plan for this week</h3><p class="small muted">Choose what you would like to try. Your plan can guide your next session.</p>${order.filter(d=>dx.dims[d.k].lv>0).concat(dx.dims[top.k].lv?[]:[top]).slice(0,3).map(d=>`<div style="margin-top:12px"><b>${d.ico} ${d.n}</b>${REC[d.k][ss.scn].map((t,i)=>`<label class="chk"><input type="checkbox" data-plan="${d.k}:${i}"><span class="small">${t}</span></label>`).join('')}</div>`).join('')}</div></div>
 <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn p" id="next5">Go to closing interview →</button></div>`}
function bindApoyo(){let iv=null,t=0;$('#bstart').onclick=()=>{clearInterval(iv);t=0;const br=$('#br');const cyc=()=>{const inn=t%2===0;br.classList.toggle('in',inn);br.textContent=inn?'Breathe in…':'Breathe out…';if(inn)speak('Breathe in');else speak('Breathe out');t++;if(t>=14){clearInterval(iv);br.classList.remove('in');br.textContent='Well done!';S.ss.activity='respiracion';toast('Activity completed')}};cyc();iv=setInterval(cyc,4300)};
 CLEAN.push(()=>clearInterval(iv));
 $$('[data-plan]').forEach(c=>c.onchange=()=>{S.ss.plan=$$('[data-plan]:checked').map(x=>x.dataset.plan)});
 $('#next5').onclick=()=>go('cierre')}

