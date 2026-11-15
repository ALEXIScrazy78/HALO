// Crew profile, scenario and reset events.
document.getElementById('scenario').onchange=e=>{scenario=e.target.value;choose(selected)};
document.getElementById('crew').onchange=e=>{crew=e.target.value;choose(selected)};
document.getElementById('reset').onclick=()=>{orbit=.2;tilt=.05;choose('stress')};
