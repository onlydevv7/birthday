'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,LOW=innerWidth<700||RM;
if('scrollRestoration' in history)history.scrollRestoration='manual';
scrollTo(0,0);document.documentElement.classList.add('locked');
let unlocked=false;

/* ---------- canvas particles ---------- */
const cv=$('#fx'),cx=cv.getContext('2d'),P=[];let W,H;
const COL={pink:['#ff8fb8','#ff4d8d','#ff6b81','#e63950','#ffd1e0'],gold:['#ffd54a','#ffb703','#fff1a8','#ffe066'],mix:['#ff8fb8','#ff4d8d','#e63950','#ffd54a','#fff1a8','#c77dff']};
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}rs();addEventListener('resize',rs);
function add(o){if(P.length<(LOW?320:650))P.push(Object.assign({x:0,y:0,vx:0,vy:0,g:0,s:8,r:0,vr:0,l:1,d:.01,t:'s',c:'#fff'},o))}
function burst(x,y,n,types,cols,sp){n=LOW?Math.ceil(n*.6):n;for(let i=0;i<n;i++){const a=rnd(0,6.283),v=rnd(1.5,sp);add({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,g:.08,t:pick(types),s:rnd(5,12),c:pick(cols),vr:rnd(-.2,.2),d:rnd(.008,.02),l:1.3})}}
function confetti(){for(let i=0;i<7;i++)setTimeout(()=>burst(rnd(.1,.9)*W,H*.3,45,['c','c','h','s','p'],COL.mix,11),i*140)}
function draw(p){cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=Math.max(0,Math.min(1,p.l));cx.fillStyle=p.c;const s=p.s;cx.beginPath();
if(p.t=='h'){cx.scale(s/10,s/10);cx.moveTo(0,4);cx.bezierCurveTo(-9,-3,-5,-9,0,-4);cx.bezierCurveTo(5,-9,9,-3,0,4)}
else if(p.t=='p')cx.ellipse(0,0,s*.35,s*.7,0,0,6.283);
else if(p.t=='c')cx.rect(-s/2,-s/4,s,s/2);
else{cx.moveTo(0,-s);cx.quadraticCurveTo(0,0,s,0);cx.quadraticCurveTo(0,0,0,s);cx.quadraticCurveTo(0,0,-s,0);cx.quadraticCurveTo(0,0,0,-s)}
cx.fill();cx.restore()}
const MODES={s1:['s','p'],s2:['h','s','p'],s3:['p','s','p'],s4:['h','p'],s5:['h','s','p'],s6:['s','h'],s7:['h','h','s'],s8:['p','p','s']};let mode=MODES.s1;
function loop(){cx.clearRect(0,0,W,H);
 if(Math.random()<(RM?.04:LOW?.1:.2)){const t=pick(mode);
  if(t=='h')add({t:'h',x:rnd(0,W),y:H+20,vy:-rnd(.6,1.6),vx:rnd(-.3,.3),s:rnd(8,18),c:pick(COL.pink),l:2.5,d:.004});
  else if(t=='p')add({t:'p',x:rnd(0,W),y:-20,vy:rnd(.7,1.8),vx:rnd(-.5,.5),s:rnd(8,14),c:Math.random()<.5?pick(COL.pink):pick(COL.gold),vr:rnd(-.05,.05),l:3,d:.002});
  else add({t:'s',x:rnd(0,W),y:rnd(0,H),s:rnd(3,7),c:pick(COL.gold),vr:.05,l:1,d:.02})}
 for(let i=P.length;i--;){const p=P[i];p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=p.d;if(p.l<=0||p.y>H+60||p.y<-80){P.splice(i,1);continue}draw(p)}
 requestAnimationFrame(loop)}loop();
addEventListener('pointermove',e=>{if(e.pointerType=='mouse'&&Math.random()<.6)add({x:e.clientX,y:e.clientY,vx:rnd(-.5,.5),vy:rnd(-.5,.5),g:.02,t:Math.random()<.5?'s':'h',s:rnd(4,9),c:pick(COL.mix),d:.03})});
addEventListener('pointerdown',e=>burst(e.clientX,e.clientY,8,['s','h'],COL.mix,4));
const mid=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};

/* ---------- audio (generated, no files needed) ---------- */
let AC,M,mt,on=false,mu=false,step=0;const SC=[523,587,659,784,880,1047],MEL=[0,2,4,2,5,4,2,1,0,2,4,5,4,2,3,1];
function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;AC=new C();M=AC.createGain();M.gain.value=mu?0:.25;M.connect(AC.destination)}if(AC.state=='suspended')AC.resume();return true}
function tone(f,t,d,v,ty){const o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(M);o.start(t);o.stop(t+d+.05)}
function music(){if(!ac())return;on=true;$('#mbtn').textContent='⏸️';clearInterval(mt);mt=setInterval(()=>{const t=AC.currentTime+.05,i=step++%16;tone(SC[MEL[i]],t,.9,.22,'triangle');if(i%4==0)tone(SC[MEL[i]]/2,t,1.6,.12)},420)}
function pauseM(){on=false;clearInterval(mt);$('#mbtn').textContent='🎵'}
$('#mbtn').onclick=()=>on?pauseM():music();
$('#mute').onclick=()=>{mu=!mu;if(M)M.gain.value=mu?0:.25;$('#mute').textContent=mu?'🔇':'🔊'};
const SFX=[[880,1175],[784,988,1175,1568],[1047,1319,1568,2093],[659,880,1319]];
function sfx(k){if(!AC||mu)return;const t=AC.currentTime;SFX[k].forEach((f,i)=>tone(f,t+i*.08,.45,.18))}

/* ---------- helpers ---------- */
function split(el,txt){let n=0;el.innerHTML=txt.split(' ').map(w=>'<span class="w">'+[...w].map(c=>`<span class="l" style="--i:${n++}">${c}</span>`).join('')+'</span>').join(' ')}
$$('[data-t]').forEach(e=>split(e,e.dataset.t));
function sf(z,n){n=n||16;const e=document.createElement('div');e.className='sf';e.style.cssText=`width:${z}px;height:${z}px`;let h='';for(let r=0;r<2;r++)for(let i=0;i<n;i++)h+=`<i class="p r${r}" style="--w:${220/n}%;--a:${(i+r*.5)*360/n}deg;--d:${i*.07+r*.4}s"></i>`;e.innerHTML=h+'<b class="c"></b>';return e}
function stars(el,n){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='st';s.style.cssText=`left:${rnd(0,100)}%;top:${rnd(0,100)}%;--d:${rnd(0,4)}s;--z:${rnd(1,3)}px`;el.prepend(s)}}
['s1','s3','s6','s7','s8'].forEach(id=>stars($('#'+id),LOW?25:55));
function fireflies(el,n){for(let i=0;i<n;i++){const f=document.createElement('i');f.className='ff';f.style.cssText=`left:${rnd(0,100)}%;top:${rnd(30,95)}%;--x:${rnd(-60,60)}px;--y:${rnd(-70,40)}px;--t:${rnd(3,6)}s;animation-delay:${rnd(0,3)}s`;el.append(f)}}
function garden(box,n){const g=box.querySelector('.ground');for(let i=0;i<(LOW?40:70);i++){const b=document.createElement('i');b.className='gr';b.style.cssText=`left:${rnd(0,100)}%;--h:${rnd(18,44)}px;--d:${rnd(0,2)}s`;box.insertBefore(b,g.nextSibling)}
 for(let i=0;i<n;i++){const g=document.createElement('div'),f=sf(rnd(62,92),12),s=document.createElement('i');g.className='gf';g.style.cssText=`left:${(i+.5)*100/n+rnd(-2,2)}%;--h:${rnd(60,140)}px;--d:${rnd(0,2)}s;--dl:${i*.15}s`;s.className='stem';g.append(f,s);
  g.onclick=()=>{const[x,y]=mid(f);f.classList.add('on');burst(x,y,25,['s','p'],COL.gold,5);sfx(0)};box.append(g)}}
const nF=innerWidth<600?6:10;garden($('#g3'),nF);garden($('#g8'),nF);
fireflies($('#s3'),LOW?10:18);fireflies($('#s8'),LOW?10:18);
[['23%',22,'🦋'],['45%',30,'🦋'],['65%',26,'🦋']].forEach(([y,t,c])=>{const b=document.createElement('div');b.className='bf';b.style.cssText=`--y:${y};--t:${t}s;animation-delay:-${t/3}s`;b.innerHTML='<span>'+c+'</span>';$('#s3').append(b)});

/* ---------- observers & scroll ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add('in');t.querySelectorAll('.sf:not(.bud)').forEach((x,i)=>setTimeout(()=>x.classList.add('on'),300+i*140));io.unobserve(t)}}),{threshold:.2});$$('.rv').forEach(e=>io.observe(e));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){mode=MODES[e.target.id];$$('#dots button').forEach((b,i)=>b.classList.toggle('on','s'+(i+1)==e.target.id))}}),{threshold:.3});$$('section').forEach(s=>so.observe(s));
for(let i=1;i<=8;i++){const b=document.createElement('button');b.setAttribute('aria-label','Scene '+i);b.onclick=()=>unlocked&&$('#s'+i).scrollIntoView({behavior:'smooth'});$('#dots').append(b)}
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-H;$('#bar').style.width=(m>0?scrollY/m*100:0)+'%';const r=$('#s3').getBoundingClientRect();$('#s3').style.backgroundPosition='0 '+Math.min(1,Math.max(0,(H-r.top)/(r.height+H)))*100+'%'},{passive:true});

/* ---------- scene 1 ---------- */
const z1=Math.min(innerWidth*.55,230);$('#sf1').append(sf(z1,16));
(async function intro(){await sleep(900);$('#light').classList.add('on');await sleep(1800);$('#light').classList.add('gone');$('#sf1').classList.add('show');await sleep(400);$('#sf1 .sf').classList.add('on');
 for(let i=0;i<30;i++)setTimeout(()=>{const[x,y]=mid($('#sf1'));burst(x,y,4,['s'],COL.gold,3)},i*100);
 await sleep(2800);const h=$('#hey');for(const c of [...'Hey Sristiiiiii... 🌻']){h.textContent+=c;await sleep(110)}
 await sleep(1600);h.classList.add('out');burst(...mid(h),50,['s'],COL.gold,6);await sleep(1100);$('#open').classList.add('show')})();
$('#open').onclick=async()=>{if(!$('#open').classList.contains('show'))return;music();sfx(2);$('#open').classList.remove('show');$('#sf1').classList.add('port');burst(W/2,H/2,120,['s','h','p'],COL.mix,12);await sleep(700);$('#veil').className='on';await sleep(1200);scrollTo({top:$('#s2').offsetTop,behavior:'instant'});await sleep(150);$('#veil').className='off';burst(W/2,H/2,60,['s','h'],COL.mix,9)};

/* ---------- scene 2 ---------- */
$('#gift').onclick=async function(){if(this.classList.contains('open'))return;this.classList.add('open');$('#tap').classList.add('gone');sfx(1);
 const[x,y]=mid(this);burst(x,y,90,['c','s','p','h'],COL.mix,10);await sleep(2500);this.style.display='none';
 const t=$('#title');split(t,'HAPPY 17TH BIRTHDAY SRISTIIIII! 🎂🌻💗');t.classList.add('in');
 const ls=$$('#title .l');ls.forEach((l,i)=>setTimeout(()=>burst(...mid(l),4,['s'],COL.gold,3),i*60));
 await sleep(ls.length*60+1000);confetti();sfx(2);$('#date').classList.add('show');await sleep(900);$('#msg').classList.add('show');await sleep(1000);$('#go2').classList.add('show')};
$('#go2').onclick=()=>{unlocked=true;document.documentElement.classList.remove('locked');$('#dots').classList.add('show');$('#s3').scrollIntoView({behavior:'smooth'})};

/* ---------- scene 3 ---------- */
const big=sf(Math.min(innerWidth*.62,250));big.classList.add('bud');$('#bigsf').append(big);
$('#bigsf').onclick=()=>{big.classList.remove('bud');big.classList.add('on');burst(...mid(big),70,['s','p'],COL.gold,8);sfx(0)};

/* ---------- scene 4 ---------- */
const LETTER=`Dear Sristi,

Happy 17th Birthday! 🌻💗

I hope your birthday is filled with happiness, laughter, beautiful surprises, and countless reasons to smile.

May your life always be as bright as a sunflower, as colourful as your favourite shades of pink and red, and as sweet as your favourite dark chocolate. 🍫

I hope this new chapter of your life brings you wonderful memories, exciting adventures, and moments that make you genuinely happy.

Never forget that you deserve beautiful things, beautiful memories, and all the happiness this world has to offer.

Keep smiling, keep shining, and keep being the wonderful person you are.

Wishing you the happiest 17th birthday ever, Sristiiiiii! 🌻🎂💗`;
let opened=false,skip=false,manual=false;['wheel','touchmove'].forEach(e=>addEventListener(e,()=>manual=true,{passive:true}));
$('#paper').onclick=()=>skip=true;
async function openLetter(){if(opened)return;opened=true;sfx(3);burst(...mid($('#seal')),60,['h','s'],COL.pink.concat(COL.gold),7);
 $('#seal').classList.add('break');$('#env').classList.add('open');$('#lbtn').classList.add('gone');await sleep(1100);$('#env').classList.add('away');await sleep(800);
 const p=$('#paper'),el=$('#ltxt'),ch=[...LETTER];p.classList.add('show');p.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('cur');
 const hv=setInterval(()=>{const r=p.getBoundingClientRect();burst(r.left+rnd(0,r.width),r.top+rnd(0,r.height),3,['h','p'],COL.pink,2)},700);
 for(let i=0;i<ch.length&&!skip;i++){el.textContent+=ch[i];if(i%25==0&&!manual){const b=p.getBoundingClientRect().bottom;if(b>H-60)scrollBy({top:b-H+120,behavior:'smooth'})}await sleep(ch[i]=='\n'?180:24)}
 el.textContent=LETTER;el.classList.remove('cur');clearInterval(hv);$('#lheart').classList.add('show');await sleep(700);$('#sign').classList.add('show');burst(...mid($('#lheart')),50,['h','s'],COL.mix,6)}
$('#seal').onclick=openLetter;$('#lbtn').onclick=openLetter;

/* ---------- scene 5 ---------- */
$('#v1').append(sf(150));
$$('.card').forEach(c=>{const f=e=>{const r=c.getBoundingClientRect();c.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*24}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*24}deg)`};c.addEventListener('pointermove',f);c.addEventListener('pointerdown',f);c.addEventListener('pointerleave',()=>c.style.transform='');c.addEventListener('pointerup',()=>setTimeout(()=>c.style.transform='',500))});
$('#c1').onclick=()=>{const f=$('#v1 .sf');f.style.animationDuration='3s';setTimeout(()=>f.style.animationDuration='',1800);burst(...mid(f),60,['s','p'],COL.gold,8);sfx(0)};
$('#c2').onclick=()=>{const c=$('#c2');c.classList.add('sw');setTimeout(()=>c.classList.remove('sw'),2500);burst(...mid(c),60,['h','p','s'],COL.pink,8);sfx(1)};
$('#c3').onclick=()=>{const c=$('#c3'),u=c.classList.toggle('un');$('#choc').classList.toggle('un',u);$('.sur').classList.toggle('show',u);if(u){burst(...mid($('#choc')),80,['s','c'],COL.gold.concat(['#5a2d12']),9);sfx(2)}};

/* ---------- scene 6 ---------- */
const cd=$('#cd');for(let i=0;i<17;i++){const c=document.createElement('i');c.style.setProperty('--k',i);c.innerHTML=`<u style="--d:${rnd(0,.3)}s"></u>`;cd.append(c)}
[['left:-14px',54],['right:-14px',54]].forEach(([p,z])=>{const f=sf(z,10);f.style.cssText+=';'+p;f.classList.add('on');$('#cake').append(f)});
[['left:10%',-6],['right:12%',-10],['left:46%',-34]].forEach(([p,t])=>{const h=document.createElement('span');h.className='hr';h.style.cssText=p+';top:'+(t+120)+'px';h.textContent='💗';$('#cake').append(h)});
for(let i=0;i<14;i++){const s=document.createElement('span');s.textContent=i%2?'✨':'🌟';s.style.cssText=`--a:${i*360/14}deg;--r:${50+i*9}px`;$('#orbit').append(s)}
let wishing=false;
$('#wish').onclick=async()=>{if(wishing)return;wishing=true;$('#wish').classList.add('gone');$('#dim').classList.add('on');cd.classList.remove('out');cd.classList.add('bright');$('#orbit').classList.add('on');sfx(1);
 $('#wmsg').textContent='Close your eyes… and make a wish 💫';await sleep(1500);$('#shoot').className='go';await sleep(3500);
 cd.classList.add('out');cd.classList.remove('bright');$('#orbit').classList.remove('on');await sleep(2000);$('#dim').classList.remove('on');
 const[x,y]=mid($('#cake'));burst(x,y,140,['c','h','s','p'],COL.mix,13);confetti();sfx(2);$('#wmsg').textContent='May every wish come true, Sristi! 🎉🌠';
 $('#shoot').className='';await sleep(1500);$('#wish').textContent='✨ Make Another Wish';$('#wish').classList.remove('gone');wishing=false;cd.classList.remove('out')};

/* ---------- scene 7 ---------- */
let hearted=false;
$('#heart').onclick=()=>{const h=$('#heart');h.classList.remove('pop');void h.offsetWidth;h.classList.add('pop');sfx(2);const[x,y]=mid(h);
 for(let i=0;i<4;i++)setTimeout(()=>{const r=document.createElement('i');r.className='rip';r.style.cssText=`left:${x}px;top:${y}px`;document.body.append(r);setTimeout(()=>r.remove(),1900)},i*250);
 burst(x,y,LOW?100:200,['h','s','h'],COL.mix,14);if(hearted)return;hearted=true;$('#tp').classList.add('gone');$('#s7').classList.add('bloomed');
 for(let i=0;i<9;i++){const s=document.createElement('span');s.className='fsf';s.textContent='🌻';s.style.cssText=`left:${rnd(2,92)}%;--t:${rnd(6,11)}s;animation-delay:${rnd(0,5)}s`;$('#s7').append(s)}
 setTimeout(()=>{const t=$('#fin7');split(t,'YOU DESERVE ALL THE HAPPINESS IN THE WORLD, SRISTI! 🌻💗');t.classList.add('in')},900)};

/* ---------- scene 8 ---------- */
$('#again').onclick=async()=>{burst(...mid($('#again')),100,['h','s','p'],COL.mix,11);$('#veil').className='on';await sleep(1300);scrollTo({top:0,behavior:'instant'});location.reload()};
