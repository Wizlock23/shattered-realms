
/* Shattered Realms v0.9.2 — concept-match interaction layer */
(()=>{
  const $=id=>document.getElementById(id);
  const factions=['All','Alfar','Dwarves','Mercians','Mahirim','Mirdain','Orks'];
  const sigils={All:'✦',Alfar:'✧',Dwarves:'♜',Mercians:'♞',Mahirim:'🐺',Mirdain:'❧',Orks:'☠'};
  function buildFactionTabs(){
    const host=$('collectionFactionTabs'), sel=$('factionFilter');
    if(!host||!sel) return;
    host.innerHTML=factions.map(f=>`<button type="button" class="${sel.value===f?'active':''}" data-faction-tab="${f}"><span>${sigils[f]}</span><b>${f}</b></button>`).join('');
    host.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      sel.value=b.dataset.factionTab;
      sel.dispatchEvent(new Event('change',{bubbles:true}));
      buildFactionTabs();
    });
  }
  function syncTabs(){ buildFactionTabs(); }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-go],#nav button')) setTimeout(syncTabs,30);
  });
  window.addEventListener('load',()=>{
    buildFactionTabs();
    const sel=$('factionFilter'); if(sel) sel.addEventListener('change',buildFactionTabs);
    document.documentElement.classList.add('sr-concept-v092');
  });
})();
