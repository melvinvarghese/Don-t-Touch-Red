/* DON'T TOUCH RED — dependency-free canvas arcade. MIT License. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('canvas'), ctx = canvas.getContext('2d');
  if (!ctx) { $('announcement').textContent = 'Canvas is unavailable in this browser.'; return; }
  const CYAN = '#66f6e1', RED = '#ff355e', PURPLE = '#a78bfa';
  const H = 600, SIZE = 20, KEY = 'dont-touch-red.best.v1';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 1000, dpr = 1, state = 'ready', best = loadBest(), score = 0;
  let gates = [], particles = [], trail = [], gravity = 1, distance = 0;
  let player = { x: 200, y: H / 2, vy: 0, angle: 0 };
  let lastTime = 0, accumulator = 0, clock = 0, deathTime = 0, shake = 0;
  let soundOn = false, audio = null, previousBest = best;
  const stars = Array.from({ length: 45 }, () => ({x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + .4}));
  const pad = n => String(n).padStart(3, '0');
  function loadBest() {
    try { const n = Number(localStorage.getItem(KEY)); return Number.isSafeInteger(n) && n >= 0 ? n : 0; }
    catch (_) { return 0; }
  }
  function saveBest() { try { localStorage.setItem(KEY, String(best)); } catch (_) { /* Session best still works. */ } }
  function announce(message) { $('announcement').textContent = message; }
  function syncHud() {
    $('score').textContent = pad(score); $('best').textContent = pad(best);
    $('start-best').textContent = pad(best);
    $('gravity').textContent = gravity > 0 ? '↓ DOWN' : '↑ UP';
    const level = 1 + Math.floor(score / 5);
    $('pace').textContent = String(level).padStart(2, '0') + ' / ' + (score < 5 ? 'WARM UP' : score < 15 ? 'IN THE FLOW' : 'NO ROOM FOR ERROR');
  }
  function show(next) {
    state = next;
    $('start-screen').hidden = next !== 'ready';
    $('pause-screen').hidden = next !== 'paused';
    $('over-screen').hidden = next !== 'over';
    $('pause').disabled = next !== 'playing' && next !== 'paused';
    $('pause').textContent = next === 'paused' ? '▶' : 'Ⅱ';
    $('pause').setAttribute('aria-label', next === 'paused' ? 'Resume game' : 'Pause game');
    $('arena-status').textContent = {ready:'SYSTEM READY',playing:'RUN IN PROGRESS',paused:'SYSTEM PAUSED',over:'SIGNAL LOST'}[next];
    const focus = {ready:'start',paused:'resume',over:'retry'}[next];
    if (focus) $(focus).focus({preventScroll:true});
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const oldWidth = width;
    width = H * rect.width / rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    if (state === 'playing') pause();
    // Preserve distances to the player during an orientation/viewport change.
    const offset = (width - oldWidth) * .22;
    gates.forEach(g => { g.x += offset; });
    trail.forEach(t => { t.x += offset; });
    player.x = width * .22;
  }
  function speed() { return Math.min(330, 210 + score * 4); }
  function newGate(x, lastCenter = H / 2) {
    const gap = Math.max(188, 238 - score * 1.5);
    // Bounded center shifts and a minimum 1.1s between gates keep transitions reachable.
    const center = Math.max(145, Math.min(H - 145, lastCenter + (Math.random() * 2 - 1) * 92));
    return {x, center, gap, w:40, passed:false};
  }
  function startRun() {
    score = 0; previousBest = best; gravity = 1; distance = 0;
    player = { x:width * .22, y:H / 2, vy:0, angle:0 };
    gates = [newGate(width + 80)]; particles = []; trail = [];
    shake = 0; deathTime = 0; accumulator = 0; lastTime = 0;
    syncHud(); show('playing'); canvas.focus({preventScroll:true});
    announce('Run started. Avoid red.'); tone(440, .06, .04);
  }
  function flip() {
    if (state !== 'playing') return;
    gravity *= -1;
    player.vy *= .35; // Dampen momentum so flips feel immediate without teleporting.
    burst(player.x, player.y, CYAN, 9, 90);
    syncHud(); tone(gravity > 0 ? 330 : 550, .06, .035);
  }
  function pause() {
    if (state !== 'playing') return;
    show('paused'); accumulator = 0; announce('Game paused.');
  }
  function resume() {
    if (state !== 'paused' || document.hidden) return;
    accumulator = 0; lastTime = 0; show('playing'); canvas.focus({preventScroll:true}); announce('Run resumed.');
  }
  function die() {
    if (state !== 'playing') return;
    burst(player.x, player.y, CYAN, 35, 230); burst(player.x, player.y, RED, 20, 170);
    shake = reducedMotion ? 0 : 12; deathTime = 0; accumulator = 0;
    $('final-score').textContent = pad(score); $('final-best').textContent = pad(best);
    $('record').textContent = score > previousBest ? '✦ NEW PERSONAL RECORD' : 'RUN ENDED';
    show('over'); announce('You touched red. Score ' + score + '. Personal best ' + best + '.'); tone(85, .22, .07, 'sawtooth');
  }
  function burst(x,y,color,count,power) {
    for (let i=0;i<count;i++) { const a=Math.random()*Math.PI*2, v=power*(.3+Math.random()*.7); particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.35+Math.random()*.35,max:.7,color}); }
  }
  function updateParticles(dt) {
    particles.forEach(p => {p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});
    particles = particles.filter(p=>p.life>0);
  }
  function update(dt) {
    const v = speed(); distance += v * dt;
    player.vy = Math.max(-310, Math.min(310, player.vy + gravity * 1050 * dt));
    player.y += player.vy * dt;
    player.angle += ((gravity < 0 ? -.24 : .24) - player.angle) * Math.min(1, dt*12);
    trail.push({x:player.x,y:player.y,life:.23});
    trail.forEach(t => {t.x-=v*dt;t.life-=dt;}); trail=trail.filter(t=>t.life>0);
    const half = SIZE / 2 * (Math.abs(Math.cos(player.angle)) + Math.abs(Math.sin(player.angle)));
    if (player.y-half <= 9 || player.y+half >= H-9) {die();return;}
    for (const gate of gates) {
      gate.x -= v * dt;
      if (player.x+half > gate.x && player.x-half < gate.x+gate.w &&
          (player.y-half < gate.center-gate.gap/2 || player.y+half > gate.center+gate.gap/2)) {die();return;}
      if (!gate.passed && gate.x+gate.w < player.x-half) {
        gate.passed=true; score++;
        if(score>best) {best=score;saveBest();}
        syncHud(); burst(player.x,player.y,PURPLE,12,100);tone(740+Math.min(score,20)*18,.08,.035);
      }
    }
    const last=gates[gates.length-1];
    const spacing=Math.max(340,speed()*1.12);
    if(last.x < width+80-spacing) gates.push(newGate(last.x+spacing,last.center));
    gates=gates.filter(g=>g.x+g.w>-40);
    updateParticles(dt);
  }
  function tone(freq, duration, gain, type='sine') {
    if (!soundOn || !audio) return;
    try {
      const osc=audio.createOscillator(), vol=audio.createGain();
      osc.type=type;osc.frequency.setValueAtTime(freq,audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30,freq*.6),audio.currentTime+duration);
      vol.gain.setValueAtTime(gain,audio.currentTime);vol.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
      osc.connect(vol);vol.connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);
    } catch (_) { /* Audio is optional. */ }
  }
  async function toggleSound() {
    if (soundOn) soundOn=false;
    else {
      try { const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Unavailable');audio=audio||new Audio();await audio.resume();soundOn=audio.state==='running'; }
      catch (_) {announce('Sound is unavailable. You can still play.');soundOn=false;}
    }
    $('sound').setAttribute('aria-pressed',String(soundOn));$('sound').setAttribute('aria-label',soundOn?'Disable sound':'Enable sound');$('sound-text').textContent=soundOn?'ON':'OFF';
    tone(600,.08,.04);
  }
  function drawGate(g, alpha=1) {
    ctx.globalAlpha=alpha;ctx.fillStyle='#c62449';ctx.shadowColor=RED;ctx.shadowBlur=reducedMotion?0:15;
    const top=g.center-g.gap/2,bottom=g.center+g.gap/2;
    ctx.fillRect(g.x,9,g.w,top-9);ctx.fillRect(g.x,bottom,g.w,H-bottom-9);
    ctx.shadowBlur=0;ctx.fillStyle=RED;ctx.fillRect(g.x,top-5,g.w,5);ctx.fillRect(g.x,bottom,g.w,5);
    ctx.fillStyle='#ff7890';ctx.globalAlpha=alpha*.45;ctx.fillRect(g.x,9,2,top-9);ctx.fillRect(g.x,bottom,2,H-bottom-9);ctx.globalAlpha=1;
  }
  function render() {
    ctx.setTransform(canvas.width/width,0,0,canvas.height/H,0,0);
    ctx.clearRect(0,0,width,H);ctx.fillStyle='#080b14';ctx.fillRect(0,0,width,H);
    ctx.save();
    if(shake>0)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
    const offset=(state==='ready'?clock*18:distance*.22)%48;
    ctx.lineWidth=.7;ctx.strokeStyle='#7283bd12';ctx.beginPath();
    for(let x=-offset;x<width;x+=48){ctx.moveTo(x,0);ctx.lineTo(x,H);}
    for(let y=24;y<H;y+=48){ctx.moveTo(0,y);ctx.lineTo(width,y);}ctx.stroke();
    for(const s of stars){ctx.globalAlpha=.25+.25*Math.sin(clock+s.x*12);ctx.fillStyle='#b4c0ed';ctx.beginPath();ctx.arc(((s.x*width-distance*.08)%width+width)%width,s.y*H,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
    if(state==='ready'){
      drawGate({x:width*.13,center:265,gap:240,w:35},.4);
      drawGate({x:width*.83,center:345,gap:210,w:35},.5);
    }else gates.forEach(g=>drawGate(g));
    ctx.shadowColor=RED;ctx.shadowBlur=12;ctx.fillStyle=RED;ctx.fillRect(0,0,width,3);ctx.fillRect(0,H-3,width,3);ctx.shadowBlur=0;
    ctx.fillStyle='#ff355e17';ctx.fillRect(0,3,width,6);ctx.fillRect(0,H-9,width,6);
    trail.forEach(t=>{ctx.globalAlpha=t.life/.23*.3;ctx.fillStyle=CYAN;ctx.fillRect(t.x-8,t.y-8,16,16);});ctx.globalAlpha=1;
    if(state!=='over'){
      const x=state==='ready'?width*.27:player.x,y=state==='ready'?H*.51+Math.sin(clock*1.5)*12:player.y;
      ctx.save();ctx.translate(x,y);ctx.rotate(player.angle);ctx.shadowColor=CYAN;ctx.shadowBlur=22;ctx.fillStyle=CYAN;ctx.fillRect(-10,-10,20,20);ctx.shadowBlur=0;ctx.fillStyle='#c5fff2';ctx.fillRect(-6,-6,5,5);ctx.restore();
    }
    particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4);});ctx.globalAlpha=1;
    ctx.restore();
    if(state==='over'&&deathTime<.25&&!reducedMotion){ctx.fillStyle='rgba(255,53,94,'+(.28*(1-deathTime/.25))+')';ctx.fillRect(0,0,width,H);}
  }
  function frame(timestamp) {
    const dt=lastTime?Math.min((timestamp-lastTime)/1000,.05):0;lastTime=timestamp;
    if(state!=='paused'&&!document.hidden) {
      clock+=reducedMotion?0:dt;
      if(state==='playing') {
        accumulator+=dt;
        // Fixed 120 Hz steps make physics stable and prevent collision tunneling.
        while(accumulator>=1/120&&state==='playing'){update(1/120);accumulator-=1/120;}
        accumulator=Math.max(0,accumulator);
      } else if(state==='over') {deathTime+=dt;shake=Math.max(0,shake-dt*40);updateParticles(dt);}
    }
    render();requestAnimationFrame(frame); // Exactly one lifetime animation loop.
  }
  $('start').addEventListener('click',startRun);$('retry').addEventListener('click',startRun);
  $('resume').addEventListener('click',resume);$('pause').addEventListener('click',()=>state==='paused'?resume():pause());
  $('sound').addEventListener('click',toggleSound);
  canvas.addEventListener('pointerdown',e=>{if(e.isPrimary&&e.button===0){e.preventDefault();canvas.focus({preventScroll:true});flip();}});
  document.addEventListener('keydown',e=>{
    const button=e.target.closest&&e.target.closest('button,a');
    if(e.code==='Space'&&!button){e.preventDefault();if(!e.repeat)flip();}
    if((e.code==='KeyP'||e.code==='Escape')&&!e.repeat){e.preventDefault();if(state==='playing')pause();else if(state==='paused')resume();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();lastTime=0;accumulator=0;});
  window.addEventListener('blur',()=>{if(state==='playing')pause();});
  new ResizeObserver(resize).observe(canvas);
  resize();syncHud();show('ready');requestAnimationFrame(frame);
})();
