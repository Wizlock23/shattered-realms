/* Shattered Realms v0.9.4 — exact target pass
   Activates the phone-first concept match shown in the approved screenshots. */
(()=>{
  const $ = id => document.getElementById(id);

  const ICONS={
    home:'<path d="M3 10.5 12 3l9 7.5v10.5h-6v-6H9v6H3z"/>',
    adventure:'<path d="M12 2.7 15 9l6.3 3-6.3 3-3 6.3L9 15l-6.3-3L9 9z"/><circle cx="12" cy="12" r="2.1"/>',
    collection:'<path d="M5 4h11v15H5z"/><path d="M8 2h11v15"/><path d="M3 7h2v14h11v-2"/>',
    decks:'<path d="M5 4h14v16H5z"/><path d="M8 4V2h8v2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    play:'<path d="m5 4 14 16M19 4 5 20"/><path d="m4 3 5 2-4 4zM20 3l-5 2 4 4zM4 21l5-2-4-4zM20 21l-5-2 4-4z"/>',
    rewards:'<path d="m12 2 2.4 6.1L21 10l-5 4.1.8 6.9-4.8-3.6L7.2 21 8 14.1 3 10l6.6-1.9z"/>',
    shop:'<path d="M4 9h16l-1 12H5z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    coin:'<circle cx="12" cy="12" r="8"/><path d="M9 9h6M9 12h6M9 15h6"/>',
    dust:'<path d="m12 2 7 10-7 10-7-10z"/><path d="m12 6 3.8 6-3.8 6-3.8-6z"/>',
    chest:'<path d="M4 10h16v10H4zM5 6h14l1 4H4z"/><path d="M10 10h4v5h-4z"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    back:'<path d="m15 5-7 7 7 7"/>'
  };
  const icon=(name,cls='')=>`<svg class="sr94-svg ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||ICONS.adventure}</svg>`;
  const navMeta = {
    home:{icon:'home',label:'Home'},
    adventure:{icon:'adventure',label:'Adventure'},
    collection:{icon:'collection',label:'Collection'},
    decks:{icon:'decks',label:'Decks'},
    play:{icon:'play',label:'Play'},
    rewards:{icon:'rewards',label:'Progress'},
    shop:{icon:'shop',label:'Store'}
  };
  const homeTiles = [
    {view:'adventure',icon:'adventure',title:'Adventure',copy:'EXPLORE ERYNDOR\nFACE NEW PATHS',bg:'url(assets/ui/eryndor-map-concept-v092.jpg)'},
    {view:'collection',icon:'collection',title:'Collection',copy:'DISCOVER CARDS\nBUILD POSSIBILITIES',bg:'url(assets/ui/collection-hero-v091.jpg)'},
    {view:'decks',icon:'decks',title:'Decks',copy:'CRAFT YOUR STRATEGY\nBRING YOUR VISION',bg:'url(assets/ui/decks-hero-v091.jpg)'},
    {view:'play',icon:'play',title:'Play',copy:'CHALLENGE OTHERS\nPROVE YOUR SKILL',bg:'url(assets/ui/play-hero-v091.jpg)'}
  ];
  const factionArt = {
    Alfar:'assets/ui/alfar-faction.jpg',
    Dwarves:'assets/ui/dwarves-faction.jpg',
    Mercians:'assets/ui/mercians-faction.jpg',
    Mahirim:'assets/ui/mahirim-faction.jpg',
    Mirdain:'assets/ui/mirdain-faction.jpg',
    Orks:'assets/ui/orks-faction.jpg'
  };

  function state(){ try{return S;}catch{return null;} }
  function adventureData(){ try{return ADVENTURE||[];}catch{return [];} }
  function factionColor(f){ try{return fc(f);}catch{return '#5da7ff';} }
  function leaderArt(f){ try{return LEADER_ART[f]||'';}catch{return ''; } }
  function safeOwned(id){ try{return owned(id);}catch{return 0;} }
  function safeCards(){ try{return allCards||[];}catch{return [];} }
  function safeText(v,d=''){ return v===undefined||v===null||v==='' ? d : String(v); }
  function number(v){ return Number(v||0).toLocaleString(); }
  function activeView(){ return document.querySelector('.view.active')?.id?.replace('view-','') || 'home'; }
  function bindGo(root=document){ root.querySelectorAll('[data-go]').forEach(b=>{ b.onclick=()=>{ if(typeof nav==='function') nav(b.dataset.go); }; }); }
  function completedCount(){ const s=state(); return Object.values(s?.adventure?.completed||{}).filter(Boolean).length; }
  function starCount(){ const s=state(); return Object.values(s?.adventure?.stars||{}).reduce((a,b)=>a+(Number(b)||0),0); }
  function starterFaction(){ const s=state(); return s?.starter || 'Alfar'; }
  function playerName(){ const s=state(); return s?.playerName || 'AChambers'; }
  function levelValue(){ const s=state(); const mastery=Object.values(s?.mastery||{}).reduce((a,b)=>a+(Number(b)||0),0); return Math.max(7,Math.round(6 + mastery*1.25 + completedCount()*0.8)); }
  function xpValue(){ const s=state(); const mastery=Object.values(s?.mastery||{}).reduce((a,b)=>a+(Number(b)||0),0); return Math.max(22,Math.min(92,Math.round(((mastery*19)+(completedCount()*13))%100 || 44))); }
  function viewTitle(view){ return ({home:'Home',adventure:'Adventure',collection:'Collection',decks:'Decks',play:'Play',rewards:'Progress',shop:'Store'})[view] || 'Shattered Realms'; }
  function questMarkup(q){ return `<div class="quest"><div><b>${q.name}</b><div class="small muted">Reward: ${q.reward||'Progress reward'}</div><div class="bar"><span style="width:${Math.min(100,(q.p/q.max)*100)}%"></span></div></div><span class="tag">${q.p}/${q.max}</span></div>`; }
  function encounterSelection(){ const s=state(); const adv=adventureData(); return adv.find(x=>x.id===s?.adventure?.selected) || adv[0]; }

  function setClasses(){
    document.documentElement.classList.add('sr-target-v094');
    document.body.classList.add('sr-target-v094-body');
    document.body.dataset.view = activeView();
  }

  function patchNav(){
    const navHost=$('nav');
    if(!navHost) return;
    navHost.querySelectorAll('button').forEach(btn=>{
      const meta=navMeta[btn.dataset.view];
      if(!meta || btn.dataset.sr94Patched==='1') return;
      btn.innerHTML=`<span class="sr94-nav-icon">${icon(meta.icon)}</span><small>${meta.label}</small>`;
      btn.dataset.sr94Patched='1';
    });
  }

  function updateHud(){
    const topbar=document.querySelector('.topbar');
    if(!topbar) return;
    const s=state()||{};
    const view=activeView();
    const faction=starterFaction();
    const level=levelValue();
    const xp=xpValue();
    const avatar=leaderArt(faction);

    if(view==='home'){
      topbar.innerHTML=`
        <div class="sr94-hud">
          <div class="sr94-profile">
            <div class="sr94-avatar"><img src="${avatar}" alt="${faction} leader"></div>
            <div class="sr94-profile-copy">
              <div class="sr94-name">${playerName()}</div>
              <div class="sr94-level"><span>Lv. ${level}</span><div class="sr94-xp"><span style="width:${xp}%"></span></div></div>
            </div>
          </div>
          <div class="sr94-currency gold"><span class="ico">${icon('coin')}</span><b>${number(s.gold)}</b><button class="sr94-mini-plus" type="button" data-go="shop">+</button></div>
          <div class="sr94-currency dust"><span class="ico">${icon('dust')}</span><b>${number(s.dust)}</b><button class="sr94-mini-plus" type="button" data-go="shop">+</button></div>
          <button class="sr94-util" id="sr94InboxBtn" type="button" aria-label="Inbox">${icon('mail')}</button>
          <button class="sr94-util" id="sr94SettingsBtn" type="button" aria-label="Settings">${icon('gear')}</button>
        </div>`;
    } else {
      const leftIcon = view==='collection' ? icon('menu') : icon('back');
      topbar.innerHTML=`
        <div class="sr94-hud">
          <div class="sr94-view-title-wrap">
            <button class="sr94-back" id="sr94BackBtn" type="button" aria-label="Back">${leftIcon}</button>
            <div class="sr94-title">${viewTitle(view)}</div>
          </div>
          <div class="sr94-currency gold"><span class="ico">${icon('coin')}</span><b>${number(s.gold)}</b></div>
          <div class="sr94-currency dust"><span class="ico">${icon('dust')}</span><b>${number(s.dust)}</b></div>
          <button class="sr94-util" type="button" data-go="shop" aria-label="Acquire cards">+</button>
        </div>`;
    }
    bindGo(topbar);
    $('sr94BackBtn')?.addEventListener('click',()=>{ if(typeof nav==='function'){ nav(view==='collection'?'home':'home'); } });
    $('sr94InboxBtn')?.addEventListener('click',()=>{ try{ toast('Inbox and notifications are planned for a later update.'); }catch{} });
    $('sr94SettingsBtn')?.addEventListener('click',()=>{ try{ showHelp('basics'); }catch{} });
  }

  function renderExactHome(){
    const host=$('view-home');
    const s=state();
    if(!host||!s) return;
    const cards=safeCards();
    const unique=cards.filter(c=>safeOwned(c.id)>0).length;
    const comp=completedCount();
    const stars=starCount();
    const adv=adventureData();
    const total=adv.length || 7;
    const current=(adv.find(n=>n.id==='first_shard')||adv[0]||{}).title || 'The First Shard';
    const mainFaction=starterFaction();
    const factionLevel=Math.max(1,Math.floor((s.mastery?.[mainFaction]||0)+1));

    host.innerHTML=`
      <div class="sr94-home">
        <section class="sr94-hero">
          <div class="sr94-hero-art"></div>
          <div class="sr94-chapter">
            <div class="sr94-chapter-main">
              <div class="small gold">PVE ADVENTURE • CHAPTER ONE</div>
              <h1>The Shattered Path</h1>
              <p>Travel across Eryndor, learn each faction, earn guaranteed rewards, and face encounters that break normal PvP rules.</p>
              <button class="sr94-continue" type="button" data-go="adventure">CONTINUE JOURNEY <span>›</span></button>
            </div>
            <div class="sr94-chapter-side">
              <div class="kicker">CHAPTER ONE</div>
              <b>${current}</b>
              <div class="sr94-diamonds">${adv.map((n,i)=>`<i class="${s.adventure?.completed?.[n.id]?'on':''}"></i>`).join('')}</div>
              <div class="muted">${comp} / ${total} paths completed</div>
            </div>
          </div>
        </section>

        <section class="sr94-mode-grid">
          ${homeTiles.map(t=>`
            <button class="sr94-mode" type="button" data-go="${t.view}" style="--bg:linear-gradient(180deg,rgba(4,9,20,.12),rgba(4,9,20,.12)),${t.bg}">
              <div class="sr94-mode-inner">
                <div class="icon">${icon(t.icon)}</div>
                <strong>${t.title}</strong>
                <small>${t.copy.replace(/\n/g,'<br>')}</small>
                <em>›</em>
              </div>
            </button>`).join('')}
        </section>

        <section class="sr94-event">
          <div class="sr94-event-art"></div>
          <div class="sr94-event-main">
            <div class="small gold">FEATURED EVENT</div>
            <h2>Trial of the Shards</h2>
            <p>Unique challenges. Limited-time rewards. Test your legend while pushing faction mastery and growing your collection.</p>
            <div class="sr94-event-timer">◔ Ends in 4d 12h</div>
          </div>
          <div class="sr94-event-rewards">
            <div class="small gold">POSSIBLE REWARDS</div>
            <div class="sr94-rewards"><span>${icon('coin')}</span><span>${icon('dust')}</span><span>${icon('adventure')}</span><span>${icon('chest')}</span></div>
            <div class="muted">${unique}/${cards.length} unique cards discovered</div>
          </div>
        </section>

        <section class="sr94-home-info">
          <div class="panel">
            <h2>Daily Quests</h2>
            <div>${(s.quests||[]).slice(0,3).map(questMarkup).join('')}</div>
          </div>
          <div class="panel">
            <h2>Faction Mastery</h2>
            <div class="quest"><div><b>${mainFaction}</b><div class="small muted">Primary faction mastery</div><div class="bar"><span style="width:${Math.min(100,(s.mastery?.[mainFaction]||0)*18)}%"></span></div></div><span class="tag">Lv ${factionLevel}</span></div>
            <div class="quest"><div><b>Adventure Stars</b><div class="small muted">Earn more rewards by replaying encounters</div><div class="bar"><span style="width:${Math.min(100,(stars/(total*3||1))*100)}%"></span></div></div><span class="tag">★ ${stars}</span></div>
            <div class="quest"><div><b>Collection</b><div class="small muted">Cards discovered from Aether Caches and crafting</div><div class="bar"><span style="width:${Math.min(100,(unique/Math.max(cards.length,1))*100)}%"></span></div></div><span class="tag">${unique}/${cards.length}</span></div>
          </div>
        </section>
      </div>`;

    bindGo(host);
  }

  function renderExactEncounter(n){
    const panel=$('encounterPanel');
    if(!panel || !n) return;
    panel.classList.add('sr94-encounter','sr-encounter-detail');
    const s=state()||{};
    const done=!!s.adventure?.completed?.[n.id];
    const starValue=s.adventure?.stars?.[n.id] || 0;
    let rewards=[];
    try{ rewards = (typeof rewardSummary==='function' ? rewardSummary(n.rewards) : []).slice(0,4); }catch{}
    if(!rewards.length){
      rewards = (n.rewards||[]).map(r=>r.label || r.type || r.card || r.name).filter(Boolean).slice(0,4);
    }
    const art = n.boss ? 'assets/worldshard-behemoth.png' : (factionArt[n.faction] || 'assets/ui/eryndor-map-concept-v092.jpg');
    const objectives=(n.objectives||[]).map((o,i)=>`<div class="objective"><span class="check">${i+1}</span><span>${o.label}</span></div>`).join('');
    const btnText = done ? 'Replay Encounter' : (n.boss ? 'Challenge Boss' : 'Begin Encounter');
    panel.style.setProperty('--ec', factionColor(n.faction));
    panel.innerHTML=`
      <div class="sr94-encounter-top">
        <div class="sr94-encounter-art" style="background-image:linear-gradient(180deg,rgba(6,13,24,.18),rgba(6,13,24,.18)),url('${art}')"></div>
        <div class="sr94-encounter-copy">
          <div class="small gold">${n.boss?'CHAPTER BOSS':safeText(n.sub,'GUIDED ENCOUNTER').toUpperCase()}</div>
          <h2>${n.title}</h2>
          <div class="sub">${safeText(n.name,'Worldshard Trail')}</div>
          <div class="small muted">${'★'.repeat(starValue)}${'☆'.repeat(Math.max(0,3-starValue))}</div>
          <p>${safeText(n.story,'Ancient power stirs beneath the broken realms. Continue along the path to learn each faction and face deeper challenges.')}</p>
        </div>
      </div>
      <div class="sr94-encounter-bottom">
        <div class="small gold">Possible Rewards</div>
        <div class="rewardline">${rewards.map(r=>`<span class="rewardpill">${r}</span>`).join('')}</div>
        <details class="sr94-more">
          <summary>Show objectives</summary>
          <div class="objective-list">${objectives || '<div class="small muted">No special objectives listed.</div>'}</div>
        </details>
        <button class="btn ${n.boss?'gold':'primary'}" id="launchEncounter94" type="button">${btnText}</button>
      </div>`;
    $('launchEncounter94')?.addEventListener('click',()=>{ if(typeof launchAdventureEncounter==='function') launchAdventureEncounter(n); });
  }

  function decorateAdventure(){
    const map=$('worldMap');
    const panel=$('encounterPanel');
    if(map) map.classList.add('sr-concept-map');
    if(panel) panel.classList.add('sr94-encounter');
    const current=encounterSelection();
    if(current) renderExactEncounter(current);
  }

  function decorateCollection(){
    const detail=$('cardDetail');
    if(!detail) return;
    detail.classList.add('sr94-card-detail');
    let navBox=detail.querySelector('.sr94-detail-nav');
    if(!navBox){
      navBox=document.createElement('div');
      navBox.className='sr94-detail-nav';
      navBox.innerHTML='<button type="button" data-card-prev aria-label="Previous card">‹</button><button type="button" data-card-next aria-label="Next card">›</button>';
      detail.appendChild(navBox);
    }
    let arr=[];
    try{ arr=filteredCards(); }catch{}
    if(!arr.length) return;
    let idx=0;
    try{ idx=Math.max(0,arr.findIndex(c=>selectedCard&&c.id===selectedCard.id)); }catch{}
    const go=delta=>{
      const next=(idx+delta+arr.length)%arr.length;
      try{ selectedCard=arr[next]; renderDetail(); setTimeout(decorateCollection,0); }catch{}
    };
    navBox.querySelector('[data-card-prev]')?.addEventListener('click',()=>go(-1));
    navBox.querySelector('[data-card-next]')?.addEventListener('click',()=>go(1));
  }

  function postDecorate(){
    setClasses();
    patchNav();
    updateHud();
    if(activeView()==='adventure') decorateAdventure();
    if(activeView()==='collection') decorateCollection();
    bindGo(document);
  }

  function wrap(name, after, replace){
    try{
      const original = eval(name);
      if(typeof original !== 'function') return;
      const wrapped = replace || function(...args){ const out = original.apply(this,args); after?.(...args); return out; };
      eval(`${name} = wrapped`);
    }catch(err){ console.warn('v0.9.4 wrap skipped for', name, err); }
  }

  window.addEventListener('load',()=>{
    setClasses();
    patchNav();

    wrap('renderHome', ()=>{ renderExactHome(); postDecorate(); }, function(...args){ renderExactHome(); postDecorate(); });
    wrap('renderAdventure', ()=>{ setTimeout(postDecorate,20); });
    wrap('renderEncounter', (n)=>{ renderExactEncounter(n); postDecorate(); }, function(n){ renderExactEncounter(n); postDecorate(); });
    wrap('renderCollection', ()=>{ postDecorate(); });
    wrap('renderDetail', ()=>{ setTimeout(decorateCollection,0); });
    wrap('renderDeckBuilder', ()=>{ postDecorate(); });
    wrap('renderPlay', ()=>{ postDecorate(); });
    wrap('renderRewards', ()=>{ postDecorate(); });
    wrap('renderPack', ()=>{ postDecorate(); });
    wrap('renderCurrencies', ()=>{ postDecorate(); });
    wrap('nav', ()=>{ setTimeout(postDecorate,40); });

    try{ renderAll(); }catch{}
    postDecorate();
  });
})();
