
/* Shattered Realms v0.16.6 — Battle HUD synchronizer */
(()=>{
  const $=id=>document.getElementById(id);
  function parseCounts(el){const t=el?.textContent||'';return{deck:Number(t.match(/Deck\s+(\d+)/i)?.[1]||0),hand:Number(t.match(/Hand\s+(\d+)/i)?.[1]||0)}}

  const ARENA_LIBRARY={
    Alfar:['../assets/ui/arena-alfar-v0166-a.jpg','../assets/ui/arena-alfar-v0166-b.jpg'],
    Dwarves:['../assets/ui/arena-dwarves-v0166-a.jpg','../assets/ui/arena-dwarves-v0166-b.jpg'],
    Mercians:['../assets/ui/arena-mercians-v0166-a.jpg','../assets/ui/arena-mercians-v0166-b.jpg'],
    Mahirim:['../assets/ui/arena-mahirim-v0166-a.jpg','../assets/ui/arena-mahirim-v0166-b.jpg'],
    Mirdain:['../assets/ui/arena-mirdain-v0166-a.jpg','../assets/ui/arena-mirdain-v0166-b.jpg'],
    Orks:['../assets/ui/arena-orks-v0166-a.jpg','../assets/ui/arena-orks-v0166-b.jpg'],
    Boss:['../assets/ui/arena-boss-v0166-a.jpg','../assets/ui/arena-boss-v0166-b.jpg']
  };
  const ARENA_ACCENTS={
    Alfar:['#9b63ff','#3a145a'],Dwarves:['#f69a45','#5b351f'],Mercians:['#67adff','#173f8d'],
    Mahirim:['#d7b169','#56452b'],Mirdain:['#64d59b','#16533b'],Orks:['#ff6a43','#6a2118'],Boss:['#ff3f83','#4d1232']
  };
  const WEATHER_BY_FACTION={
    Alfar:['aether','mist','stars'],Dwarves:['embers','clear','mist'],Mercians:['clear','storm','aether'],
    Mahirim:['mist','embers','clear'],Mirdain:['mist','aether','clear'],Orks:['embers','storm','clear'],Boss:['storm','embers','aether']
  };
  function battleFaction(){
    const pve=window.__PVE_CONFIG&&typeof window.__PVE_CONFIG==='object'?window.__PVE_CONFIG:null;
    if(pve&&(pve.bossName||pve.bossPower)) return 'Boss';
    return $('enemyFaction')?.value||'Mercians';
  }
  function pickFrom(list,lastKey){
    if(!Array.isArray(list)||!list.length)return null;
    let last='';try{last=localStorage.getItem(lastKey)||''}catch{}
    const pool=list.filter(v=>v!==last); const pick=(pool.length?pool:list)[Math.floor(Math.random()*(pool.length?pool:list).length)]||list[0];
    try{localStorage.setItem(lastKey,pick)}catch{}
    return pick;
  }
  function chooseArena(){
    const faction=battleFaction(); const options=ARENA_LIBRARY[faction]||ARENA_LIBRARY.Mercians;
    const image=pickFrom(options,'sr_arena_last_'+faction.toLowerCase());
    const weather=pickFrom(WEATHER_BY_FACTION[faction]||['clear'],'sr_weather_last_'+faction.toLowerCase())||'clear';
    const time=pickFrom(['day','dusk','night'],'sr_time_last')||'day';
    return {faction,image,weather,time,accent:ARENA_ACCENTS[faction]||ARENA_ACCENTS.Mercians};
  }
  function ensureWeatherLayer(){
    let layer=document.querySelector('.battle-weather');
    if(layer)return layer;
    layer=document.createElement('div');layer.className='battle-weather';layer.setAttribute('aria-hidden','true');
    layer.innerHTML=Array.from({length:24},(_,i)=>`<i style="--i:${i};--x:${(i*37)%101};--delay:${(i*0.43).toFixed(2)}s;--dur:${(5+(i%7)*.65).toFixed(2)}s"></i>`).join('');
    document.querySelector('.battle-shell')?.prepend(layer); return layer;
  }
  function applyArena(forceNew=false){
    if(!applyArena.current||forceNew)applyArena.current=chooseArena();
    const a=applyArena.current;if(!a)return;
    document.documentElement.style.setProperty('--battle-bg-image',`url('${a.image}')`);
    document.documentElement.style.setProperty('--arena-accent',a.accent[0]);
    document.documentElement.style.setProperty('--arena-accent-deep',a.accent[1]);
    document.body.dataset.arenaFaction=a.faction.toLowerCase();
    document.body.dataset.arenaWeather=a.weather;
    document.body.dataset.arenaTime=a.time;
    const layer=ensureWeatherLayer();if(layer)layer.dataset.weather=a.weather;
  }
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
  window.addEventListener('load',()=>{applyArena(true);syncViewport();forceHostFullscreen();setTimeout(forceHostFullscreen,60);setTimeout(forceHostFullscreen,250);
    $('battleBack')?.addEventListener('click',()=>{const target=(location.origin&&location.origin!=='null')?location.origin:'*';try{window.parent?.postMessage({type:'sr-close-battle'},target)}catch{history.back?.()}});
    $('startBtn')?.addEventListener('click',()=>applyArena(true),true);
    $('resetBtn')?.addEventListener('click',()=>applyArena(true),true);
    $('battleHelp')?.addEventListener('click',()=>openSheet('battleHelpSheet'));
    $('battleHelpClose')?.addEventListener('click',()=>closeSheet('battleHelpSheet'));
    $('battleLogBtn')?.addEventListener('click',()=>openSheet('battleLogSheet'));
    $('battleLogClose')?.addEventListener('click',()=>closeSheet('battleLogSheet'));
    ['enemyDeck','playerDeck','playerEnergy','enemyHp','playerHp','turnLabel','hand','enemyRelic','playerRelic','mulliganBtn'].forEach(id=>{const el=$(id);if(el)new MutationObserver(syncHud).observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']})});
    document.addEventListener('click',()=>setTimeout(syncHud,0),true);
    syncHud();setTimeout(syncHud,100);setTimeout(syncHud,500);
  });
})();
