// HALO | 02 zambi chatbot
/* ================= Zambi (zambullidor de Junín) ================= */
const ZAMBI_IMAGE='assets/zambi_grebe.png';
function zambi(size=80,cls=''){return `<span class="zambi-wrap ${cls}" style="--birdsize:${size}px" role="img" aria-label="Zambi, Junín grebe"><img class="zambi-real" src="${ZAMBI_IMAGE}" alt="Junín grebe" draggable="false"></span>`}
const FACTS=[
 'I am a Junín grebe. My only home is Lake Junín (Chinchaycocha), more than 4,000 meters above sea level.',
 'My species is critically endangered. Protecting Lake Junín is essential to our survival.',
 'I cannot fly, so I spend my life on the lake. I know something about living within a confined environment.',
 'Pollution and the loss of wetland vegetation threaten my habitat.',
 'I am a symbol of biodiversity conservation in Junín, Peru.'];
let factI=0;
const TIPS={inicio:'Hello! I’m Zambi. Choose your mission environment and I’ll guide you step by step.',consent:'Before we begin, choose what information you agree to share. You are in control.',fase1:'Tell me about your day in your own words. Take your time.',fase2:'Think about the past seven days. There are no right or wrong answers.',fase3:'Ready for some brief cognitive activities? We will track your performance over time.',dx:'Here is a summary of today’s observations. This is not a clinical diagnosis.',apoyo:'Let’s try a guided activity together.',cierre:'Before we finish, how are you feeling now?',historial:'Review how your results have changed across sessions.'};
function botSay(t,open=true){const b=$('#botBubble');b.innerHTML=`<div>${esc(t)}</div><div class="bt"><button class="btn sm" id="fact">Conservation fact</button><button class="btn sm g" id="bclose">Close</button></div>`;if(open){b.classList.add('on');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('on'),8000)}$('#fact').onclick=()=>{botSay(FACTS[factI++%FACTS.length])};$('#bclose').onclick=()=>b.classList.remove('on')}
$('#botBtn').innerHTML=zambi(76);$('#hz').innerHTML=zambi(44);
$('#botBtn').title='Click to see Zambi dive and toggle guidance';
$('#botBtn').onclick=()=>{const btn=$('#botBtn'),b=$('#botBubble');btn.classList.remove('diving');void btn.offsetWidth;btn.classList.add('diving');clearTimeout(btn._dive);btn._dive=setTimeout(()=>btn.classList.remove('diving'),1400);if(b.classList.contains('on')){b.classList.remove('on')}else{botSay(TIPS[S.view]||TIPS.inicio);}};

/* voz de Zambi */
let VOICE=true;function speak(t){try{if(!VOICE||!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';const vs=speechSynthesis.getVoices();const v=vs.find(v=>v.lang==='en-US'&&(/natural|neural|online|premium/i.test(v.name)))||vs.find(v=>v.lang==='en-US')||vs.find(v=>/^en/i.test(v.lang)&&/natural|neural|online|premium/i.test(v.name))||vs.find(v=>/^en/i.test(v.lang));if(v)u.voice=v;u.rate=.93;u.pitch=1.0;speechSynthesis.speak(u)}catch(e){}}

