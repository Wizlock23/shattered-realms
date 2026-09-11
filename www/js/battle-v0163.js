
/* Shattered Realms v0.16.3 — Battle HUD synchronizer */
(()=>{
  const $=id=>document.getElementById(id);
  function parseCounts(el){const t=el?.textContent||'';return{deck:Number(t.match(/Deck\s+(\d+)/i)?.[1]||0),hand:Number(t.match(/Hand\s+(\d+)/i)?.[1]||0)}}
  function syncHud(){
    const e=parseCounts($('enemyDeck')),p=parseCounts($('playerDeck'));
    if($('enemyHandVisual'))$('enemyHandVisual').textContent=e.hand;if($('enemyDeckVisual'))$('enemyDeckVisual').textContent=e.deck;
    if($('playerHandVisual'))$('playerHandVisual').textContent=p.hand;if($('playerDeckVisual'))$('playerDeckVisual').textContent=p.deck;
    const m=($('playerEnergy')?.textContent||'').match(/(\d+)\/(\d+)/);if(m){$('energyNow').textContent=m[1];$('energyMax').textContent=m[2];const now=Number(m[1]),max=Number(m[2]);$('manaPips').innerHTML=Array.from({length:Math.max(1,max)},(_,i)=>`<span class="${i<now?'on':''}"></span>`).join('')}
    for(const id of ['enemyHp','playerHp']){const el=$(id),x=el?.textContent?.match(/(\d+)\s*\/\s*(\d+)/);if(el&&x){el.dataset.hp=x[1];el.dataset.maxHp=x[2]}}
    const turn=($('turnLabel')?.textContent||'').toLowerCase();document.body.dataset.battleTurn=turn.includes('enemy')?'enemy':turn.includes('your')?'player':'neutral';
    const mulligan=$('mulliganBtn')&&!$('mulliganBtn').classList.contains('hidden');document.body.classList.toggle('mulligan-active',!!mulligan);
    const chosen=document.querySelectorAll('#hand .mulligan-selected').length;if($('mulliganNote')){$('mulliganNote').classList.toggle('active',!!mulligan);$('mulliganNote').querySelector('span').textContent=chosen?`${chosen} card${chosen===1?'':'s'} selected to replace. Tap again to keep.`:'Tap any cards you want to replace, then confirm.'}
    for(const id of ['enemyRelic','playerRelic']){const el=$(id);if(el)el.closest('.relic-slot')?.classList.toggle('has-relic',!/No relic/i.test(el.textContent||''))}
  }
  function openSheet(id){$(id)?.classList.remove('hidden')}
  function closeSheet(id){$(id)?.classList.add('hidden')}
  function hostWidth(){
    try{return Math.max(window.innerWidth||0,window.parent?.innerWidth||0,window.frameElement?.getBoundingClientRect?.().width||0)}catch{return window.innerWidth||0}
  }
  function forceHostFullscreen(){
    let wide=hostWidth()>=901 || matchMedia('(hover:hover) and (pointer:fine)').matches || (screen?.width||0)>=1200;
    document.documentElement.classList.toggle('sr163-desktop',wide);
    document.body.classList.toggle('sr163-desktop',wide);
    document.body.dataset.battleViewport=wide?'desktop':'compact';
    if(!wide)return;
    try{
      const frame=window.frameElement;
      if(frame){frame.style.setProperty('position','fixed','important');frame.style.setProperty('inset','0','important');frame.style.setProperty('width','100vw','important');frame.style.setProperty('height','100vh','important');frame.style.setProperty('max-width','none','important');frame.style.setProperty('max-height','none','important');frame.style.setProperty('border','0','important');frame.style.setProperty('border-radius','0','important');frame.style.setProperty('transform','none','important');}
      const doc=window.parent?.document;
      const modal=frame?.closest?.('.battle-modal');
      const card=frame?.closest?.('.modal-card');
      for(const el of [modal,card])if(el){el.style.setProperty('position','fixed','important');el.style.setProperty('inset','0','important');el.style.setProperty('width','100vw','important');el.style.setProperty('height','100vh','important');el.style.setProperty('max-width','none','important');el.style.setProperty('max-height','none','important');el.style.setProperty('margin','0','important');el.style.setProperty('padding','0','important');el.style.setProperty('transform','none','important');}
    }catch{}
  }
  function syncViewport(){forceHostFullscreen()}
  window.addEventListener('resize',()=>{syncViewport();setTimeout(forceHostFullscreen,40)});
  window.addEventListener('load',()=>{syncViewport();forceHostFullscreen();setTimeout(forceHostFullscreen,60);setTimeout(forceHostFullscreen,250);
    $('battleBack')?.addEventListener('click',()=>{const target=(location.origin&&location.origin!=='null')?location.origin:'*';try{window.parent?.postMessage({type:'sr-close-battle'},target)}catch{history.back?.()}});
    $('battleHelp')?.addEventListener('click',()=>openSheet('battleHelpSheet'));
    $('battleHelpClose')?.addEventListener('click',()=>closeSheet('battleHelpSheet'));
    $('battleLogBtn')?.addEventListener('click',()=>openSheet('battleLogSheet'));
    $('battleLogClose')?.addEventListener('click',()=>closeSheet('battleLogSheet'));
    ['enemyDeck','playerDeck','playerEnergy','enemyHp','playerHp','turnLabel','hand','enemyRelic','playerRelic','mulliganBtn'].forEach(id=>{const el=$(id);if(el)new MutationObserver(syncHud).observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']})});
    document.addEventListener('click',()=>setTimeout(syncHud,0),true);
    syncHud();setTimeout(syncHud,100);setTimeout(syncHud,500);
  });
})();
