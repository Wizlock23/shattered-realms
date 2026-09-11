/* Shattered Realms v0.12.0 — reference UI shell */
(()=>{
  const $=id=>document.getElementById(id);
  const ICONS={
    home:'<path d="M3 10.5 12 3l9 7.5v10.5h-6v-6H9v6H3z"/>',
    adventure:'<path d="M12 2.5 15 9l6.5 3-6.5 3-3 6.5L9 15l-6.5-3L9 9z"/><circle cx="12" cy="12" r="2"/>',
    collection:'<path d="M5 4h11v15H5z"/><path d="M8 2h11v15"/><path d="M3 7h2v14h11v-2"/>',
    decks:'<path d="M6 3h12v18H6z"/><path d="M9 3V1h6v2M9 8h6M9 12h6M9 16h4"/>',
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
  const svg=n=>`<svg class="sr110-svg" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||ICONS.adventure}</svg>`;
  const leaderArt={Alfar:'assets/leaders/alfar.webp',Dwarves:'assets/leaders/dwarves.webp',Mercians:'assets/leaders/mercians.webp',Mahirim:'assets/leaders/mahirim.webp',Mirdain:'assets/leaders/mirdain.webp',Orks:'assets/leaders/orks.webp'};
  const sigils={All:'✦',Alfar:'✧',Dwarves:'◆',Mercians:'♛',Mahirim:'🐺',Mirdain:'❧',Orks:'☠'};
  const state=()=>{try{return S}catch{return null}};
  const activeView=()=>document.querySelector('.view.active')?.id?.replace('view-','')||'home';
  const viewName=v=>({home:'Home',adventure:'Adventure',collection:'Collection',decks:'Decks',play:'Play',rewards:'Progress',shop:'Store'})[v]||'Shattered Realms';
  const n=v=>Number(v||0).toLocaleString();

  function injectIcons(root=document){root.querySelectorAll('[data-sr110-icon]').forEach(el=>{if(el.dataset.done)return;el.innerHTML=svg(el.dataset.sr110Icon);el.dataset.done='1'})}
  function bindGo(root=document){root.querySelectorAll('[data-go]').forEach(el=>{if(el.dataset.bound110)return;el.addEventListener('click',()=>{try{nav(el.dataset.go)}catch{}});el.dataset.bound110='1'})}
  function syncShell(){
    const s=state(); if(!s)return;
    const view=activeView(); document.body.dataset.sr110View=view;
    const fac=s.starter||'Alfar';
    const avatar=$('sr110Avatar'); if(avatar)avatar.src=leaderArt[fac]||leaderArt.Alfar;
    const player=$('sr110PlayerName'); if(player)player.textContent=s.playerName||'AChambers';
    const mastery=Object.values(s.mastery||{}).reduce((a,b)=>a+(+b||0),0), clears=Object.values(s.adventure?.completed||{}).filter(Boolean).length;
    const accountXp=Number(s.accountXp||0), derivedLvl=Math.round(6+mastery*1.2+clears*.8), lvl=Math.max(7+Math.floor(accountXp/100),derivedLvl), xp=accountXp>0?(accountXp%100):Math.max(20,Math.min(94,Math.round(((mastery*17)+(clears*13))%100||36)));
    if($('sr110Level'))$('sr110Level').textContent=`Lv. ${lvl}`;if($('sr110XpFill'))$('sr110XpFill').style.width=xp+'%';
    if($('sr110GoldMirror'))$('sr110GoldMirror').textContent=n(s.gold);if($('sr110DustMirror'))$('sr110DustMirror').textContent=n(s.dust);
    if($('viewTitle'))$('viewTitle').textContent=viewName(view);
    if($('sr110CollectionCount')){
      try{const unique=allCards.filter(c=>owned(c.id)>0).length;$('sr110CollectionCount').textContent=`${unique} / ${allCards.length}`}catch{}
    }
    renderHomeProgress();
  }
  function renderHomeProgress(){
    const s=state(); if(!s)return;
    const a=typeof ADVENTURE!=='undefined'?ADVENTURE:[];const comp=a.filter(x=>s.adventure?.completed?.[x.id]).length;
    if($('sr110HomeProgress'))$('sr110HomeProgress').textContent=`${comp} / ${a.length||7} paths completed`;
    if($('sr110HomeDiamonds'))$('sr110HomeDiamonds').innerHTML=a.map(x=>`<i class="${s.adventure?.completed?.[x.id]?'on':''}"></i>`).join('');
  }
  function factionTabs(){
    const host=$('collectionFactionTabs'),sel=$('factionFilter');if(!host||!sel)return;
    const names=['All','Alfar','Dwarves','Mercians','Mahirim','Mirdain','Orks'];
    host.innerHTML=names.map(f=>`<button class="${sel.value===f?'active':''}" type="button" data-f="${f}"><span>${sigils[f]}</span><b>${f}</b></button>`).join('');
    host.querySelectorAll('button').forEach(b=>b.onclick=()=>{sel.value=b.dataset.f;sel.dispatchEvent(new Event('change',{bubbles:true}));factionTabs()});
  }
  function decorateCardDetail(){
    const d=$('cardDetail');if(!d||d.querySelector('.sr110-card-arrows'))return;
    const nav=document.createElement('div');nav.className='sr110-card-arrows';nav.innerHTML='<button type="button" data-dir="-1">‹</button><button type="button" data-dir="1">›</button>';d.appendChild(nav);
    nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      const items=[...document.querySelectorAll('#collectionGrid [data-card]')];if(!items.length)return;
      const current=items.findIndex(x=>x.classList.contains('selected')||x.dataset.card===window.selectedCard?.id);
      const index=current<0?0:current;const next=(index+(+b.dataset.dir)+items.length)%items.length;items[next].click();items[next].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    });
  }
  function watchDetail(){const d=$('cardDetail');if(!d)return;new MutationObserver(()=>setTimeout(decorateCardDetail,0)).observe(d,{childList:true});decorateCardDetail()}
  function markSelectedCard(){
    const d=$('cardDetail');if(!d)return;const title=d.querySelector('h2')?.textContent;document.querySelectorAll('#collectionGrid .card').forEach(c=>c.classList.toggle('selected',!!title&&c.querySelector('.card-name')?.textContent===title));
  }
  function watchCollection(){const g=$('collectionGrid');if(g)new MutationObserver(()=>{markSelectedCard();syncShell()}).observe(g,{childList:true,subtree:true});const d=$('cardDetail');if(d)new MutationObserver(markSelectedCard).observe(d,{childList:true,subtree:true})}

  function alignMapHotspots(){
    const nodes=[...document.querySelectorAll('#nodeLayer .adventure-node')];
    const pos=[[13,47],[37,69],[37,34],[53,16],[85,29],[64,55],[88,76]];
    nodes.forEach((el,i)=>{if(!pos[i])return;el.style.left=pos[i][0]+'%';el.style.top=pos[i][1]+'%'});
  }
  function watchAdventure(){const n=$('nodeLayer');if(n)new MutationObserver(()=>setTimeout(alignMapHotspots,0)).observe(n,{childList:true});alignMapHotspots()}
  function filterToggle(){const b=$('sr110FilterButton'),f=document.querySelector('.sr110-hidden-filters');if(!b||!f)return;b.onclick=()=>f.classList.toggle('show')}
  function mail(){const m=$('sr110Mail');if(m)m.onclick=()=>{try{toast('Inbox and social features will arrive in a later online update.')}catch{}}}
  function back(){const b=$('sr110Back');if(b)b.onclick=()=>{try{nav('home')}catch{}}}

  window.addEventListener('load',()=>{
    injectIcons();bindGo();factionTabs();filterToggle();mail();back();watchDetail();watchCollection();watchAdventure();syncShell();
    document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>setTimeout(syncShell,25)));
    document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>setTimeout(syncShell,25)));
    const content=document.querySelector('.sr110-content');if(content)new MutationObserver(()=>setTimeout(syncShell,0)).observe(content,{subtree:true,attributes:true,attributeFilter:['class']});
    const gold=$('goldTop'),dust=$('dustTop');[gold,dust].forEach(el=>el&&new MutationObserver(syncShell).observe(el,{childList:true,characterData:true,subtree:true}));
    setTimeout(()=>{factionTabs();decorateCardDetail();alignMapHotspots();syncShell()},120);
  });
})();
