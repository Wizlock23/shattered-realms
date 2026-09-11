(() => {
  const BUILD = '0.13.4';
  const SW_URL = `./service-worker.js?v=${BUILD.replace(/\./g,'')}`;
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true || document.body.classList.contains('sr-native');
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferredPrompt = null;

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

  async function refreshRegistration(reg){
    try { await reg.update(); } catch {}
    if (reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING', build:BUILD});
  }

  function installUpdateHooks(reg){
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker) return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed' && navigator.serviceWorker.controller){
          worker.postMessage?.({type:'SKIP_WAITING', build:BUILD});
        }
      });
    });
    const update=()=>refreshRegistration(reg);
    window.addEventListener('pageshow', update);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible') update(); });
  }

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; addBanner(); });
  window.addEventListener('appinstalled', () => { document.getElementById('srPwaBanner')?.remove(); });

  window.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      let refreshing=false;
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(refreshing) return;
        refreshing=true;
        const key=`sr_sw_reloaded_${BUILD}`;
        if(sessionStorage.getItem(key)!=='1'){
          sessionStorage.setItem(key,'1');
          location.reload();
        }
      });
      navigator.serviceWorker.register(SW_URL,{updateViaCache:'none'}).then(reg=>{
        installUpdateHooks(reg);
        refreshRegistration(reg);
      }).catch(err=>console.warn('Service worker registration failed',err));
    }
    if (isIOS) setTimeout(addBanner, 900);
  });
})();
