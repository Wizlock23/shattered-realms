
/* Shattered Realms v0.16.1 — Battle HUD synchronizer */
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
  function syncViewport(){document.body.dataset.battleViewport=window.innerWidth>=901?'desktop':'compact'}
  window.addEventListener('resize',syncViewport);
  window.addEventListener('load',()=>{syncViewport();
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
