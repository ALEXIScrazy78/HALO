// HALO | 04 psychology questions
/* ================= dimensiones y preguntas ================= */
const DIMS=[
 {k:'estres',n:'Psychological stress',ico:'🌀',strat:'Emotional regulation and recovery'},
 {k:'sueno',n:'Sleep disturbances',ico:'🌙',strat:'Rest planning and sleep routines'},
 {k:'conflictos',n:'Interpersonal conflict',ico:'🤝',strat:'Coordination, clear roles, and communication'},
 {k:'soledad',n:'Loneliness and isolation',ico:'💬',strat:'Social connection and peer support'},
 {k:'fatiga',n:'Mental fatigue',ico:'🔋',strat:'Recovery breaks and workload management'}];
const QC={ // comunes: [texto, inversa]
 estres:[['Have you felt tense or under pressure?',0],['Have you felt able to manage the demands of your day?',1]],
 sueno:[['Have you had trouble falling or staying asleep?',0],['Have you felt rested enough before important activities?',1]],
 conflictos:[['Have you experienced friction or disagreements with crewmates?',0],['Have you felt heard and respected by your crewmates?',1]],
 soledad:[['Have you felt lonely?',0],['Have you felt emotionally disconnected from people on Earth?',0]],
 fatiga:[['Have you felt mentally exhausted at the end of the day?',0],['Have you struggled to stay focused on demanding tasks?',0]]};
const QS={
 estacion:{estres:'Have experiments and maintenance tasks put you under pressure?',sueno:'Have lighting cycles or schedule changes disrupted your sleep?',conflictos:'Has prolonged sharing of common spaces created tension?',soledad:'Has station life made you feel distant from your life on Earth?',fatiga:'Have repetitive station routines left you mentally drained?'},
 viaje:{estres:'Have you worried about not getting immediate support from Earth?',sueno:'Have spacecraft noise or tight quarters affected your rest?',conflictos:'Has limited personal space caused friction with crewmates?',soledad:'Has the communication delay with Earth increased your sense of isolation?',fatiga:'Has the monotony of transit affected your concentration?'},
 luna:{estres:'Have you felt tense or worried before exploration activities?',sueno:'Have exploration operations interfered with your rest periods?',conflictos:'Have you disagreed about how responsibilities are assigned?',soledad:'Have you had too few opportunities for social interaction?',fatiga:'Have exploration activities left you mentally exhausted?'}};
const SCALE=['Never','Rarely','Sometimes','Often','Always'];
const MOODS=[['😣','Very low'],['😕','Low'],['😐','Okay'],['🙂','Good'],['😄','Very good']];
function questions(scn){const out=[];DIMS.forEach(d=>{QC[d.k].forEach((q,i)=>out.push({id:d.k+'_c'+i,dim:d.k,t:q[0],inv:q[1]}));out.push({id:d.k+'_s',dim:d.k,t:QS[scn][d.k],inv:0})});return out}

/* temas del relato (palabras clave; no es un diagnóstico) */
const LEX={estres:['stress','pressure','tense','tension','worried','worry','anxious','anxiety','overwhelm','concern','uncertain','nervous','scared','fear','responsibility'],
 sueno:['sleep','asleep','insomnia','rest','awake','night','tired','nap','wake','woke','bedtime'],
 conflictos:['argue','argument','disagree','disagreement','conflict','friction','fight','irritat','annoy','crew','teammate','coworker','misunderstand'],
 soledad:['lonely','loneliness','alone','isolat','miss my','family','home','homesick','far away','disconnect','partner','children','loved ones'],
 fatiga:['fatigue','exhaust','drain','mental','concentrat','focus','distract','forget','slow','monoton','repetit','burnout','no energy']};
function topics(text){const t=norm(text),r={};DIMS.forEach(d=>{r[d.k]=LEX[d.k].reduce((n,w)=>n+(t.split(w).length-1),0)});return r}
const OPEN={estres:'What has put the most pressure on you, and how have you managed it?',sueno:'How have you been sleeping lately?',conflictos:'How have things been going with your crewmates?',soledad:'Have you felt connected to someone today, here or on Earth?',fatiga:'How was your mental energy throughout the day?'};
const DEEP={estres:'You mentioned pressure. When did you feel it most strongly?',sueno:'You mentioned your rest. What do you think has been affecting it?',conflictos:'You mentioned your crewmates. Is there anything you would like to change about how you work together?',soledad:'Thank you for sharing that. What helps you feel more connected?',fatiga:'It sounds like you have had a demanding day. Was there a moment when concentrating felt especially difficult?'};

