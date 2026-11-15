// HALO | 01 utils
const IS_LOCAL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const DEFAULT_RENDER_URL = "https://halo-yw4a.onrender.com";

const HALO_API_BASE =
  window.HALO_API_BASE ||
  (IS_LOCAL ? "http://127.0.0.1:8000" : DEFAULT_RENDER_URL);

const HALO_EMOTION_API_BASE =
  window.HALO_EMOTION_API_BASE ||
  (IS_LOCAL ? "http://127.0.0.1:8000" : DEFAULT_RENDER_URL);

/* ================= utilidades ================= */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const rd=(x,k=0)=>{const p=10**k;return Math.round(x*p)/p};
const pct=(v,b)=>(v-b)/b*100;
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2800)}
let CLEAN=[];function cleanup(){CLEAN.forEach(f=>{try{f()}catch(e){}});CLEAN=[]}

