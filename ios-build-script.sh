#!/bin/bash

# iOS Build Script for Implant Pass
# This script automates the process of building the iOS app for App Store submission

# Exit on error
set -e

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
  echo "Error: This script must be run on macOS"
  exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
  echo "Error: Xcode is not installed"
  exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed"
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed"
  exit 1
fi

# Build the web app
echo "Building web app..."
npm install
npm run build

# Check if Capacitor iOS platform is added
if [ ! -d "ios" ]; then
  echo "Adding iOS platform..."
  npx cap add ios
fi

# Copy web assets to iOS project
echo "Copying web assets to iOS project..."
npx cap copy ios

# Update native plugins
echo "Updating native plugins..."
npx cap update ios

# Build iOS app
echo "Building iOS app..."
cd ios/App

# Clean build directory
xcodebuild clean -workspace App.xcworkspace -scheme App

# Archive the app
echo "Archiving app..."
xcodebuild archive -workspace App.xcworkspace -scheme App -archivePath "./build/ImplantPass.xcarchive"

# Export the archive to IPA
echo "Exporting IPA..."
xcodebuild -exportArchive -archivePath "./build/ImplantPass.xcarchive" -exportOptionsPlist exportOptions.plist -exportPath "./build"

echo "Build completed successfully!"
echo "IPA file is located at: $(pwd)/build/ImplantPass.ipa"
