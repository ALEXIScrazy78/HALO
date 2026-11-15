// HALO | 12 cognitive activities
/* ---------- FASE 3 ---------- */
function vFase3(){const f=S.ss.f3,b=base();
 const card=(k,ico,n,test,mide,res)=>`<div class="card gcard"><div class="gico">${ico}</div><div style="flex:1"><h3>${n}</h3><div class="small muted">Based on: ${test}</div><div class="small">${mide}</div><div style="margin-top:8px">${res?`<span class="done">✓ ${res}</span> <button class="btn sm g" data-game="${k}">Repeat</button>`:`<button class="btn sm p" data-game="${k}">Play</button>`}</div></div></div>`;
 return stepper()+`<div class="sectitle"><h2>Phase 3 · Reaction and cognitive activities</h2></div>
 <div class="grid g2"><div class="grid">${card('pvt','⚡','Stellar Reflex','PVT (ISS Reaction Self Test)','Sustained attention and fatigue · 60 s',f.pvt?`${f.pvt.mean} ms · ${f.pvt.lapses} lapses`:null)}
 ${card('mp','☄️','Meteor Chase','Motor Praxis (NASA Cognition battery)','Motor speed and accuracy · 20 targets',f.mp?`${f.mp.mean} ms per target`:null)}
 ${card('dsst','✦','Star Code','Digit Symbol Substitution (Cognition)','Processing speed · 45 s',f.dsst?`${f.dsst.ok} correct`:null)}
 <div class="card"><h3>Team mode (active break)</h3><div class="small muted">Take turns playing Stellar Reflex. This is a recreational activity, not a clinical evaluation.</div><div class="row" style="margin-top:8px"><input id="players" value="Anka, Rumi, Killa" style="flex:1;border:2px solid var(--line);border-radius:12px;padding:8px"><button class="btn sm" data-game="duel">Play as a team</button></div></div></div>
 <div class="card" id="area"><h3>Activity area</h3><p class="muted">Choose an activity. Results are experimental and should not be interpreted as clinical measures.</p>${b.pvt?`<div class="note b">Your baseline: reaction ${Math.round(b.pvt)} ms · Meteor Chase ${Math.round(b.mp)} ms · Star Code ${Math.round(b.dsst)} correct</div>`:''}</div></div>
 <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn p" id="next3">View well-being summary →</button></div>`}
function bindFase3(){$$('[data-game]').forEach(b=>b.onclick=()=>{cleanup();const a=$('#area'),k=b.dataset.game;
 if(k==='pvt'){a.innerHTML='<h3>Stellar Reflex</h3><div class="small muted">Tap the box (or press Space) as soon as the counter appears. 60 seconds.</div><div id="g" style="margin-top:8px"></div>';pvt($('#g'),{limitMs:60000,title:'Tap to start',onDone:r=>{S.ss.f3.pvt=r;render();toast('Stellar Reflex recorded')}})}
 if(k==='mp')praxis(a,r=>{S.ss.f3.mp=r;render();toast('Meteor Chase recorded')});
 if(k==='dsst')dsst(a,r=>{S.ss.f3.dsst=r;render();toast('Star Code recorded')});
 if(k==='duel'){const ps=$('#players').value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,6);if(ps.length<2){toast('Enter at least two names');return}duel(a,ps)}});
 $('#next3').onclick=()=>go('dx')}
function summary(rts,fs){const s=[...rts].sort((a,b)=>a-b);return{n:rts.length,mean:rts.length?Math.round(avg(rts)):0,best:s[0]||0,lapses:rts.filter(x=>x>=355).length,fs}}
function pvt(el,{limitMs=null,count=null,title,onDone}){
 let rts=[],fs=0,st='ready',t0=0,timer=null,raf=null,iv=null,start=0;
 el.innerHTML=`<div class="pvt" id="pb"><div><div class="big" id="pc">Ready!</div><div class="small" id="ph">${esc(title)}</div></div></div><div class="prog"><div id="pp"></div></div><div class="small muted" id="ps" style="margin-top:6px"></div>`;
 const box=el.querySelector('#pb'),C=el.querySelector('#pc'),Hh=el.querySelector('#ph'),P=el.querySelector('#pp'),St=el.querySelector('#ps');
 const fin=()=>(limitMs&&performance.now()-start>=limitMs)||(count&&rts.length>=count);
 const prog=()=>{const p=limitMs?Math.min(1,(performance.now()-start)/limitMs):rts.length/count;P.style.width=p*100+'%';St.textContent=`Responses: ${rts.length}${count?'/'+count:''} · Early taps: ${fs}`};
 const sched=()=>{if(fin())return end();st='wait';box.className='pvt wait';C.textContent='···';Hh.textContent='Wait for the counter';timer=setTimeout(goo,1800+Math.random()*2800)};
 const goo=()=>{if(fin())return end();st='go';box.className='pvt go';Hh.textContent='Tap now!';t0=performance.now();tick()};
 const tick=()=>{if(st!=='go')return;const e=performance.now()-t0;C.textContent=Math.round(e);if(e>10000)return hit();raf=requestAnimationFrame(tick)};
 function hit(){if(st==='ready'){start=performance.now();iv=setInterval(prog,250);sched();return}
  if(st==='wait'){fs++;clearTimeout(timer);st='pause';box.className='pvt early';C.textContent='Too soon!';Hh.textContent='Wait for the counter to appear';setTimeout(sched,900);return}
  if(st==='go'){const rt=Math.round(performance.now()-t0);cancelAnimationFrame(raf);rts.push(rt);st='pause';box.className='pvt';C.textContent=rt+' ms';Hh.textContent=rt>=355?'A bit slow':'Good!';prog();setTimeout(sched,650)}}
 const kd=e=>{if(e.code==='Space'&&document.body.contains(box)){e.preventDefault();hit()}};
 function stop(){clearTimeout(timer);clearInterval(iv);cancelAnimationFrame(raf);document.removeEventListener('keydown',kd)}
 function end(){if(st==='done')return;st='done';stop();prog();onDone(summary(rts,fs))}
 box.onclick=hit;document.addEventListener('keydown',kd);CLEAN.push(stop);
}
function duel(a,ps){let i=0;const res=[];
 const next=()=>{if(i>=ps.length)return show();a.innerHTML=`<h3>Team mode · turn ${i+1}/${ps.length}: <span style="color:var(--sc3)">${esc(ps[i])}</span></h3><div class="small muted">5 responses</div><div id="g" style="margin-top:8px"></div>`;pvt($('#g'),{count:5,title:esc(ps[i])+', tap to start',onDone:r=>{res.push({p:ps[i],r});i++;setTimeout(next,700)}})};
 const show=()=>{const s=[...res].sort((x,y)=>x.r.mean-y.r.mean);a.innerHTML=`<h3>Team results</h3><table><tr><th>#</th><th>Player</th><th>Average</th><th>Best</th></tr>${s.map((z,k)=>`<tr><td>${k===0?'🏆':k+1}</td><td><b>${esc(z.p)}</b></td><td>${z.r.mean} ms</td><td>${z.r.best} ms</td></tr>`).join('')}</table><p class="small muted">Team average: ${Math.round(avg(res.map(z=>z.r.mean)))} ms. This team activity is for recreation; results are not clinical.</p><button class="btn sm" id="again">Play again</button>`;$('#again').onclick=()=>duel(a,ps)};
 next()}
function praxis(a,onDone){a.innerHTML=`<h3>Meteor Chase</h3><div class="small muted">Tap each meteor as quickly as possible. There are 20 targets, each smaller than the previous one.</div><div class="arena" id="ar" style="margin-top:8px"><div style="display:grid;place-items:center;height:100%"><button class="btn p" id="st">Start</button></div></div><div class="small muted" id="ms" style="margin-top:6px"></div>`;
 const ar=$('#ar');let n=0,t0=0,times=[],miss=0,live=true,started=false;
 const spawn=()=>{if(!live)return;if(n>=20)return fin();const W=ar.clientWidth,Hh=ar.clientHeight,s=Math.round(64-n*2.4);ar.innerHTML=`<div class="met" style="width:${s}px;height:${s}px;left:${Math.random()*(W-s)}px;top:${Math.random()*(Hh-s)}px"></div>`;t0=performance.now();
  ar.querySelector('.met').onclick=e=>{e.stopPropagation();times.push(performance.now()-t0);n++;$('#ms').textContent=`${n}/20 · misses ${miss}`;spawn()}};
 ar.onclick=()=>{if(started)miss++};$('#st').onclick=e=>{e.stopPropagation();started=true;spawn()};CLEAN.push(()=>{live=false});
 const fin=()=>{live=false;onDone({mean:Math.round(avg(times)),miss})}}
function dsst(a,onDone){const SY=['◆','●','▲','■','★','✚','⬟','◐','✦'],dig=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5),map={};SY.forEach((s,i)=>map[s]=dig[i]);
 a.innerHTML=`<h3>Star Code</h3><div class="small muted">Each symbol maps to a number. The mapping changes each round. Select the number corresponding to the large symbol. 45 seconds.</div><div class="legend">${SY.map(s=>`<div>${s}<small>${map[s]}</small></div>`).join('')}</div><div class="sym" id="sy">?</div><div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-n="${n}" disabled>${n}</button>`).join('')}</div><div class="prog"><div id="dp"></div></div><div class="row" style="margin-top:8px"><button class="btn p" id="st">Start</button><span class="small muted" id="ds"></span></div>`;
 let cur=null,ok=0,bad=0,t0=0,iv=null;const nx=()=>{let s;do{s=SY[Math.floor(Math.random()*9)]}while(s===cur);cur=s;$('#sy').textContent=s};
 const pad=[...a.querySelectorAll('[data-n]')];pad.forEach(b=>b.onclick=()=>{if(+b.dataset.n===map[cur])ok++;else bad++;$('#ds').textContent=`Correct: ${ok} · Errors: ${bad}`;nx()});
 $('#st').onclick=()=>{$('#st').remove();pad.forEach(b=>b.disabled=false);t0=performance.now();nx();iv=setInterval(()=>{const p=(performance.now()-t0)/45000;$('#dp').style.width=Math.min(100,p*100)+'%';if(p>=1){clearInterval(iv);onDone({ok,bad})}},200)};
 CLEAN.push(()=>clearInterval(iv))}

