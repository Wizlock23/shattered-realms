const CACHE_NAME='shattered-realms-v0.14.0';
const CORE = [
  './','./index.html','./manifest.webmanifest','./battle/index.html','./battle/index-v0140.html',
  './css/app-v0136.css','./css/battle-v0140.css',
  './js/sound.js','./js/pwa-install.js','./js/mobile-shell.js','./js/game-data-v0133.js','./js/app.js','./js/ui-v0120.js','./js/engagement-v0130.js','./js/battle-core-v0140.js','./js/battle-v0120.js','./js/battle-engagement-v0130.js',
  './assets/ui/reference-v0120/adventure-tile.png','./assets/ui/reference-v0120/collection-tile.png','./assets/ui/reference-v0120/decks-tile.png','./assets/ui/reference-v0120/play-tile.png','./assets/ui/reference-v0120/featured-event.png',
  './icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png',
  './assets/ui/home-hero-target-v094.jpg','./assets/ui/eryndor-map-concept-v092.jpg',
  './assets/ui/collection-hero-v091.jpg','./assets/ui/decks-hero-v091.jpg','./assets/ui/play-hero-v091.jpg','./assets/ui/eryndor-hero-v091.jpg',
  './assets/intro/eryndor.webp','./assets/intro/worldshard.webp','./assets/intro/alfar.webp','./assets/worldshard-behemoth.png',
  './assets/leaders/alfar.webp','./assets/leaders/dwarves.webp','./assets/leaders/mercians.webp','./assets/leaders/mahirim.webp','./assets/leaders/mirdain.webp','./assets/leaders/orks.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE.map(async url => {
      try { await cache.add(url); }
      catch (e) { console.warn('PWA cache skip', url, e); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('shattered-realms-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function cacheFresh(req, res){
  if (res && res.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(req, res.clone());
  }
  return res;
}

async function networkFirst(req, fallback){
  try { return await cacheFresh(req, await fetch(req)); }
  catch { return (await caches.match(req)) || (fallback ? await caches.match(fallback) : null) || new Response('Shattered Realms is offline and this asset was not cached yet.', {status:503, headers:{'Content-Type':'text/plain'}}); }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML/navigation and executable styles/scripts are network-first so a freshly
  // deployed GitHub Pages build cannot remain visually stuck on an older bundle.
  const isCode = /\.(?:js|css|html|webmanifest)$/.test(url.pathname);
  if (req.mode === 'navigate') {
    const fallback = url.pathname.includes('/battle/') ? './battle/index-v0140.html' : './index.html';
    event.respondWith(networkFirst(req, fallback));
    return;
  }
  if (isCode) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Large artwork stays cache-first with background refresh for fast PWA loads.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      event.waitUntil(fetch(req).then(res => cacheFresh(req,res)).catch(()=>{}));
      return cached;
    }
    try { return await cacheFresh(req, await fetch(req)); }
    catch { return new Response('Shattered Realms is offline and this asset was not cached yet.', {status:503, headers:{'Content-Type':'text/plain'}}); }
  })());
});
