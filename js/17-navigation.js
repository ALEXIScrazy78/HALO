// HALO | 17 navigation
/* ================= render ================= */
function render(){
 document.body.className=S.scn;
 $('#hdr').innerHTML=S.view==='inicio'||S.view==='historial'?`<span class="pill">👩‍🚀 ${esc(S.astro)}</span>`:`<span class="pill">${SCN[S.scn].n}</span><span class="pill">👩‍🚀 ${esc(S.astro)}</span>`;
 const V={inicio:vInicio,consent:vConsent,fase1:vFase1,fase2:vFase2,fase3:vFase3,dx:vDx,apoyo:vApoyo,cierre:vCierre,historial:vHist};
 $('#view').innerHTML=V[S.view]();
 if(S.view==='inicio'){$('#astro').onchange=e=>{S.astro=e.target.value.trim()||'Astronaut';render()};$$('[data-scn]').forEach(c=>c.onclick=()=>{S.astro=$('#astro').value.trim()||'Astronaut';S.scn=c.dataset.scn;newSession();go('consent')})}
 if(S.view==='consent')$('#start').onclick=()=>{if(!$('#c_ok').checked){toast('Check the final box to continue');return}S.ss.consent={cam:$('#c_cam').checked,tr:$('#c_tr').checked,hist:$('#c_hist').checked};warned=false;go('fase1')};
 if(S.view==='fase1')bindFase1();
 if(S.view==='fase2')bindFase2();
 if(S.view==='fase3')bindFase3();
 if(S.view==='dx')$('#next4').onclick=()=>go('apoyo');
 if(S.view==='apoyo')bindApoyo();
 if(S.view==='cierre')bindCierre();
 if(S.view==='historial'){$('#hsel').onchange=e=>{S.astro=e.target.value;render()};$('#reset').onclick=()=>{H=seed();saveH();render();toast('Sample data restored')}}
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go]');if(t)go(t.dataset.go)});
render();setTimeout(()=>botSay(TIPS.inicio),600);
