// HALO | 07 session state
/* ================= estado ================= */
const S={view:'inicio',scn:'estacion',astro:'Anka Quispe',ss:null};
function newSession(){S.ss={id:'s'+Date.now(),date:new Date().toISOString(),astro:S.astro,scn:S.scn,consent:{},f1:{chat:[],text:'',metrics:null,mode:'demo',asked:[],deep:[]},diary:'',diaryShare:false,mood:null,f2:{},f3:{},dx:null,activity:null,moodEnd:null,util:null,comment:''}}
const STEPS=[['fase1','Conversation'],['fase2','Check-in'],['fase3','Activities'],['dx','Summary'],['apoyo','Support'],['cierre','Closing']];
function stepper(){const i=STEPS.findIndex(s=>s[0]===S.view);return`<div class="steps">${STEPS.map((s,k)=>`<div class="step ${k===i?'on':k<i?'ok':''}"><b>${k<i?'✓':k+1}</b>${s[1]}</div>`).join('')}</div>`}
function go(v){cleanup();try{speechSynthesis.cancel()}catch(e){}S.view=v;render();window.scrollTo(0,0);botSay(TIPS[v]||TIPS.inicio,v!=='inicio')}

