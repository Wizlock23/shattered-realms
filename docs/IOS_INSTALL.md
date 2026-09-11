# Install on an iPhone — v0.8.0

## You need

- A Mac that can run a current supported Xcode.
- Xcode installed from Apple.
- An iPhone and USB cable (wireless deployment can be enabled later).
- An Apple ID. A paid Apple Developer Program membership is needed for TestFlight/App Store distribution; local development can begin before public distribution.
- Node.js + npm.

## One-command setup

From Terminal in this project folder:

```bash
npm run ios:setup
```

Or double-click `Setup Shattered Realms iOS.command`.

## Xcode steps

1. Wait for Xcode to open `ios/App/App.xcworkspace`.
2. Select the **App** project, then the **App** target.
3. Under **Signing & Capabilities**, select your Team.
4. Keep the bundle identifier unique. The project starts with `com.shatteredrealms.game`; change it before distribution if needed.
5. Connect your iPhone and trust the Mac if prompted.
6. Select your iPhone in the run-destination menu.
7. Press the ▶ Run button.
8. If iOS asks to enable Developer Mode, follow the device prompt and reboot as requested.

## Updating the app after web changes

```bash
npm run ios:sync
npm run ios:open
```

Then rebuild/run from Xcode.

## TestFlight later

Once the build is stable on-device, enroll in the Apple Developer Program, create the app record in App Store Connect, set signing to your distribution team, Archive in Xcode, and upload the archive for TestFlight.
