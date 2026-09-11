# App Store / TestFlight Readiness Roadmap

## Mobile Alpha — current v0.8
- [x] Native-shell project structure
- [x] Packaged/offline app assets
- [x] iPhone safe-area/mobile navigation pass
- [x] Persistent local prototype save
- [x] Packaged battle-engine handoff
- [ ] Real-device performance pass
- [ ] Final app icon + launch treatment
- [ ] Accessibility pass (Dynamic Type/VoiceOver/contrast/touch targets)

## TestFlight Alpha
- [ ] Apple Developer Program account
- [ ] Final bundle ID and signing
- [ ] Privacy policy URL + support URL
- [ ] App Store Connect app record
- [ ] Crash reporting
- [ ] Analytics with explicit privacy inventory
- [ ] Cloud account/save architecture
- [ ] Tester feedback flow
- [ ] Real device matrix (small/large iPhones, older supported device)

## Production gameplay architecture
- [ ] Server-authoritative inventory / Gold / Shard Dust
- [ ] Account authentication + account deletion
- [ ] Content/card versioning
- [ ] Server-validated pack opening and crafting
- [ ] Secure deck validation
- [ ] Matchmaking / PvP backend
- [ ] Anti-cheat / replay telemetry

## Monetization
- [ ] Economy balance model
- [ ] StoreKit / Apple In-App Purchase
- [ ] Server-side purchase verification
- [ ] Restore purchases
- [ ] Pack odds disclosure before randomized paid pack purchases
- [ ] Parental / age-rating review of monetization design

## Submission
- [ ] Age-rating questionnaire
- [ ] App Privacy answers
- [ ] Screenshots / metadata / description
- [ ] Review notes and demo account if backend requires login
- [ ] TestFlight beta exit criteria
- [ ] Archive and submit through App Store Connect

### Current Apple build floor
As of September 2026, App Store Connect requires iOS apps to be built with Xcode 26 or later using the iOS 26 SDK or later. Xcode 27 is available in release-candidate form, but using a stable supported Xcode for the first device alpha is reasonable; re-check Apple's current upload requirements immediately before submission.
