# GitHub Update — Shattered Realms v0.16.1

## Desktop Browser Layout Repair
This update fixes the battle board on wide PC browsers while preserving the v0.16.0 phone/Safari layout.

### Fixes
- dedicated wide-screen battle canvas instead of stretching individual UI elements across the entire monitor
- proper desktop scenic battlefield background
- centered leader HUDs, battlefield rows, hand, turn banner and action controls
- responsive sizing for standard desktop, ultrawide monitors and short laptop browser windows
- new cache-safe v0.16.1 battle document, CSS and JS filenames so PC browsers cannot reuse the broken v0.16.0 layout bundle
- mobile/Safari battle composition remains unchanged

### No gameplay changes
Card stats, card effects, AI, battle rules, decks, saves and progression are unchanged.

### Files
- `www/battle/index.html`
- `www/battle/index-v0161.html`
- `www/css/battle-v0161.css`
- `www/js/app.js`
- `www/js/battle-core-v0161.js`
- `www/js/battle-v0161.js`
- `www/js/mobile-shell.js`
- `www/service-worker.js`
