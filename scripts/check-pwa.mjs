import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..','www');
const required=['index.html','manifest.webmanifest','service-worker.js','js/app.js','js/mobile-shell.js','js/pwa-install.js','battle/index.html','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
let ok=true;
for (const f of required){ if(!fs.existsSync(path.join(root,f))){ console.error(`Missing ${f}`); ok=false; } }
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const marker of ['manifest.webmanifest','pwa-install.js','apple-touch-icon.png']) if(!html.includes(marker)){console.error(`index.html missing ${marker}`);ok=false;}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
if(manifest.display!=='standalone') {console.error('Manifest display must be standalone');ok=false;}
console.log(ok?'PWA structure OK':'PWA structure FAILED'); process.exit(ok?0:1);
