
/* Shattered Realms v0.15.1 — cinematic battle board */
(()=>{
  const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I={
    back:svg('<path d="m15 5-7 7 7 7"/>'),
    help:svg('<circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.8 2.8 0 1 1 4.8 1.9c-.7.7-1.5 1.1-1.9 2.1"/><path d="M12 17h.01"/>'),
    menu:svg('<path d="M4 6h16M4 12h16M4 18h16"/>')
  };
  const $=id=>document.getElementById(id);
  const mm='(max-width:900px), (pointer:coarse) and (hover:none) and (max-width:1366px)';
  const isPhone=()=>matchMedia(mm).matches;

  function header(){
    let h=document.querySelector('.sr151-battle-header'); if(h) return h;
    h=document.createElement('div'); h.className='sr151-battle-header';
    h.innerHTML=`<button id="sr151BattleBack" type="button" aria-label="Back">${I.back}</button><div class="title"><span class="eyebrow">THE SHATTERED REALMS</span><strong>Battle</strong></div><button id="sr151BattleHelp" type="button" aria-label="Battle help">${I.help}</button>`;
    document.body.appendChild(h);
    h.querySelector('#sr151BattleBack').onclick=()=>{const target=(location.origin&&location.origin!=='null')?location.origin:'*';try{window.parent?.postMessage({type:'sr-close-battle'},target)}catch{history.back?.()}};
    h.querySelector('#sr151BattleHelp').onclick=()=>guide().classList.toggle('open');
    return h;
  }
  function guide(){
    let g=document.querySelector('.sr151-battle-guide'); if(g) return g;
    g=document.createElement('div'); g.className='sr151-battle-guide';
    g.innerHTML='<div class="guide-kicker">BATTLE GUIDE</div><h3>How battles work</h3><div><b>Goal</b><span>Reduce the enemy Leader to 0 Health.</span></div><div><b>Frontline</b><span>Ready enemy creatures protect their Leader.</span></div><div><b>Summon</b><span>Play cards from your hand onto the battlefield.</span></div><div><b>Attack</b><span>Use a Ready unit and select a target when the attack button appears.</span></div><button type="button">Close</button>';
    g.querySelector('button').onclick=()=>g.classList.remove('open');
    document.body.appendChild(g); return g;
  }
  function dock(){
    let d=document.querySelector('.sr151-battle-dock'); if(d) return d;
    d=document.createElement('div'); d.className='sr151-battle-dock';
    d.innerHTML=`<div class="sr151-energy-orb"><span id="sr151EnergyNow">0</span><small>/<span id="sr151EnergyMax">0</span></small></div><div id="sr151EndSlot"></div><button class="sr151-dock-btn" id="sr151LogBtn" type="button" aria-label="Battle log">${I.menu}</button>`;
    document.body.appendChild(d);
    const end=$('endTurnBtn'); if(end) d.querySelector('#sr151EndSlot').appendChild(end);
    d.querySelector('#sr151LogBtn').onclick=()=>{guide().classList.remove('open'); document.body.classList.toggle('sr151-log-open');};
    return d;
  }
  function arena(){
    const board=document.querySelector('.board'); if(!board) return null;
    let a=board.querySelector('.sr151-arena'); if(a) return a;
    a=document.createElement('div'); a.className='sr151-arena';
    a.innerHTML='<div class="mist mist-a"></div><div class="mist mist-b"></div><div class="crest"></div><div class="sr151-arena-title">THE SHATTERED REALMS</div><div class="sr151-arena-sub">A BRIGHTER TOMORROW</div><div class="sigils"><span></span><span></span><span></span><span></span><span></span><span></span></div>';
    board.prepend(a);
    return a;
  }
  function makeStack(panel,id,label,mode='both'){
    let box=panel?.querySelector('.sr151-card-stack'); if(box) return box;
    box=document.createElement('div'); box.className='sr151-card-stack'; box.id=id; box.dataset.mode=mode; box.setAttribute('aria-label',label);
    box.innerHTML='<i></i><i></i><i></i><b>0</b><small></small>';
    panel?.appendChild(box); return box;
  }
  function parsePair(txt,keyA,keyB){
    const a=txt?.match(new RegExp(`${keyA}\s+(\d+)`,'i')); const b=txt?.match(new RegExp(`${keyB}\s+(\d+)`,'i'));
    return {a:a?Number(a[1]):0,b:b?Number(b[1]):0};
  }
  function syncCounters(){
    const p=parsePair($('playerDeck')?.textContent||'','Deck','Hand');
    const e=parsePair($('enemyDeck')?.textContent||'','Deck','Hand');
    const es=document.querySelector('#enemyLeaderPanel .sr151-card-stack');
    const ps=document.querySelector('#playerLeaderPanel .sr151-card-stack');
    if(es){es.querySelector('b').textContent=e.b; es.querySelector('small').textContent=`${e.a}`; es.title=`Enemy hand ${e.b} • Deck ${e.a}`;}
    if(ps){ps.querySelector('b').textContent=p.a; ps.querySelector('small').textContent=`${p.b}`; ps.title=`Your deck ${p.a} • Hand ${p.b}`;}
    const energy=($('playerEnergy')?.textContent||'').match(/(\d+)\/(\d+)/); if(energy){$('sr151EnergyNow').textContent=energy[1]; $('sr151EnergyMax').textContent=energy[2];}
    for(const id of ['enemyHp','playerHp']){
      const el=$(id); const m=el?.textContent?.match(/(\d+)\s*\/\s*(\d+)/); if(el&&m){el.dataset.hp=m[1]; el.dataset.maxHp=m[2];}
    }
  }
  function syncTurn(){
    const text=($('turnLabel')?.textContent||'').trim().toLowerCase();
    const turn=text.includes('opponent')||text.includes('enemy')?'enemy':text.includes('your')?'player':'neutral';
    document.body.dataset.battleTurn=turn;
  }
  function arrange(){
    if(!isPhone()) return;
    document.body.classList.add('sr151-mobile-battle');
    header(); guide(); dock(); arena();
    const board=document.querySelector('.board'), enemy=$('enemyLeaderPanel'), player=$('playerLeaderPanel'), center=document.querySelector('.hud .center')||document.querySelector('.center'), enemyLane=document.querySelector('.enemy-lane'), playerLane=document.querySelector('.player-lane'), hand=document.querySelector('.hand-wrap');
    if(!board||!enemy||!player||!center||!enemyLane||!playerLane||!hand) return;
    if(!enemy.dataset.sr151){ board.append(enemy, enemyLane, center, playerLane, player, hand); enemy.dataset.sr151='1'; }
    makeStack(enemy,'sr151EnemyStack','Enemy hand and deck','enemy');
    makeStack(player,'sr151PlayerStack','Your deck and hand','player');
    document.querySelectorAll('.sr150-battle-header,.sr150-battle-dock,.sr150-battle-guide,.sr141-battle-header,.sr141-battle-dock,.sr141-battle-guide,.sr110-battle-header,.sr110-battle-dock,.sr110-battle-guide,.sr100-battle-header,.sr100-battle-dock,.sr100-battle-rules,.sr94-battle-float,.sr94-rules-sheet').forEach(x=>x.remove());
    syncCounters(); syncTurn();
  }
  function observe(){
    ['playerEnergy','enemyDeck','playerDeck','enemyHp','playerHp'].forEach(id=>{const el=$(id); if(el) new MutationObserver(syncCounters).observe(el,{subtree:true,childList:true,characterData:true});});
    const tl=$('turnLabel'); if(tl) new MutationObserver(syncTurn).observe(tl,{subtree:true,childList:true,characterData:true});
    const tp=$('targetPanel'); if(tp) new MutationObserver(()=>document.body.classList.toggle('sr151-targeting',!tp.classList.contains('hidden'))).observe(tp,{attributes:true,attributeFilter:['class']});
  }
  window.addEventListener('load',()=>{arrange();observe();setTimeout(arrange,90);setTimeout(arrange,260);setTimeout(arrange,700);});
  window.addEventListener('resize',arrange);
})();
