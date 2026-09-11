/* Shattered Realms v0.10.0 — full showcase UI rebuild */
(()=>{
  const $=id=>document.getElementById(id);
  const ICONS={
    home:'<path d="M3 10.5 12 3l9 7.5v10.5h-6v-6H9v6H3z"/>',
    adventure:'<path d="M12 2.5 15 9l6.5 3-6.5 3-3 6.5L9 15l-6.5-3L9 9z"/><circle cx="12" cy="12" r="2"/>',
    collection:'<path d="M5 4h11v15H5z"/><path d="M8 2h11v15"/><path d="M3 7h2v14h11v-2"/>',
    decks:'<path d="M5 4h14v16H5z"/><path d="M8 4V2h8v2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    play:'<path d="m5 4 14 16M19 4 5 20"/><path d="m4 3 5 2-4 4zM20 3l-5 2 4 4zM4 21l5-2-4-4zM20 21l-5-2 4-4z"/>',
    rewards:'<path d="m12 2 2.4 6.1L21 10l-5 4.1.8 6.9-4.8-3.6L7.2 21 8 14.1 3 10l6.6-1.9z"/>',
    shop:'<path d="M4 9h16l-1 12H5zM5 6h14l1 4H4z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
    coin:'<circle cx="12" cy="12" r="8"/><path d="M9 9h6M9 12h6M9 15h6"/>',
    dust:'<path d="m12 2 7 10-7 10-7-10z"/><path d="m12 6 3.8 6-3.8 6-3.8-6z"/>',
    chest:'<path d="M4 10h16v10H4zM5 6h14l1 4H4z"/><path d="M10 10h4v5h-4z"/>',
    back:'<path d="m15 5-7 7 7 7"/>',
    search:'<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    filter:'<path d="M4 6h16M7 12h10M10 18h4"/>'
  };
  const icon=(name)=>`<svg class="sr100-svg" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]||ICONS.adventure}</svg>`;
  const navMeta={home:['home','Home'],adventure:['adventure','Adventure'],collection:['collection','Collection'],decks:['decks','Decks'],play:['play','Play'],rewards:['rewards','Progress'],shop:['shop','Store']};
  const factionSig={All:'✦',Alfar:'✧',Dwarves:'◆',Mercians:'♛',Mahirim:'🐺',Mirdain:'❧',Orks:'☠'};
  const tileDefs=[
    ['adventure','adventure','Adventure','EXPLORE ERYNDOR\nFACE NEW PATHS','url(assets/ui/eryndor-map-concept-v092.jpg)'],
    ['collection','collection','Collection','DISCOVER CARDS\nBUILD POSSIBILITIES','url(assets/ui/collection-hero-v091.jpg)'],
    ['decks','decks','Decks','CRAFT YOUR STRATEGY\nBRING YOUR VISION','url(assets/ui/decks-hero-v091.jpg)'],
    ['play','play','Play','CHALLENGE OTHERS\nPROVE YOUR SKILL','url(assets/ui/play-hero-v091.jpg)']
  ];
  const factionArt={Alfar:'assets/ui/alfar-faction.jpg',Dwarves:'assets/ui/dwarves-faction.jpg',Mercians:'assets/ui/mercians-faction.jpg',Mahirim:'assets/ui/mahirim-faction.jpg',Mirdain:'assets/ui/mirdain-faction.jpg',Orks:'assets/ui/orks-faction.jpg'};

  const st=()=>{try{return S}catch{return null}};
  const cards=()=>{try{return allCards||[]}catch{return []}};
  const adv=()=>{try{return ADVENTURE||[]}catch{return []}};
  const own=id=>{try{return owned(id)}catch{return 0}};
  const fcolor=f=>{try{return fc(f)}catch{return '#5aa7ff'}};
  const lart=f=>{try{return LEADER_ART[f]||''}catch{return ''}};
  const active=()=>document.querySelector('.view.active')?.id?.replace('view-','')||'home';
  const starter=()=>st()?.starter||'Alfar';
  const completeCount=()=>Object.values(st()?.adventure?.completed||{}).filter(Boolean).length;
  const starCount=()=>Object.values(st()?.adventure?.stars||{}).reduce((a,b)=>a+(+b||0),0);
  const masteryTotal=()=>Object.values(st()?.mastery||{}).reduce((a,b)=>a+(+b||0),0);
  const level=()=>Math.max(7,Math.round(6+masteryTotal()*1.25+completeCount()*.8));
  const xp=()=>Math.max(22,Math.min(92,Math.round(((masteryTotal()*19)+(completeCount()*13))%100||44)));
  const num=v=>Number(v||0).toLocaleString();
  const go=root=>root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>window.nav?.(b.dataset.go));
  const viewTitle=v=>({home:'Home',adventure:'Adventure',collection:'Collection',decks:'Decks',play:'Play',rewards:'Progress',shop:'Store'})[v]||'Shattered Realms';

  function patchNav(){
    const n=$('nav'); if(!n)return;
    n.querySelectorAll('button').forEach(b=>{const m=navMeta[b.dataset.view];if(!m)return;b.innerHTML=`<span class="sr100-nav-icon">${icon(m[0])}</span><small>${m[1]}</small>`});
  }

  function updateHud(){
    const top=document.querySelector('.topbar'); if(!top)return;
    const s=st()||{}, v=active(), fac=starter();
    if(v==='home'){
      top.innerHTML=`<div class="sr100-hud">
        <div class="sr100-profile"><div class="sr100-avatar"><img src="${lart(fac)}" alt="${fac} leader"></div><div><div class="sr100-name">${s.playerName||'AChambers'}</div><div class="sr100-level"><span>Lv. ${level()}</span><div class="sr100-xp"><span style="width:${xp()}%"></span></div></div></div></div>
        <div class="sr100-currency gold"><span class="ico">${icon('coin')}</span><b>${num(s.gold)}</b><button class="sr100-plus" data-go="shop">+</button></div>
        <div class="sr100-currency dust"><span class="ico">${icon('dust')}</span><b>${num(s.dust)}</b><button class="sr100-plus" data-go="shop">+</button></div>
        <button class="sr100-util" id="sr100Mail" aria-label="Inbox">${icon('mail')}</button><button class="sr100-util" id="sr100Gear" aria-label="Help and settings">${icon('gear')}</button>
      <span class="sr100-compat" id="viewTitle">Home</span><span class="sr100-compat" id="goldTop">${num(s.gold)}</span><span class="sr100-compat" id="dustTop">${num(s.dust)}</span><span class="sr100-compat" id="packsTop">${num(s.packs)}</span></div>`;
      $('sr100Mail')?.addEventListener('click',()=>{try{toast('Inbox and social features are planned for a later update.')}catch{}});
      $('sr100Gear')?.addEventListener('click',()=>{try{showHelp('basics')}catch{}});
    }else{
      top.innerHTML=`<div class="sr100-hud"><div class="sr100-view"><button class="sr100-back" id="sr100Back">${icon('back')}</button><div class="sr100-view-title">${viewTitle(v)}</div></div><div class="sr100-currency gold"><span class="ico">${icon('coin')}</span><b>${num(s.gold)}</b></div><div class="sr100-currency dust"><span class="ico">${icon('dust')}</span><b>${num(s.dust)}</b></div><button class="sr100-util" data-go="shop">+</button><span class="sr100-compat" id="viewTitle">${viewTitle(v)}</span><span class="sr100-compat" id="goldTop">${num(s.gold)}</span><span class="sr100-compat" id="dustTop">${num(s.dust)}</span><span class="sr100-compat" id="packsTop">${num(s.packs)}</span></div>`;
      $('sr100Back')?.addEventListener('click',()=>window.nav?.('home'));
    }
    go(top);
  }

  function homeHTML(){
    const s=st()||{}, a=adv(), total=a.length||7, comp=completeCount(), stars=starCount(), current=a.find(x=>x.id==='first_shard')?.name||'The First Shard';
    const unique=cards().filter(c=>own(c.id)>0).length;
    return `<div class="sr100-home">
      <section class="sr100-home-hero"><div class="sr100-home-art"></div><div class="sr100-chapter"><div class="sr100-chapter-main"><div class="small gold">PVE ADVENTURE • CHAPTER ONE</div><h1>The Shattered Path</h1><p>Travel across Eryndor, learn each faction, earn guaranteed rewards, and face encounters that can break normal PvP rules.</p><button class="sr100-continue" data-go="adventure">CONTINUE JOURNEY ›</button></div><div class="sr100-chapter-side"><div class="kicker">CHAPTER ONE</div><b>${current}</b><div class="sr100-diamonds">${a.map(x=>`<i class="${s.adventure?.completed?.[x.id]?'on':''}"></i>`).join('')}</div><div class="muted">${comp} / ${total} paths completed</div></div></div></section>
      <section class="sr100-mode-grid">${tileDefs.map(([view,ic,title,copy,bg])=>`<button class="sr100-mode" data-go="${view}" style="--bg:${bg}"><div class="sr100-mode-inner"><div class="sr100-mode-icon">${icon(ic)}</div><strong>${title}</strong><small>${copy.replace(/\n/g,'<br>')}</small><em>›</em></div></button>`).join('')}</section>
      <section class="sr100-event"><div class="sr100-event-art"></div><div class="sr100-event-main"><div class="small gold">FEATURED EVENT</div><h2>Trial of the Shards</h2><p>Unique challenges. Limited-time rewards. Test your legend while growing your collection and faction mastery.</p><div class="sr100-event-timer">◔ Ends in 4d 12h</div></div><div class="sr100-event-rewards"><div class="small gold">POSSIBLE REWARDS</div><div class="sr100-reward-icons"><span>${icon('coin')}</span><span>${icon('dust')}</span><span>${icon('adventure')}</span><span>${icon('chest')}</span></div><div class="muted">${unique}/${cards().length} cards discovered</div></div></section>
      <section class="sr100-home-extra"><div class="panel"><h2>Daily Quests</h2>${(s.quests||[]).slice(0,3).map(q=>`<div class="quest"><div><b>${q.name}</b><div class="bar"><span style="width:${Math.min(100,q.p/q.max*100)}%"></span></div></div><span class="tag">${q.p}/${q.max}</span></div>`).join('')}</div><div class="panel"><h2>Faction Mastery</h2><div class="quest"><div><b>${starter()}</b><div class="small muted">Primary faction</div><div class="bar"><span style="width:${Math.min(100,(s.mastery?.[starter()]||0)*18)}%"></span></div></div><span class="tag">★ ${stars}</span></div></div></section>
    </div>`;
  }

  function renderHome100(){const h=$('view-home');if(!h)return;h.innerHTML=homeHTML();go(h)}

  function ensureChapters(){
    const view=$('view-adventure'); if(!view||view.querySelector('.sr100-chapters'))return;
    const tabs=document.createElement('div');tabs.className='sr100-chapters';tabs.innerHTML='<button class="active">CHAPTER 1</button><button disabled>CHAPTER 2</button><button disabled>CHAPTER 3</button><button disabled>CHAPTER 4</button>';
    const stage=view.querySelector('.sr-adventure-stage'); view.insertBefore(tabs,stage);
  }

  function renderEncounter100(n){
    const panel=$('encounterPanel');if(!panel||!n)return;
    const s=st()||{}, done=!!s.adventure?.completed?.[n.id], stars=s.adventure?.stars?.[n.id]||0;
    let rs=[];try{rs=rewardSummary(n.rewards).slice(0,4)}catch{}
    const art=n.boss?'assets/worldshard-behemoth.png':(factionArt[n.faction]||'assets/ui/eryndor-map-concept-v092.jpg');
    panel.className='panel encounter-card sr100-encounter';panel.style.setProperty('--ec',fcolor(n.faction));
    panel.innerHTML=`<div class="sr100-encounter-top"><div class="sr100-encounter-art" style="background-image:linear-gradient(180deg,rgba(4,10,20,.12),rgba(4,10,20,.12)),url('${art}')"></div><div class="sr100-encounter-copy"><div class="small gold">${n.boss?'CHAPTER BOSS':(n.sub||'ENCOUNTER').toUpperCase()}</div><h2>${n.title}</h2><div class="sub">${n.name}</div><div class="small muted">${'★'.repeat(stars)}${'☆'.repeat(Math.max(0,3-stars))}</div><p>${n.story||''}</p></div></div><div class="sr100-encounter-bottom"><div class="small gold">POSSIBLE REWARDS</div><div class="rewardline">${rs.map(r=>`<span class="rewardpill">${r}</span>`).join('')}</div><button class="sr100-objectives-btn" type="button">Show objectives</button><div class="sr100-objectives">${(n.objectives||[]).map((o,i)=>`<div class="objective"><span class="check">${i+1}</span><span>${o.label}</span></div>`).join('')}</div><button class="btn ${n.boss?'gold':'primary'}" id="launchEncounter100">${done?'Replay Encounter':n.boss?'Challenge Boss':'Begin Encounter'}</button></div>`;
    panel.querySelector('.sr100-objectives-btn').onclick=()=>panel.querySelector('.sr100-objectives').classList.toggle('open');
    $('launchEncounter100').onclick=()=>window.launchAdventureEncounter?.(n);
  }

  function decorateAdventure(){ensureChapters();const s=st(),a=adv(),n=a.find(x=>x.id===s?.adventure?.selected)||a[0];if(n)renderEncounter100(n)}

  function collectionTabs(){
    const v=$('view-collection');if(!v)return;
    let head=v.querySelector('.sr100-collection-head');if(!head){head=document.createElement('div');head.className='sr100-collection-head';head.innerHTML=`<div class="sr100-search"><span class="ico">${icon('search')}</span><input id="sr100SearchMirror" placeholder="Search cards, abilities, or keywords..."></div><button class="sr100-filter-btn" type="button">${icon('filter')}</button>`;v.insertBefore(head,v.firstChild);head.querySelector('input').addEventListener('input',e=>{const q=$('cardSearch');if(q){q.value=e.target.value;q.dispatchEvent(new Event('input',{bubbles:true}))}})}
    let tabs=v.querySelector('.sr100-factions');if(!tabs){tabs=document.createElement('div');tabs.className='sr100-factions';head.after(tabs)}
    const sel=$('factionFilter'), fs=['All','Alfar','Dwarves','Mercians','Mahirim','Mirdain','Orks'];tabs.innerHTML=fs.map(f=>`<button class="${sel?.value===f?'active':''}" data-f="${f}"><span class="sig">${factionSig[f]}</span><span>${f}</span></button>`).join('');tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!sel)return;sel.value=b.dataset.f;sel.dispatchEvent(new Event('change',{bubbles:true}));collectionTabs()});
  }

  function decorateDetail(){
    const d=$('cardDetail');if(!d)return;d.classList.add('sr100-detail');let nav=d.querySelector('.sr100-detail-nav');if(nav)nav.remove();nav=document.createElement('div');nav.className='sr100-detail-nav';nav.innerHTML='<button data-prev>‹</button><button data-next>›</button>';d.appendChild(nav);
    let arr=[];try{arr=filteredCards()}catch{};if(!arr.length)return;let idx=0;try{idx=Math.max(0,arr.findIndex(c=>selectedCard&&c.id===selectedCard.id))}catch{}
    const step=delta=>{const next=(idx+delta+arr.length)%arr.length;selectedCard=arr[next];window.renderDetail?.();setTimeout(decorateDetail,0)};nav.querySelector('[data-prev]').onclick=()=>step(-1);nav.querySelector('[data-next]').onclick=()=>step(1);
  }

  function decorateCollection(){collectionTabs();decorateDetail()}
  function decorateDecks(){const v=$('view-decks');if(!v||v.querySelector('.sr100-page-title'))return;const h=document.createElement('div');h.className='sr100-page-title';h.innerHTML='<div><h1>Decks</h1><p class="muted">Craft your strategy • 30 cards • one faction</p></div>';v.insertBefore(h,v.firstChild)}
  function decoratePlay(){const v=$('view-play');if(!v||v.querySelector('.sr100-page-title'))return;const h=document.createElement('div');h.className='sr100-page-title';h.innerHTML='<div><h1>Battle</h1><p class="muted">Practice, adventure, and future online modes</p></div>';v.insertBefore(h,v.firstChild)}
  function post(){patchNav();updateHud();const v=active();document.body.dataset.view=v;if(v==='adventure')decorateAdventure();if(v==='collection')decorateCollection();if(v==='decks')decorateDecks();if(v==='play')decoratePlay();go(document)}

  window.addEventListener('message',e=>{if(e.data&&e.data.type==='sr-close-battle'){document.getElementById('battleModal')?.classList.remove('show');const fr=document.getElementById('battleFrame');if(fr)fr.src='about:blank'}});

  window.addEventListener('load',()=>{
    document.documentElement.classList.add('sr100');document.body.classList.add('sr100-body');patchNav();
    const baseHome=window.renderHome,baseAdv=window.renderAdventure,baseEnc=window.renderEncounter,baseCol=window.renderCollection,baseDetail=window.renderDetail,baseDeck=window.renderDeckBuilder,basePlay=window.renderPlay,baseNav=window.nav,baseCurrency=window.renderCurrencies;
    window.renderHome=function(){renderHome100();post()};
    window.renderAdventure=function(){baseAdv?.();setTimeout(post,0)};
    window.renderEncounter=function(n){renderEncounter100(n);post()};
    window.renderCollection=function(){baseCol?.();setTimeout(post,0)};
    window.renderDetail=function(){baseDetail?.();setTimeout(decorateDetail,0)};
    window.renderDeckBuilder=function(){baseDeck?.();setTimeout(post,0)};
    window.renderPlay=function(){basePlay?.();setTimeout(post,0)};
    window.renderCurrencies=function(){baseCurrency?.();setTimeout(updateHud,0)};
    window.nav=function(v){baseNav?.(v);setTimeout(post,0)};
    try{window.renderAll?.()}catch{};post();
  });
})();
