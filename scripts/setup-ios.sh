#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Shattered Realms Mobile Alpha v0.8.0 ==="
command -v node >/dev/null || { echo "Node.js is required. Install current LTS first."; exit 1; }
command -v npm >/dev/null || { echo "npm is required."; exit 1; }
command -v xcodebuild >/dev/null || { echo "Xcode is required on macOS."; exit 1; }

echo "1/4 Installing Capacitor dependencies..."
npm install

if [ ! -d ios ]; then
  echo "2/4 Creating iOS native project..."
  npx cap add ios
else
  echo "2/4 iOS project already exists."
fi

echo "3/4 Syncing web assets into iOS..."
npx cap sync ios

# Give the generated native target a sensible minimum deployment version if possible.
PBX="ios/App/App.xcodeproj/project.pbxproj"
if [ -f "$PBX" ]; then
  perl -0pi -e 's/IPHONEOS_DEPLOYMENT_TARGET = [0-9.]+;/IPHONEOS_DEPLOYMENT_TARGET = 17.0;/g' "$PBX" || true
fi

echo "4/4 Opening Xcode..."
npx cap open ios

echo ""
echo "In Xcode: select App target > Signing & Capabilities > choose your Apple team, connect your iPhone, choose it as the run destination, then press Run."
