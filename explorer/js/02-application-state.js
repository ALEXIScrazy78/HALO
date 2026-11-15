// App state, selected scenario and scores.
let selected='stress',scenario='station',crew='Alex Morgan (demo)',orbit=0.2,tilt=0.05,drag=false,dragged=false,pressX=0,pressY=0,lastX=0,lastY=0,hover=null,animated=true;
const canvas=document.getElementById('scene'),shell=document.getElementById('canvasShell'),ctx=canvas.getContext('2d');let cw=0,ch=0,dpr=1;
function dataset(key){const values=examples[scenario][key];if(crew.startsWith('Jordan'))return values.map((v,i)=>Math.max(0,Math.min(100,v+(i%2===0?-6:5))));return values}
function rank(score){return score<35?0:score<60?1:2}
function currentScore(key){const a=dataset(key);return a[a.length-1]}
function color(key){return statuses[rank(currentScore(key))].color}
