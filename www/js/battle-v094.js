/* Shattered Realms v0.9.4 — mobile battle-board composition */
(()=>{
  function makeButton(id,label,aria){
    let b=document.getElementById(id);
    if(b) return b;
    b=document.createElement('button');b.type='button';b.id=id;b.className='sr94-battle-float';b.setAttribute('aria-label',aria);b.innerHTML=label;document.body.appendChild(b);return b;
  }
  function ensureRules(){
    let s=document.getElementById('battleRules94');
    if(s) return s;
    s=document.createElement('div');s.id='battleRules94';s.className='sr94-rules-sheet';
    s.innerHTML='<h3>Battle Guide</h3><div><b>Win:</b> reduce the enemy Leader to 0 Health.</div><div><b>Energy:</b> refills each turn and rises toward 8.</div><div><b>Frontline:</b> Ready creatures protect the Leader and exhaust after defending once.</div><div><b>Ascension:</b> some creatures grow stronger after surviving enough rounds.</div><button type="button">Close Guide</button>';
    s.querySelector('button').onclick=()=>s.classList.remove('open');document.body.appendChild(s);return s;
  }
  function arrange(){
    if(!matchMedia('(max-width:700px)').matches) return;
    const board=document.querySelector('.board');
    const enemy=document.getElementById('enemyLeaderPanel');
    const player=document.getElementById('playerLeaderPanel');
    const center=document.querySelector('.hud .center')||document.querySelector('.center');
    const enemyLane=document.querySelector('.enemy-lane');
    const playerLane=document.querySelector('.player-lane');
    const hand=document.querySelector('.hand-wrap');
    if(!board||!enemy||!player||!enemyLane||!playerLane||!hand) return;
    if(enemy.parentElement!==board) board.insertBefore(enemy,enemyLane);
    if(center&&center.parentElement!==board) enemyLane.after(center);
    if(player.parentElement!==board) playerLane.after(player);
    const menu=makeButton('battleMenu94','☰','Battle log');
    const book=makeButton('battleBook94','▤','Battle guide');
    const rules=ensureRules();
    if(!menu.dataset.bound){menu.dataset.bound='1';menu.onclick=()=>{rules.classList.remove('open');document.body.classList.toggle('sr94-log-open')}}
    if(!book.dataset.bound){book.dataset.bound='1';book.onclick=()=>{document.body.classList.remove('sr94-log-open');rules.classList.toggle('open')}}
  }
  window.addEventListener('load',()=>{arrange();setTimeout(arrange,250)});
  window.addEventListener('resize',arrange);
})();
