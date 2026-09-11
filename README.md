# The Shattered Realms — Windows/PWA Alpha v0.8.1

This package is the fastest route from the current prototype to an app-like build on an iPhone when development is being done from Windows.

## Two ways to use it

- **Windows/browser:** double-click `Start PWA Preview.bat`.
- **iPhone install:** deploy `www/` to GitHub Pages, open the HTTPS URL in Safari, then use **Share → Add to Home Screen**.

The same `www/` directory is also the source used by Capacitor for a future signed iOS/TestFlight build.

See `docs/WINDOWS_PWA.md` for exact steps.

## Included
- Campaign Alpha v0.7 gameplay/content
- PWA manifest and icons
- service worker/offline cache
- iPhone install guidance
- Windows local preview script
- GitHub Pages auto-deploy workflow
- LocalStorage save export/import helpers from Mobile Alpha v0.8
- Capacitor 8 configuration retained for the native path

## Security/status
Alpha only. Player inventory/currencies/progression remain local and editable. Do not enable purchases or ranked multiplayer on this storage model.
