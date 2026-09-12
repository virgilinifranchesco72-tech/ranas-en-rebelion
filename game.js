const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const keys = {};
let player, bubbles, humans, score, gameOver, spawnTimer, last;

function resize() { const r = canvas.getBoundingClientRect(); canvas.width = Math.floor(r.width * devicePixelRatio); canvas.height = Math.floor(r.height * devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function W(){ return canvas.clientWidth; } function H(){ return canvas.clientHeight; }
function reset(){ player={x:70,y:H()/2,r:22,speed:230,cool:0}; bubbles=[]; humans=[]; score=0; gameOver=false; spawnTimer=0; last=performance.now(); }
function shoot(){ if(gameOver || player.cool>0) return; bubbles.push({x:player.x+25,y:player.y,r:7,v:430}); player.cool=.28; }
function spawn(){ humans.push({x:W()+30,y:40+Math.random()*(H()-80),r:20,v:45+Math.random()*35}); }
function circle(a,b){ return Math.hypot(a.x-b.x,a.y-b.y) < a.r+b.r; }
function update(dt){
  if(gameOver) return;
  let dx=(keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0), dy=(keys.ArrowDown?1:0)-(keys.ArrowUp?1:0);
  const len=Math.hypot(dx,dy)||1; player.x=Math.max(28,Math.min(W()-28,player.x+dx/len*player.speed*dt)); player.y=Math.max(28,Math.min(H()-28,player.y+dy/len*player.speed*dt)); player.cool=Math.max(0,player.cool-dt);
  bubbles.forEach(b=>b.x+=b.v*dt); bubbles=bubbles.filter(b=>b.x<W()+30);
  spawnTimer-=dt; if(spawnTimer<=0){spawn();spawnTimer=Math.max(.5,1.25-score*.008);}
  humans.forEach(h=>{h.x-=h.v*dt; if(circle(h,player)) gameOver=true;});
  for(let i=humans.length-1;i>=0;i--) for(let j=bubbles.length-1;j>=0;j--) if(circle(humans[i],bubbles[j])){ humans.splice(i,1); bubbles.splice(j,1); score++; break; }
  humans=humans.filter(h=>h.x>-35);
}
function draw(){
  const w=W(),h=H(); ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#72c866';ctx.fillRect(0,0,w,h); ctx.fillStyle='#5aad57'; for(let x=15;x<w;x+=55){ctx.beginPath();ctx.arc(x,18+(x%4)*20,5,0,7);ctx.fill();}
  ctx.fillStyle='#173e2b';ctx.font='bold 18px system-ui';ctx.fillText(`Puntaje: ${score}`,14,27);
  // rana
  ctx.fillStyle='#227342';ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,7);ctx.fill();ctx.fillStyle='#b7ef74';ctx.beginPath();ctx.arc(player.x-8,player.y-17,8,0,7);ctx.arc(player.x+8,player.y-17,8,0,7);ctx.fill();ctx.fillStyle='#172d1d';ctx.beginPath();ctx.arc(player.x-8,player.y-18,3,0,7);ctx.arc(player.x+8,player.y-18,3,0,7);ctx.fill();ctx.strokeStyle='#d4ff91';ctx.lineWidth=3;ctx.beginPath();ctx.arc(player.x,player.y+2,11,0,Math.PI);ctx.stroke();
  bubbles.forEach(b=>{ctx.fillStyle='#eaffff';ctx.strokeStyle='#4aa8d1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();ctx.stroke();});
  humans.forEach(h=>{ctx.fillStyle='#39425a';ctx.fillRect(h.x-15,h.y-4,30,29);ctx.fillStyle='#f0b18c';ctx.beginPath();ctx.arc(h.x,h.y-13,12,0,7);ctx.fill();ctx.fillStyle='#242b3c';ctx.fillRect(h.x-14,h.y-25,28,7);ctx.fillStyle='#fff';ctx.font='13px sans-serif';ctx.fillText('😠',h.x-11,h.y+17);});
  if(gameOver){ctx.fillStyle='rgba(10,25,18,.72)';ctx.fillRect(0,0,w,h);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 30px system-ui';ctx.fillText('¡Te atraparon!',w/2,h/2-10);ctx.font='18px system-ui';ctx.fillText(`Puntaje final: ${score}`,w/2,h/2+25);ctx.textAlign='left';}
}
function loop(t){const dt=Math.min(.04,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop);}
addEventListener('keydown',e=>{keys[e.key]=true;if(e.code==='Space')shoot();}); addEventListener('keyup',e=>keys[e.key]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('touchstart',e=>{e.preventDefault();keys[k]=true});b.addEventListener('touchend',e=>{e.preventDefault();keys[k]=false});});
document.querySelector('#shoot').addEventListener('touchstart',e=>{e.preventDefault();shoot()}); document.querySelector('#shoot').addEventListener('click',shoot); document.querySelector('#restart').onclick=reset;
addEventListener('resize',()=>{resize();if(player)player.y=Math.min(player.y,H()-28)}); resize();reset();requestAnimationFrame(loop);
