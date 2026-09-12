const APP_VERSION='0.17.2';
const CACHE_NAME='shattered-realms-v0.17.2';
const CRITICAL=[
  './','./index.html','./build.json','./manifest.webmanifest','./battle/index.html','./battle/index-v0172.html',
  './css/app-v0166.css','./js/app.js','./js/mobile-shell.js','./js/pwa-install-v0172.js','./js/game-data-v0133.js'
];
const OPTIONAL=[
  './js/sound.js','./js/battle-engagement-v0130.js',
  './assets/ui/battle-bg-v0165-1.jpg','./assets/ui/battle-bg-v0165-2.jpg','./assets/ui/battle-bg-v0165-3.jpg','./assets/ui/battle-bg-v0165-4.jpg',
  './assets/ui/battle-arena-alfar-v0168.jpg','./assets/ui/battle-arena-dwarves-v0168.jpg','./assets/ui/battle-arena-mahirim-v0168.jpg','./assets/ui/battle-arena-mercians-v0168.jpg','./assets/ui/battle-arena-mirdain-v0168.jpg','./assets/ui/battle-arena-orks-v0168.jpg','./assets/ui/battle-arena-worldshard-v0168.jpg',
  './assets/leaders/alfar.webp','./assets/leaders/dwarves.webp','./assets/leaders/mercians.webp','./assets/leaders/mahirim.webp','./assets/leaders/mirdain.webp','./assets/leaders/orks.webp',
  './icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'
];
async function fetchFresh(url){const req=new Request(url,{cache:'reload'});const res=await fetch(req);if(!res.ok)throw new Error(`${url} ${res.status}`);return res;}
async function cacheOne(cache,url,required=false){try{const res=await fetchFresh(url);await cache.put(url,res.clone());return true}catch(e){console.warn('cache skip',url,e);if(required)throw e;return false}}
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);for(const url of CRITICAL)await cacheOne(cache,url,true);await Promise.allSettled(OPTIONAL.map(url=>cacheOne(cache,url,false)));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('shattered-realms-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of clients)client.postMessage({type:'SR_UPDATE_READY',version:APP_VERSION})})())});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
async function networkFirst(req,fallback){try{const res=await fetch(req,{cache:'no-store'});if(res.ok){const cache=await caches.open(CACHE_NAME);await cache.put(req,res.clone());return res}throw new Error(String(res.status))}catch{return (await caches.match(req))||(fallback?await caches.match(fallback):null)||new Response('Offline',{status:503})}}
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;if(req.mode==='navigate'){event.respondWith(networkFirst(req,url.pathname.includes('/battle/')?'./battle/index-v0172.html':'./index.html'));return}if(/\.(?:js|css|html|json|webmanifest)$/.test(url.pathname)){event.respondWith(networkFirst(req));return}event.respondWith((async()=>{const cached=await caches.match(req);if(cached){event.waitUntil(fetch(req,{cache:'no-cache'}).then(async r=>{if(r.ok){const c=await caches.open(CACHE_NAME);await c.put(req,r.clone())}}).catch(()=>{}));return cached}try{return await fetch(req,{cache:'no-cache'})}catch{return new Response('',{status:503})}})())});
