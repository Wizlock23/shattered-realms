# Shattered Realms v0.8.1 — Windows + iPhone PWA

## Goal
Run and install the current game on iPhone without owning a Mac. This is a web-app install, not an App Store build.

## Local Windows preview
1. Double-click **Start PWA Preview.bat**.
2. Your browser opens `http://localhost:8080`.
3. Use this to validate Collection, Deck Builder, Adventure, battle handoff, and save persistence.

> Your iPhone cannot normally use your Windows `localhost`. For iPhone installation, publish the `www/` folder over HTTPS. The included GitHub Pages workflow is the easiest alpha route.

## GitHub Pages deployment
1. Install **Git for Windows** and create a free GitHub account.
2. Create a new empty GitHub repository (for example `shattered-realms-alpha`).
3. In this project folder, run **Initialize GitHub Repo.ps1** from PowerShell.
4. Add the GitHub remote and push using the commands printed by the script.
5. In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
6. Open the **Actions** tab and wait for `Deploy Shattered Realms PWA` to finish.
7. GitHub Pages gives you an HTTPS URL. Open that URL in Safari on your iPhone.

## Install on iPhone
1. Open the GitHub Pages URL in **Safari**.
2. Tap **Share**.
3. Choose **Add to Home Screen**.
4. Confirm the Shattered Realms name/icon.
5. Launch it from the Home Screen.

The installed PWA uses `display: standalone`, preserves the same LocalStorage save, and caches the app shell/battle assets for offline relaunch after they have been loaded once.

## Updating the phone build
Push changes to `main`. GitHub Actions redeploys. The service worker uses a versioned cache; update `CACHE_NAME` whenever shipping a PWA release.

## Alpha limitation
This is still a local-save game. Gold, Shard Dust, collection and progress are not server-authoritative and therefore are not suitable for real-money purchases or competitive multiplayer yet.
