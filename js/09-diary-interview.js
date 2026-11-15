// HALO | 09 diary interview
/* ---------- FASE 1 ---------- */
let REC1=null;
function vFase1(){const f=S.ss.f1;
 return stepper()+`<div class="sectitle"><div><h2>Phase 1 · Video journal and interview</h2><div class="small muted">First, share your day freely. Then Zambi will ask thoughtful follow-up questions.</div></div><label class="row small"><input type="checkbox" id="voz" ${VOICE?'checked':''}> Hear Zambi</label></div>
 <div class="grid g2"><div class="card"><div class="video" id="vbox"><div id="vph" style="text-align:center">${zambi(150)}<div class="small muted">Camera preview</div></div><div class="rec" id="recb"><i></i><span id="rect">Not recording</span></div></div>
  <div class="row" style="margin-top:12px"><button class="btn p" id="r_start">Turn on camera</button><button class="btn" id="r_pause" disabled>Pause</button><button class="btn" id="r_stop" disabled>Finish</button><span class="small muted" id="mode"></span></div>
  <h3 style="margin-top:16px">Observable signals</h3><div class="small muted">Supplementary descriptive metrics, not emotional diagnoses.</div><div id="mets"></div></div>
 <div class="card"><div class="row" style="justify-content:space-between"><h3 id="conversationTitle">${f.diaryDone?'Guided interview':'Video journal'}</h3><span class="pill" id="turnStatus">${f.diaryDone?'Interview':'Open journal'}</span></div>
 <p class="small muted" id="phaseHelp">${f.diaryDone?'Zambi will ask questions based on what you shared.':'Speak freely without interruption. When finished, start the interview.'}</p>
 <div class="chat" id="chat" aria-live="polite"></div>
 <div class="row" style="margin-top:8px"><button class="btn p" id="listen" title="Start voice listening">🎙 Talk to Zambi</button><button class="btn sm" id="stoplisten" disabled>Stop listening</button><span class="small muted" id="listenStatus">Voice support depends on your browser</span></div>
 <div class="compose"><textarea id="ans" placeholder="Your response will appear here. You can also type…"></textarea><button class="btn p" id="send">Send</button></div>
 <div class="row" style="margin-top:10px"><button class="btn sm p" id="beginInterview" ${f.diaryDone?'style="display:none"':''}>Journal complete · Start interview →</button><button class="btn sm g" id="silence">I need a moment</button><button class="btn sm g" id="skipq">${f.diaryDone?'Another question':'Save my journal entry'}</button></div>
 <div class="note b" style="margin-top:12px">The prototype uses AI-assisted conversational guidance with rule-based fallback, not a clinical AI model. It cannot diagnose. Voice quality and recognition depend on the browser.</div></div></div>
 <div class="card" style="margin-top:16px"><h3>Optional written reflection</h3><p class="small muted" style="margin:4px 0 8px">You may add a private written note here if you wish.</p><textarea class="diary" id="diary" placeholder="Today…">${esc(S.ss.diary)}</textarea><label class="chk"><input type="checkbox" id="dshare" ${S.ss.diaryShare?'checked':''}><span class="small">Share this note with the health team</span></label></div>
 <div class="row" style="margin-top:16px;justify-content:flex-end"><button class="btn p" id="next1">Continue to check-in →</button></div>`}
function bindFase1(){
 const f=S.ss.f1,chat=$('#chat');f.diaryDone=!!f.diaryDone;f.followCount=f.followCount||{};f.asked=f.asked||[];f.deep=f.deep||[];
 let recognition=null,listening=false,speaking=false,shouldResume=false,finalTranscript='',silenceTimer=null,queuedTimer=null,pendingReq=null;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const status=t=>{const e=$('#listenStatus');if(e)e.textContent=t};
 const cancelAI=()=>{if(pendingReq){try{pendingReq.abort()}catch(e){}pendingReq=null}};
 const stopListen=()=>{shouldResume=false;listening=false;clearTimeout(silenceTimer);if(recognition){try{recognition.abort()}catch(e){}}recognition=null;$('#stoplisten').disabled=true;$('#listen').disabled=false;$('#listen').textContent='🎙 Talk to Zambi'};
 const add=(who,t)=>{f.chat.push({who,t});chat.insertAdjacentHTML('beforeend',`<div class="msg ${who}">${esc(t)}</div>`);chat.scrollTop=chat.scrollHeight};
 f.chat.forEach(m=>chat.insertAdjacentHTML('beforeend',`<div class="msg ${m.who}">${esc(m.t)}</div>`));
 const say=(t)=>{stopListen();add('z',t);if(!VOICE||!('speechSynthesis' in window)){status('Zambi replied in text');return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';const vs=speechSynthesis.getVoices(),v=vs.find(x=>x.lang==='en-US'&&/natural|neural|premium/i.test(x.name))||vs.find(x=>x.lang==='en-US')||vs.find(x=>/^en/i.test(x.lang)&&/natural|neural|premium/i.test(x.name))||vs.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;u.rate=.93;u.pitch=1.0;speaking=true;status('Zambi is speaking…');u.onend=u.onerror=()=>{speaking=false;status('Press “Talk to Zambi” to respond');};speechSynthesis.speak(u)}catch(e){speaking=false}};
 const keys=DIMS.map(x=>x.k);
 const topicLabel={estres:'the pressure you have been under',sueno:'your sleep',conflictos:'how things are going with your crewmates',soledad:'being far from loved ones',fatiga:'your mental fatigue'};
 const follow={
 estres:['Which situation has been the most stressful?','How has that pressure affected your day?'],
 sueno:['About how many hours of sleep have you been getting?','What in your environment has disrupted your sleep the most?'],
 conflictos:['What happened during that disagreement? You can leave out personal details.','What would help you feel more comfortable discussing it?'],
 soledad:['When is being away from loved ones most difficult?','What has helped you feel connected recently?'],
 fatiga:['During which tasks have you noticed fatigue or trouble concentrating?','Have you been able to take breaks or recover between those tasks?']};
 const coverage=()=>topics(f.text);
 const markTopics=(txt)=>{const hits=topics(txt);keys.forEach(k=>{if(hits[k]>0&&!f.asked.includes(k))f.asked.push(k)})};
 const fallbackNextQ=()=>{if(!f.diaryDone)return;const counts=coverage();let k=keys.find(k=>counts[k]>0&&!f.deep.includes(k));if(k){f.deep.push(k);f.asked.push(k);f.currentTopic=k;f.followCount[k]=0;return say('Thank you for telling me. I would like to understand more about '+topicLabel[k]+'. '+follow[k][0])}
  k=keys.find(k=>!f.asked.includes(k));if(k){f.asked.push(k);f.currentTopic=k;f.followCount[k]=0;return say(OPEN[k])}
  f.currentTopic=null;return say('Thank you for sharing how you have been doing. Is there anything else important for your well-being, or would you rather move on?')};
 const fallbackReact=(t)=>{if(!f.diaryDone)return;const txt=norm(t),counts=topics(t),hits=keys.filter(k=>counts[k]>0);const k=f.currentTopic;
  if(/don't want|do not want|rather not|skip|next question|prefer not to answer/.test(txt))return fallbackNextQ();
  if(/don't know|do not know|can't remember|cannot remember|not sure/.test(txt))return say('That is okay. You do not need an answer right now. '+(k?'Would you like to share an example, or move to another topic?':'Would you like to continue?'));
  if(k && hits.includes(k) && (f.followCount[k]||0)<1){f.followCount[k]=1;return say('Thank you. That gives me a better understanding. '+follow[k][1])}
  if(k && t.split(/\s+/).length<5 && (f.followCount[k]||0)<1){f.followCount[k]=1;return say('I am listening. Would you like to tell me a little more, only if you feel comfortable?')}
  return fallbackNextQ()};
 const respondWithAI=async(userText,isSkip=false)=>{
  markTopics(userText);
  if(typeof askGeminiZambi==='function'){
   cancelAI();
   pendingReq=new AbortController();
   status('Zambi is thinking…');
   const aiReply=await askGeminiZambi({session:S.ss,signal:pendingReq.signal});
   pendingReq=null;
   if(aiReply){
    const hits=topics(aiReply);
    const matched=keys.find(k=>hits[k]>0);
    if(matched){f.currentTopic=matched;if(f.diaryDone&&!f.deep.includes(matched))f.deep.push(matched)}
    return say(aiReply);
   }
  }
  if(isSkip)return fallbackNextQ();
  return fallbackReact(userText);
 };
 const nextQ=()=>{if(!f.diaryDone)return;respondWithAI(f.text||'next question',true)};
 const react=(t)=>{if(!f.diaryDone)return;respondWithAI(t,false)};
 const submit=(text=null)=>{const t=(text==null?$('#ans').value:text).trim();if(!t)return;stopListen();add('u',t);f.text+=' '+t;$('#ans').value='';finalTranscript='';if(REC1&&REC1.mode==='demo')REC1.typed(t);clearTimeout(queuedTimer);
  if(f.diaryDone){queuedTimer=setTimeout(()=>react(t),350)}
  else{queuedTimer=setTimeout(async()=>{
   if(typeof askGeminiZambi==='function'){
    cancelAI();
    pendingReq=new AbortController();
    status('Zambi is listening…');
    const r=await askGeminiZambi({session:S.ss,signal:pendingReq.signal});
    pendingReq=null;
    if(r){say(r);return}
   }
   status('Your journal entry is noted. You can keep talking or begin the interview.');
  },450)}};
 const begin=()=>{stopListen();cancelAI();try{speechSynthesis.cancel()}catch(e){}f.diaryDone=true;$('#conversationTitle').textContent='Guided interview';$('#turnStatus').textContent='Interview';$('#phaseHelp').textContent='Zambi will follow up on what you shared and ask about areas not yet explored.';$('#beginInterview').style.display='none';$('#skipq').textContent='Another question';say('Thank you for sharing your journal. I would like to ask a few questions to understand how you have been doing. Is that okay?');queuedTimer=setTimeout(nextQ,3900)};
 if(!f.chat.length)say(`Hello, ${S.astro.split(' ')[0]}. I’m Zambi. This is your video journal. You can tell me freely about your day during ${SCN[S.scn].n.toLowerCase()}. I won’t interrupt. When you are ready, we can talk about what you shared.`);
 $('#send').onclick=()=>submit();$('#ans').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}};
 $('#beginInterview').onclick=begin;
 $('#silence').onclick=()=>{stopListen();say('Of course. Take as much time as you need. Continue whenever you are ready.')};
 $('#skipq').onclick=()=>{if(!f.diaryDone)return submit();stopListen();nextQ()};
 $('#voz').onchange=e=>{VOICE=e.target.checked;if(!VOICE){try{speechSynthesis.cancel()}catch(x){}speaking=false}};
 $('#diary').oninput=e=>S.ss.diary=e.target.value;$('#dshare').onchange=e=>S.ss.diaryShare=e.target.checked;
 $('#next1').onclick=()=>{stopListen();cancelAI();clearTimeout(queuedTimer);if(REC1&&REC1.state!=='stopped')REC1.stop();go('fase2')};
 $('#listen').onclick=()=>{
 if(!SR||!S.ss.consent.tr){toast('Speech recognition is unavailable or was not authorized');return}
 if(speaking){try{speechSynthesis.cancel()}catch(e){}speaking=false}
 stopListen();shouldResume=true;recognition=new SR();recognition.lang='en-US';recognition.interimResults=true;recognition.continuous=false;
 recognition.onresult=e=>{let interim='',final='';for(let i=0;i<e.results.length;i++){const x=e.results[i];if(x.isFinal)final+=x[0].transcript+' ';else interim+=x[0].transcript}$('#ans').value=(final+interim).trim();if(final.trim()){finalTranscript=final.trim();status('Response recognized · processing…')}};
 recognition.onend=()=>{listening=false;recognition=null;$('#stoplisten').disabled=true;$('#listen').disabled=false;$('#listen').textContent='🎙 Talk to Zambi';if(shouldResume && finalTranscript.trim()){const t=finalTranscript;finalTranscript='';submit(t)}else status('You can press the microphone again')};
 recognition.onerror=e=>{shouldResume=false;status('Speech could not be recognized: '+e.error)};
 try{recognition.start();listening=true;$('#stoplisten').disabled=false;$('#listen').disabled=true;$('#listen').textContent='Listening…';status('🎙 Listening for your response…')}catch(e){stopListen();toast('Could not start microphone')}
 };
 $('#stoplisten').onclick=()=>{stopListen();status('Listening stopped. You can submit the text or try again.')};
 CLEAN.push(()=>{cancelAI();stopListen();clearTimeout(queuedTimer);try{speechSynthesis.cancel()}catch(e){}});
 REC1=recorder();renderMets();
 $('#r_start').onclick=()=>REC1.start();$('#r_pause').onclick=()=>REC1.pause();$('#r_stop').onclick=()=>REC1.stop();
}