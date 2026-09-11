(() => {
  const VERSION = '0.13.5';
  const STATE_KEY = 'sr_v050_state';
  const isCapacitor = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const standaloneMQ = window.matchMedia('(display-mode: standalone)');
  const isIOSStandalone = window.navigator.standalone === true;
  const isStandalone = () => standaloneMQ.matches || isIOSStandalone || isCapacitor;

  document.documentElement.dataset.srVersion = VERSION;

  function syncRuntimeClass(){
    const standalone = isStandalone();
    document.documentElement.classList.toggle('sr-standalone', standalone);
    document.documentElement.classList.toggle('sr-browser', !standalone);
    document.body?.classList.toggle('sr-standalone', standalone);
    document.body?.classList.toggle('sr-native', isCapacitor);
    document.documentElement.dataset.srRuntime = isCapacitor ? 'native' : (standalone ? 'standalone' : 'browser');
  }

  function syncViewport(){
    const vv = window.visualViewport;
    const width = Math.round(vv?.width || window.innerWidth || document.documentElement.clientWidth || 0);
    const height = Math.round(vv?.height || window.innerHeight || document.documentElement.clientHeight || 0);
    document.documentElement.style.setProperty('--sr-app-width', `${width}px`);
    document.documentElement.style.setProperty('--sr-app-height', `${height}px`);
    document.documentElement.style.setProperty('--sr-vh', `${height * 0.01}px`);
    document.documentElement.dataset.srOrientation = width > height ? 'landscape' : 'portrait';
    document.documentElement.dataset.srViewport = `${width}x${height}`;
  }

  function syncRuntime(){ syncRuntimeClass(); syncViewport(); }

  if (standaloneMQ.addEventListener) standaloneMQ.addEventListener('change', syncRuntime);
  else if (standaloneMQ.addListener) standaloneMQ.addListener(syncRuntime);
  window.addEventListener('resize', syncViewport, {passive:true});
  window.addEventListener('orientationchange', () => setTimeout(syncRuntime, 80), {passive:true});
  window.addEventListener('pageshow', () => setTimeout(syncRuntime, 0));
  window.visualViewport?.addEventListener('resize', syncViewport, {passive:true});
  window.visualViewport?.addEventListener('scroll', syncViewport, {passive:true});

  window.addEventListener('DOMContentLoaded', () => {
    syncRuntime();
    const debug = new URLSearchParams(location.search).get('debug') === '1';
    document.body.classList.toggle('sr-debug', debug);
    const badge = document.createElement('div');
    badge.className = 'sr-native-badge';
    badge.textContent = `SR v${VERSION} • ${document.documentElement.dataset.srRuntime} • ${document.documentElement.dataset.srViewport} • local save`;
    document.body.appendChild(badge);
  });

  function currentSave(){
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || 'null'); }
    catch { return null; }
  }
  function exportSave(){
    return JSON.stringify({version: VERSION, exportedAt: new Date().toISOString(), state: currentSave()}, null, 2);
  }
  function importSave(payload){
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
    const state = parsed && parsed.state ? parsed.state : parsed;
    if (!state || typeof state !== 'object') throw new Error('Invalid Shattered Realms save');
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    location.reload();
  }
  function resetSave(){ localStorage.removeItem(STATE_KEY); location.reload(); }
  window.SRMobile = { VERSION, STATE_KEY, isNative:isCapacitor, isStandalone, currentSave, exportSave, importSave, resetSave, syncViewport };

  function storeDiagnostic(kind, detail){
    try { localStorage.setItem('sr_last_error', JSON.stringify({version:VERSION, kind, ...detail, at:new Date().toISOString()})); } catch {}
  }
  window.addEventListener('error', (e) => storeDiagnostic('error',{message:e.message, source:e.filename, line:e.lineno, col:e.colno}));
  window.addEventListener('unhandledrejection', (e) => storeDiagnostic('unhandledrejection',{message:String(e.reason?.message||e.reason||'Unknown promise rejection')}));
})();
