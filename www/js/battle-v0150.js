/* Shattered Realms v0.15.0 — compact reference battle board */
(()=>{
  const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I={back:svg('<path d="m15 5-7 7 7 7"/>'),gear:svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>'),menu:svg('<path d="M4 6h16M4 12h16M4 18h16"/>')};
  const $=id=>document.getElementById(id);
  function isPhoneLayout(){return matchMedia('(max-width:800px), (pointer:coarse) and (hover:none) and (max-width:1366px)').matches}
  function header(){
    let h=document.querySelector('.sr150-battle-header');if(h)return h;
    h=document.createElement('div');h.className='sr150-battle-header';
    h.innerHTML=`<button id="sr150BattleBack" type="button" aria-label="Back">${I.back}</button><div class="title"><span class="crossed">⚔</span><span>Battle</span></div><button id="sr150BattleGear" type="button" aria-label="Battle help">${I.gear}</button>`;
    $('game')?.prepend(h);
    h.querySelector('#sr150BattleBack').onclick=()=>{const target=(location.origin&&location.origin!=='null')?location.origin:'*';try{window.parent?.postMessage({type:'sr-close-battle'},target)}catch{}};
    h.querySelector('#sr150BattleGear').onclick=()=>guide().classList.toggle('open');
    return h;
  }
  function guide(){
    let g=document.querySelector('.sr150-battle-guide');if(g)return g;
    g=document.createElement('div');g.className='sr150-battle-guide';
    g.innerHTML='<div class="guide-kicker">QUICK BATTLE GUIDE</div><h3>Control the battlefield</h3><div><b>Win</b><span>Reduce the enemy Leader to 0 Health.</span></div><div><b>Frontline</b><span>Ready creatures protect the Leader.</span></div><div><b>Energy</b><span>Refills and increases at the start of your turn.</span></div><div><b>Attack</b><span>Tap a glowing Ready creature, then tap its target.</span></div><button type="button">Close</button>';
    g.querySelector('button').onclick=()=>g.classList.remove('open');document.body.appendChild(g);return g;
  }
  function dock(){
    let d=document.querySelector('.sr150-battle-dock');if(d)return d;
    d=document.createElement('div');d.className='sr150-battle-dock';
    d.innerHTML=`<div class="sr150-energy-orb"><span id="sr150EnergyNow">0</span><small>/<span id="sr150EnergyMax">0</span></small></div><div id="sr150EndSlot"></div><button class="sr150-dock-btn" id="sr150LogBtn" type="button" aria-label="Battle log">${I.menu}</button>`;
    document.body.appendChild(d);
    const end=$('endTurnBtn');if(end)d.querySelector('#sr150EndSlot').appendChild(end);
    d.querySelector('#sr150LogBtn').onclick=()=>{guide().classList.remove('open');document.body.classList.toggle('sr150-log-open')};
    return d;
  }
  function makeStack(panel,id,label){
    let box=panel?.querySelector('.sr150-card-stack');if(box)return box;
    box=document.createElement('div');box.className='sr150-card-stack';box.id=id;box.setAttribute('aria-label',label);
    box.innerHTML='<i></i><i></i><i></i><b>0</b>';
    panel?.appendChild(box);return box;
  }
  function parseCount(el,key){const m=el?.textContent?.match(new RegExp(`${key}\\s+(\\d+)`,'i'));return m?Number(m[1]):0}
  function syncCounters(){
    const eDeck=$('enemyDeck'),pDeck=$('playerDeck');
    const eh=parseCount(eDeck,'Hand'),ed=parseCount(eDeck,'Deck'),pd=parseCount(pDeck,'Deck');
    const es=document.querySelector('#enemyLeaderPanel .sr150-card-stack');if(es){es.querySelector('b').textContent=eh;es.title=`Enemy hand: ${eh} • Deck: ${ed}`}
    const ps=document.querySelector('#playerLeaderPanel .sr150-card-stack');if(ps){ps.querySelector('b').textContent=pd;ps.title=`Your deck: ${pd}`}
    const energy=$('playerEnergy')?.textContent?.match(/(\d+)\/(\d+)/);if(energy){$('sr150EnergyNow').textContent=energy[1];$('sr150EnergyMax').textContent=energy[2]}
    for(const id of ['enemyHp','playerHp']){const el=$(id);const m=el?.textContent?.match(/(\d+)\s*\/\s*(\d+)/);if(el&&m){el.dataset.hp=m[1];el.dataset.maxHp=m[2]}}
  }
  function syncTurn(){
    const text=$('turnLabel')?.textContent?.trim().toLowerCase()||'';
    document.body.dataset.battleTurn=text.includes('enemy')?'enemy':text.includes('your')?'player':'neutral';
  }
  function arrange(){
    if(!isPhoneLayout())return;
    document.body.classList.add('sr150-mobile-battle');
    header();guide();dock();
    const board=document.querySelector('.board'),enemy=$('enemyLeaderPanel'),player=$('playerLeaderPanel'),center=document.querySelector('.hud .center')||document.querySelector('.center'),enemyLane=document.querySelector('.enemy-lane'),playerLane=document.querySelector('.player-lane'),hand=document.querySelector('.hand-wrap');
    if(!board||!enemy||!player||!center||!enemyLane||!playerLane||!hand)return;
    board.prepend(enemy);enemy.after(enemyLane);enemyLane.after(center);center.after(player);player.after(playerLane);playerLane.after(hand);
    makeStack(enemy,'sr150EnemyStack','Enemy hand');makeStack(player,'sr150PlayerStack','Your deck');
    document.querySelectorAll('.sr110-battle-header,.sr110-battle-dock,.sr110-battle-guide,.sr100-battle-header,.sr100-battle-dock,.sr100-battle-rules,.sr94-battle-float,.sr94-rules-sheet').forEach(x=>x.remove());
    syncCounters();syncTurn();
  }
  function observe(){
    for(const id of ['playerEnergy','enemyDeck','playerDeck','enemyHp','playerHp']){const el=$(id);if(el)new MutationObserver(syncCounters).observe(el,{subtree:true,childList:true,characterData:true})}
    const tl=$('turnLabel');if(tl)new MutationObserver(syncTurn).observe(tl,{subtree:true,childList:true,characterData:true});
    const target=$('targetPanel');if(target)new MutationObserver(()=>document.body.classList.toggle('sr150-targeting',!target.classList.contains('hidden'))).observe(target,{attributes:true,attributeFilter:['class']});
  }
  window.addEventListener('load',()=>{arrange();observe();setTimeout(arrange,80);setTimeout(arrange,260)});
  window.addEventListener('resize',arrange);
})();
