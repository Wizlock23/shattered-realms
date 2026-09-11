const APP_VERSION='0.16.6';
const CACHE_NAME='shattered-realms-v0.16.6';
const CORE = [
  './','./index.html','./build.json','./manifest.webmanifest','./battle/index.html','./battle/index-v0166.html',
  './css/app-v0166.css','./css/battle-v0166.css',
  './js/sound.js','./js/pwa-install.js','./js/pwa-install-v0166.js','./js/mobile-shell.js','./js/game-data-v0133.js','./js/app.js','./js/ui-v0120.js','./js/engagement-v0130.js','./js/battle-core-v0166.js','./js/battle-v0166.js','./js/battle-engagement-v0130.js',
  './assets/ui/reference-v0120/adventure-tile.png','./assets/ui/reference-v0120/collection-tile.png','./assets/ui/reference-v0120/decks-tile.png','./assets/ui/reference-v0120/play-tile.png','./assets/ui/reference-v0120/featured-event.png',
  './icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png',
  './assets/ui/home-hero-target-v094.jpg','./assets/ui/eryndor-map-concept-v092.jpg','./assets/ui/battle-arena-v0163.jpg',
  './assets/ui/arena-alfar-v0166-a.jpg','./assets/ui/arena-alfar-v0166-b.jpg','./assets/ui/arena-dwarves-v0166-a.jpg','./assets/ui/arena-dwarves-v0166-b.jpg','./assets/ui/arena-mercians-v0166-a.jpg','./assets/ui/arena-mercians-v0166-b.jpg','./assets/ui/arena-mahirim-v0166-a.jpg','./assets/ui/arena-mahirim-v0166-b.jpg','./assets/ui/arena-mirdain-v0166-a.jpg','./assets/ui/arena-mirdain-v0166-b.jpg','./assets/ui/arena-orks-v0166-a.jpg','./assets/ui/arena-orks-v0166-b.jpg','./assets/ui/arena-boss-v0166-a.jpg','./assets/ui/arena-boss-v0166-b.jpg',
  './assets/ui/collection-hero-v091.jpg','./assets/ui/decks-hero-v091.jpg','./assets/ui/play-hero-v091.jpg','./assets/ui/eryndor-hero-v091.jpg',
  './assets/intro/eryndor.webp','./assets/intro/worldshard.webp','./assets/intro/alfar.webp','./assets/worldshard-behemoth.png',
  './assets/leaders/alfar.webp','./assets/leaders/dwarves.webp','./assets/leaders/mercians.webp','./assets/leaders/mahirim.webp','./assets/leaders/mirdain.webp','./assets/leaders/orks.webp'
];

async function freshFetch(input){
  return fetch(input,{cache:'no-store'});
}
async function cacheResponse(req,res){
  if(res&&res.ok){const cache=await caches.open(CACHE_NAME);await cache.put(req,res.clone());}
  return res;
}
async function precacheFresh(url){
  try{const req=new Request(url,{cache:'reload'});const res=await fetch(req);if(res.ok){const cache=await caches.open(CACHE_NAME);await cache.put(url,res.clone());}}
  catch(e){console.warn('PWA cache skip',url,e);}
}

self.addEventListener('install', event => {
  event.waitUntil((async()=>{await Promise.all(CORE.map(precacheFresh));await self.skipWaiting();})());
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('shattered-realms-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients) client.postMessage({type:'SR_UPDATE_READY',version:APP_VERSION});
  })());
});

self.addEventListener('message', event => {
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
  if(event.data?.type==='CLEAR_OLD_CACHES') event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});

async function networkFirstFresh(req,fallback){
  try{return await cacheResponse(req,await freshFetch(req));}
  catch{
    return (await caches.match(req)) || (fallback?await caches.match(fallback):null) || new Response('Shattered Realms is offline and this asset was not cached yet.',{status:503,headers:{'Content-Type':'text/plain'}});
  }
}

self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  const isCode=/\.(?:js|css|html|json|webmanifest)$/.test(url.pathname);

  if(req.mode==='navigate'){
    const fallback=url.pathname.includes('/battle/')?'./battle/index-v0166.html':'./index.html';
    event.respondWith(networkFirstFresh(req,fallback));
    return;
  }
  if(isCode){event.respondWith(networkFirstFresh(req));return;}

  event.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached){event.waitUntil(fetch(req,{cache:'no-cache'}).then(res=>cacheResponse(req,res)).catch(()=>{}));return cached;}
    try{return await cacheResponse(req,await fetch(req,{cache:'no-cache'}));}
    catch{return new Response('Shattered Realms is offline and this asset was not cached yet.',{status:503,headers:{'Content-Type':'text/plain'}});}
  })());
});
