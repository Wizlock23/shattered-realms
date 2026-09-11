(() => {
  const VERSION = '0.8.1';
  const STATE_KEY = 'sr_v050_state'; // intentionally preserved for prototype migration compatibility
  const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  document.documentElement.dataset.srVersion = VERSION;
  window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.toggle('sr-native', isNative);
    const debug = new URLSearchParams(location.search).get('debug') === '1';
    document.body.classList.toggle('sr-debug', debug);
    const badge = document.createElement('div');
    badge.className = 'sr-native-badge';
    badge.textContent = `SR v${VERSION} • ${isNative ? 'native' : 'web'} • local save`;
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
  window.SRMobile = { VERSION, STATE_KEY, isNative, currentSave, exportSave, importSave, resetSave };

  window.addEventListener('error', (e) => {
    try { localStorage.setItem('sr_v080_last_error', JSON.stringify({message:e.message, source:e.filename, line:e.lineno, col:e.colno, at:new Date().toISOString()})); } catch {}
  });
})();
