/* Shattered Realms v0.13.0 — engagement presentation helpers */
(()=>{
  function addTurnClass(){const label=document.getElementById('turnLabel');if(!label)return;document.body.classList.toggle('sr-player-turn',/your turn/i.test(label.textContent));document.body.classList.toggle('sr-enemy-turn',/enemy turn/i.test(label.textContent))}
  window.addEventListener('load',()=>{
    document.documentElement.dataset.engagement='v0130';
    const label=document.getElementById('turnLabel');if(label)new MutationObserver(addTurnClass).observe(label,{childList:true,subtree:true,characterData:true});
    addTurnClass();
  });
})();
