const CACHE_NAME='shattered-realms-v0.13.2';
const CORE = [
  './','./index.html','./manifest.webmanifest','./battle/index.html',
  './css/app.css','./css/ui-v0120.css','./css/engagement-v0130.css','./css/battle-v0110.css','./css/battle-v0120.css','./css/battle-engagement-v0130.css',
  './js/sound.js','./js/pwa-install.js','./js/mobile-shell.js','./js/app.js','./js/ui-v0120.js','./js/engagement-v0130.js','./js/battle-engagement-v0130.js',
  './assets/ui/reference-v0120/adventure-tile.png', './assets/ui/reference-v0120/collection-tile.png', './assets/ui/reference-v0120/decks-tile.png', './assets/ui/reference-v0120/play-tile.png', './assets/ui/reference-v0120/featured-event.png','./js/battle-v0110.js',
  './icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png',
  './assets/ui/home-hero-target-v094.jpg','./assets/ui/eryndor-map-concept-v092.jpg',
  './assets/ui/collection-hero-v091.jpg','./assets/ui/decks-hero-v091.jpg','./assets/ui/play-hero-v091.jpg','./assets/ui/eryndor-hero-v091.jpg',
  './assets/intro/worldshard.png','./assets/worldshard-behemoth.png',
  './assets/leaders/alfar.webp','./assets/leaders/dwarves.webp','./assets/leaders/mercians.webp','./assets/leaders/mahirim.webp','./assets/leaders/mirdain.webp','./assets/leaders/orks.webp'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE.map(async url => { try { await cache.add(url); } catch (e) { console.warn('PWA cache skip', url, e); } }));
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

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(req)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) {
      event.waitUntil(fetch(req).then(async res => {
        if (res && res.ok) (await caches.open(CACHE_NAME)).put(req, res.clone());
      }).catch(()=>{}));
      return cached;
    }
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) (await caches.open(CACHE_NAME)).put(req, fresh.clone());
      return fresh;
    } catch {
      return new Response('Shattered Realms is offline and this asset was not cached yet.', {status:503, headers:{'Content-Type':'text/plain'}});
    }
  })());
});
