/* Shattered Realms v0.13.0 — post-match progression and retention loop */
(()=>{
  const $=id=>document.getElementById(id);
  const handledMatchIds=new Set();
  function trustedBattleMessage(e){const fr=$('battleFrame');if(!e?.data||e.data.type!=='sr-match-result'||!fr?.contentWindow||e.source!==fr.contentWindow)return false;const own=location.origin;if(own&&own!=='null'&&e.origin&&e.origin!==own)return false;return true}
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function rewardQuest(q){
    if(!q||q.claimed||q.p<q.max)return null;
    q.claimed=true;
    if(q.id==='matches'){S.gold+=150;return 'Quest complete • +150 Gold'}
    if(q.id==='ascend'){S.packs+=1;return 'Quest complete • +1 Aether Cache'}
    if(q.id==='tactics'){S.dust+=80;return 'Quest complete • +80 Shard Dust'}
    return 'Quest complete';
  }
  function updateQuest(id,amount){const q=(S.quests||[]).find(x=>x.id===id);if(!q)return null;q.p=Math.min(q.max,(q.p||0)+Math.max(0,amount||0));return rewardQuest(q)}
  function ensureModal(){
    let modal=$('engagementResultModal');if(modal)return modal;
    modal=document.createElement('div');modal.id='engagementResultModal';modal.className='modal sr13-result-modal';modal.innerHTML=`<div class="modal-card sr13-result-card"><div class="sr13-result-glow"></div><div class="small gold" id="sr13ResultKicker">MATCH COMPLETE</div><h1 id="sr13ResultTitle">Victory</h1><div class="sr13-result-sub" id="sr13ResultSub"></div><div class="sr13-match-stats" id="sr13MatchStats"></div><div class="sr13-progress-stack" id="sr13ProgressStack"></div><div class="sr13-reward-box"><div class="small gold">MATCH PROGRESS</div><div class="rewardline" id="sr13RewardLine"></div></div><div class="sr13-result-actions"><button class="btn" id="sr13EditDeck">Edit Deck</button><button class="btn" id="sr13Continue">Continue</button><button class="btn primary" id="sr13Replay">Play Again</button></div></div>`;document.body.appendChild(modal);
    $('sr13Continue').onclick=()=>{modal.classList.remove('show');try{nav('play')}catch{}};
    $('sr13EditDeck').onclick=()=>{modal.classList.remove('show');try{nav('decks')}catch{}};
    $('sr13Replay').onclick=()=>{modal.classList.remove('show');setTimeout(()=>$('launchBattle')?.click(),100)};
    return modal;
  }
  function closeBattle(){if(typeof closeBattleModal==='function'){closeBattleModal();return}const m=$('battleModal');if(m)m.classList.remove('show');const fr=$('battleFrame');if(fr){fr.onload=null;fr.src='about:blank'}}
  function progressRow(label,value,max,caption){const pct=Math.max(0,Math.min(100,max?value/max*100:0));return `<div class="sr13-progress-row"><div><b>${esc(label)}</b><span>${esc(caption)}</span></div><div class="bar"><span style="width:${pct}%"></span></div></div>`}
  function showPracticeResult(m,rewards,xpGain){
    const modal=ensureModal();closeBattle();
    $('sr13ResultKicker').textContent=m.won?'MATCH WON':'MATCH COMPLETE';$('sr13ResultTitle').textContent=m.won?'Victory':'Defeat';$('sr13ResultSub').textContent=m.won?'Your deck held the field. Progress earned.':'Every battle still advances your account and faction.';
    $('sr13MatchStats').innerHTML=`<span>Round <b>${m.round}</b></span><span>Leader HP <b>${m.playerHp}</b></span><span>Ascensions <b>${(m.ascensions||0)+(m.leaderAscensions||0)}</b></span><span>Tactics <b>${m.tactics||0}</b></span>`;
    const xp=S.accountXp||0,xpIn=xp%100,mastery=S.mastery?.[m.playerFaction]||0;
    $('sr13ProgressStack').innerHTML=progressRow(`Account XP`,xpIn,100,`+${xpGain} XP • Level progress`)+progressRow(`${m.playerFaction} Mastery`,mastery%1,1,`Mastery Lv. ${Math.floor(mastery)+1}`);
    $('sr13RewardLine').innerHTML=rewards.map(x=>`<span class="rewardpill">${esc(x)}</span>`).join('')||'<span class="rewardpill">Progress recorded</span>';
    modal.classList.toggle('loss',!m.won);modal.classList.add('show');try{window.SRAudio?.play('reward')}catch{}
  }
  function applyResult(m){
    const key=m.matchId||[m.mode,m.encounterId,m.won,m.round,m.playerHp,m.enemyHp].join('|');if(handledMatchIds.has(key)||(typeof hasProcessedResult==='function'&&hasProcessedResult('match',key)))return;handledMatchIds.add(key);if(typeof markProcessedResult==='function')markProcessedResult('match',key);
    S.accountXp=Number(S.accountXp||0);S.totalMatches=Number(S.totalMatches||0)+1;S.wins=Number(S.wins||0)+(m.won?1:0);S.winStreak=m.won?Number(S.winStreak||0)+1:0;
    const xpGain=m.won?40:25;S.accountXp+=xpGain;
    const rewards=[`+${xpGain} Account XP`];
    const q1=updateQuest('matches',1);if(q1)rewards.push(q1);const q2=updateQuest('tactics',m.tactics||0);if(q2)rewards.push(q2);const q3=updateQuest('ascend',(m.ascensions||0)+(m.leaderAscensions||0));if(q3)rewards.push(q3);
    if(m.mode==='practice'){
      const gold=m.won?45:20;S.gold+=gold;rewards.unshift(`+${gold} Gold`);S.mastery[m.playerFaction]=(S.mastery[m.playerFaction]||0)+(m.won ? .18 : .10);
      if(m.won&&S.winStreak>0&&S.winStreak%3===0){S.gold+=25;rewards.push('3-win Shard Streak • +25 Gold')}
    }
    save();try{renderCurrencies();renderHome();renderRewards()}catch{}
    if(m.mode==='practice')showPracticeResult(m,rewards,xpGain);else setTimeout(()=>{const b=$('resultBonus');if(b){const line=`Account progress: +${xpGain} XP${rewards.filter(x=>x.startsWith('Quest')).length?' • '+rewards.filter(x=>x.startsWith('Quest')).join(' • '):''}`;b.textContent=b.textContent?`${b.textContent} • ${line}`:line}},120);
  }
  window.addEventListener('message',e=>{if(!trustedBattleMessage(e))return;applyResult(e.data)});
  window.addEventListener('load',()=>{ensureModal();document.documentElement.dataset.engagement='v0130'});
})();
