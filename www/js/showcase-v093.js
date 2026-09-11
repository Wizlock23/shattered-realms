/* Shattered Realms v0.9.3 — UI target pass
   Pushes the live app much closer to the approved showcase layout. */
(()=>{
  const $ = id => document.getElementById(id);
  const navIcons = { home:'⌂', adventure:'✦', collection:'▦', decks:'♜', play:'⚔', rewards:'✧', shop:'◇' };
  const tileDefs = [
    {view:'adventure', icon:'✧', title:'Adventure', copy:'Explore Eryndor\nFace new paths', bg:'url(assets/ui/eryndor-map-concept-v092.jpg)'},
    {view:'collection', icon:'▦', title:'Collection', copy:'Discover cards\nBuild possibilities', bg:'url(assets/ui/collection-hero-v091.jpg)'},
    {view:'decks', icon:'♜', title:'Decks', copy:'Craft your strategy\nBring your vision', bg:'url(assets/ui/decks-hero-v091.jpg)'},
    {view:'play', icon:'⚔', title:'Play', copy:'Challenge others\nProve your skill', bg:'url(assets/ui/play-hero-v091.jpg)'}
  ];

  function getState(){ try{return S;}catch{return null;} }
  function getAdventure(){ try{return ADVENTURE||[];}catch{return [];} }
  function getAllCards(){ try{return allCards||[];}catch{return [];} }
  function getFactionColor(f){ try{return fc(f);}catch{return '#5ea6ff';} }
  function getLeaderArt(f){ try{return LEADER_ART[f]||'';}catch{return '';} }
  function countOwned(id){ try{return owned(id);}catch{return 0;} }
  function safeText(v,d=''){ return (v===undefined||v===null||v==='') ? d : String(v); }
  function bindGoButtons(root=document){ root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>typeof nav==='function'&&nav(b.dataset.go)); }
  function activeView(){ return document.querySelector('.view.active')?.id?.replace('view-','') || 'home'; }
  function totalMastery(){ const s=getState(); return Object.values(s?.mastery||{}).reduce((a,b)=>a+(Number(b)||0),0); }
  function completedCount(){ const s=getState(); return Object.values(s?.adventure?.completed||{}).filter(Boolean).length; }
  function totalStars(){ const s=getState(); return Object.values(s?.adventure?.stars||{}).reduce((a,b)=>a+(Number(b)||0),0); }
  function profileFaction(){ const s=getState(); return s?.starter || 'Alfar'; }
  function profileName(){ const s=getState(); return s?.playerName || 'AChambers'; }
  function profileLevel(){ const lvl=Math.max(1,Math.round(6 + totalMastery()*1.4 + completedCount()*0.8)); return lvl; }
  function profileProgress(){ const raw=((totalMastery()*17)+(completedCount()*13))%100; return Math.max(18,Math.min(96,Math.round(raw||38))); }
  function currencyNumber(v){ return Number(v||0).toLocaleString(); }
  function syncViewState(){ document.body.dataset.view = activeView(); }

  function patchNavChrome(){
    const navHost=$('nav');
    if(!navHost) return;
    navHost.querySelectorAll('button').forEach(btn=>{
      const view=btn.dataset.view;
      if(!view || btn.dataset.sr93Patched==='1') return;
      const label=safeText(btn.textContent,'').trim().replace(/^\S+\s*/,'').trim() || view;
      btn.innerHTML=`<span class="sr93-nav-icon">${navIcons[view]||'✦'}</span><small>${label}</small>`;
      btn.dataset.sr93Patched='1';
    });
  }

  function updateHud(){
    const topbar=document.querySelector('.topbar');
    if(!topbar) return;
    const s=getState()||{};
    const faction=profileFaction();
    const art=getLeaderArt(faction);
    const view=activeView();
    const level=profileLevel();
    const progress=profileProgress();
    const titleMap={home:'Home',adventure:'Adventure',collection:'Collection',decks:'Decks',play:'Play',rewards:'Progress',shop:'Store'};
    topbar.innerHTML=`
      <div class="sr93-hud">
        <div class="sr93-profile">
          <div class="sr93-avatar"><img src="${art}" alt="${faction} leader"></div>
          <div class="sr93-profile-copy">
            <div class="sr93-title-crumb">${titleMap[view]||'Shattered Realms'}</div>
            <div class="sr93-profile-name">${profileName()}</div>
            <div class="sr93-profile-sub"><span>Lv. ${level}</span><div class="sr93-xp"><span style="width:${progress}%"></span></div></div>
          </div>
        </div>
        <div class="sr93-currency"><span class="sr93-currency-icon">🪙</span><span class="sr93-currency-value">${currencyNumber(s.gold)}</span><button class="sr93-plus" type="button" data-go="shop">+</button></div>
        <div class="sr93-currency"><span class="sr93-currency-icon">🔷</span><span class="sr93-currency-value">${currencyNumber(s.dust)}</span><button class="sr93-plus" type="button" data-go="shop">+</button></div>
        <button class="sr93-icon-btn" id="sr93InboxBtn" type="button" aria-label="Inbox">✉</button>
        <button class="sr93-icon-btn" id="sr93SettingsBtn" type="button" aria-label="Guide and settings">⚙</button>
      </div>`;
    bindGoButtons(topbar);
    $('sr93InboxBtn')?.addEventListener('click',()=>{ try{ toast('Inbox, social, and notifications are planned for a later update.'); }catch{} });
    $('sr93SettingsBtn')?.addEventListener('click',()=>{ try{ showHelp('basics'); }catch{} });
  }

  function rewardDots(){
    const adv=getAdventure();
    const s=getState();
    return adv.map(n=>`<span class="${s?.adventure?.completed?.[n.id]?'on':''}"></span>`).join('');
  }

  function renderShowcaseHome(){
    const s=getState(); if(!s) return;
    const host=$('view-home'); if(!host) return;
    const cards=getAllCards();
    const unique=cards.filter(c=>countOwned(c.id)>0).length;
    const comp=completedCount();
    const starSum=totalStars();
    const advTotal=getAdventure().length || 7;
    const starter=profileFaction();
    const featureTitle=(getAdventure().find(n=>n.id==='first_shard')||{}).title || 'The First Shard';

    host.innerHTML=`
      <div class="sr93-home-wrap">
        <section class="sr93-home-hero panel" id="homeHero">
          <div class="sr93-brandlock">
            <div class="sr93-brand-the">THE</div>
            <div class="sr93-brand-shard">♦</div>
            <div class="sr93-logo-wordmark">SHATTERED<br>REALMS</div>
            <div class="sr93-logo-tag">BEYOND SIGHT LIES PURPOSE</div>
          </div>
          <div class="sr93-region-tag"><b>ERYNDOR</b><span>A BROKEN WORLD</span><small>A GREATER TOMORROW</small></div>
          <div class="sr93-chapter-card">
            <div class="sr93-chapter-main">
              <div class="small gold">PVE ADVENTURE • CHAPTER ONE</div>
              <h1>The Shattered Path</h1>
              <p>Travel across Eryndor, learn each faction, earn guaranteed rewards, and face encounters that can break normal PvP rules.</p>
              <button class="sr93-continue-btn" type="button" data-go="adventure">CONTINUE JOURNEY <span>›</span></button>
            </div>
            <div class="sr93-chapter-side">
              <div class="sr93-side-kicker">CHAPTER ONE</div>
              <div class="sr93-side-title">${featureTitle}</div>
              <div class="sr93-side-dots">${rewardDots()}</div>
              <div class="sr93-side-progress">${comp} / ${advTotal} paths completed • ★ ${starSum}</div>
            </div>
          </div>
        </section>

        <section class="sr93-home-grid">
          ${tileDefs.map(t=>`
            <button class="sr93-mode-card" type="button" data-go="${t.view}" style="--tile-bg:${t.bg}">
              <div class="sr93-mode-card-inner">
                <div class="sr93-mode-icon">${t.icon}</div>
                <div class="sr93-mode-title">${t.title}</div>
                <div class="sr93-mode-copy">${t.copy.replace(/\n/g,'<br>')}</div>
                <div class="sr93-mode-arrow">›</div>
              </div>
            </button>`).join('')}
        </section>

        <section class="sr93-event-strip panel">
          <div class="sr93-event-art"></div>
          <div class="sr93-event-main">
            <div class="small gold">FEATURED EVENT</div>
            <h2>Trial of the Shards</h2>
            <p>Unique challenges. Limited-time rewards. Test your legend while expanding your collection and faction mastery.</p>
            <div class="sr93-event-timer"><span>◔</span><span>Ends in 4d 12h</span></div>
          </div>
          <div class="sr93-event-rewards">
            <div class="small gold">POSSIBLE REWARDS</div>
            <div class="sr93-reward-icons"><span>🪙</span><span>🔷</span><span>💎</span><span>🎁</span></div>
            <div class="muted"><span id="collectionCount">${unique}/${cards.length}</span> unique cards discovered</div>
          </div>
        </section>

        <section class="sr93-home-meta">
          <div class="panel sr93-home-note">
            <h2>Daily Quests</h2>
            <div class="sr93-quest-list" id="homeQuests"></div>
          </div>
          <div class="panel sr93-home-note">
            <h2>Faction Mastery</h2>
            <div class="sr93-mastery-grid" id="homeMastery"></div>
            <div class="bar" style="margin-top:14px"><span id="collectionMilestone" style="width:0%"></span></div>
          </div>
        </section>
      </div>`;

    const milestone=Math.min(100,(unique/30)*100);
    if($('collectionMilestone')) $('collectionMilestone').style.width = milestone + '%';

    $('homeQuests').innerHTML=(s.quests||[]).slice(0,3).map(q=>`
      <div class="quest"><div><b>${q.name}</b><div class="small muted">Reward: ${q.reward||'Progress reward'}</div><div class="bar"><span style="width:${Math.min(100,(q.p/q.max)*100)}%"></span></div></div><span class="tag">${q.p}/${q.max}</span></div>`).join('');

    const masteryFactions=[starter,'Adventure','Collection'];
    const masteryHtml=[
      `<div class="sr93-faction-pill" style="--fc:${getFactionColor(starter)}"><div class="small gold">PRIMARY FACTION</div><b>${starter}</b><div class="muted">Mastery Lv. ${Math.floor((s.mastery?.[starter]||0)+1)}</div></div>`,
      `<div class="sr93-faction-pill"><div class="small gold">ADVENTURE</div><b>${completedCount()} Clears</b><div class="muted">${safeText(getAdventure().find(n=>n.id===s.adventure?.selected)?.name,'The First Shard')} selected</div></div>`,
      `<div class="sr93-faction-pill"><div class="small gold">COLLECTION</div><b>${unique}/${cards.length}</b><div class="muted">${currencyNumber(s.packs||0)} cache(s) ready to open</div></div>`
    ];
    $('homeMastery').innerHTML=masteryHtml.join('');
    bindGoButtons(host);
  }

  function decorateAdventure(){
    const map=$('worldMap'); if(map) map.classList.add('sr93-worldmap');
    const panel=$('encounterPanel'); if(panel) panel.classList.add('sr93-encounter');
    const title=map?.querySelector('.map-title .small.muted');
    if(title) title.textContent='Complete encounters to open the next path.';
  }

  function postDecorate(){
    patchNavChrome();
    updateHud();
    syncViewState();
    const view=activeView();
    if(view==='adventure') decorateAdventure();
  }

  function wrap(name, after, replace){
    try{
      const original = eval(name);
      if(typeof original !== 'function') return;
      const wrapped = replace || function(...args){ const out = original.apply(this,args); after?.(...args); return out; };
      eval(`${name} = wrapped`);
    }catch(err){ console.warn('v0.9.3 wrap skipped for', name, err); }
  }

  window.addEventListener('load',()=>{
    document.documentElement.classList.add('sr-showcase-v093');
    document.body.classList.add('sr-showcase-v093-body');
    patchNavChrome();

    wrap('renderHome', ()=>{ renderShowcaseHome(); postDecorate(); }, function(...args){ renderShowcaseHome(); postDecorate(); });
    wrap('renderAdventure', ()=>{ postDecorate(); });
    wrap('renderCollection', ()=>{ postDecorate(); });
    wrap('renderDeckBuilder', ()=>{ postDecorate(); });
    wrap('renderPlay', ()=>{ postDecorate(); });
    wrap('renderRewards', ()=>{ postDecorate(); });
    wrap('renderPack', ()=>{ postDecorate(); });
    wrap('renderCurrencies', ()=>{ postDecorate(); });
    wrap('nav', ()=>{ setTimeout(postDecorate,40); });

    try{ renderAll(); }catch{}
    postDecorate();
    bindGoButtons(document);
  });
})();
