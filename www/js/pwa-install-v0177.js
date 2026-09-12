(() => {
  const APP_VERSION='0.18.4';
  const BUILD_URL='./build.json';
  const SW_URL='./service-worker.js';
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true || document.body.classList.contains('sr-native');
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferredPrompt = null;
  let registration = null;
  let reloading = false;
  let lastCheck = 0;

  function addBanner(){
    if (isStandalone() || sessionStorage.getItem('sr_pwa_banner_closed') === '1') return;
    const el=document.createElement('div');
    el.id='srPwaBanner'; el.className='sr-pwa-banner';
    const copy=document.createElement('div');
    copy.innerHTML = isIOS
      ? '<b>Install Shattered Realms</b><span>In Safari: tap Share, then <strong>Add to Home Screen</strong>.</span>'
      : '<b>Install Shattered Realms</b><span>Add the game to your device for a full-screen app experience.</span>';
    const actions=document.createElement('div'); actions.className='sr-pwa-actions';
    if (!isIOS) {
      const install=document.createElement('button'); install.className='btn primary'; install.textContent='Install';
      install.onclick=async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; el.remove(); };
      actions.appendChild(install);
    }
    const close=document.createElement('button'); close.className='btn'; close.textContent='Not now';
    close.onclick=()=>{sessionStorage.setItem('sr_pwa_banner_closed','1');el.remove();}; actions.appendChild(close);
    el.append(copy,actions); document.body.appendChild(el);
  }

  function reloadOnce(reason='update'){
    if(reloading) return;
    const key=`sr_auto_reload_${APP_VERSION}`;
    if(sessionStorage.getItem(key)==='1') return;
    reloading=true;
    sessionStorage.setItem(key,'1');
    console.info('Shattered Realms auto-refresh:',reason);
    location.reload();
  }

  async function remoteBuild(){
    try{
      const res=await fetch(`${BUILD_URL}?t=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
      if(!res.ok) return null;
      return await res.json();
    }catch{return null;}
  }

  async function checkForUpdate(force=false){
    if(!registration) return;
    const now=Date.now();
    if(!force && now-lastCheck<15000) return;
    lastCheck=now;
    const remote=await remoteBuild();
    if(remote?.version && remote.version!==APP_VERSION){
      console.info(`New Shattered Realms build available: ${remote.version}`);
    }
    try{ await registration.update(); }catch{}
    const waiting=registration.waiting;
    if(waiting){ try{ waiting.postMessage({type:'SKIP_WAITING'}); }catch{} }
  }

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; addBanner(); });
  window.addEventListener('appinstalled', () => { const b=document.getElementById('srPwaBanner'); if(b)b.remove(); });

  window.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      const hadController=!!navigator.serviceWorker.controller;
      if(hadController){
        navigator.serviceWorker.addEventListener('controllerchange',()=>reloadOnce('new service worker activated'));
      }
      navigator.serviceWorker.addEventListener('message',e=>{
        if(e.data?.type==='SR_UPDATE_READY' && e.data.version!==APP_VERSION) reloadOnce(`build ${e.data.version}`);
      });
      try{
        registration=await navigator.serviceWorker.register(SW_URL,{updateViaCache:'none'});
        await checkForUpdate(true);
      }catch(err){console.warn('Service worker registration failed',err);}
    }
    if (isIOS) setTimeout(addBanner, 900);
  });

  // From v0.18.4 forward the app checks for a release whenever the user comes
  // back to the tab/app, so normal reopening replaces hard-refresh instructions.
  window.addEventListener('pageshow',()=>checkForUpdate(true));
  window.addEventListener('focus',()=>checkForUpdate(false));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate(true)});
  setInterval(()=>checkForUpdate(false),5*60*1000);
})();
