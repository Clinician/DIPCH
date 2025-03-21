# iOS Export Guide for Implant Pass App

## Prerequisites

- macOS computer
- Xcode 14 or later installed
- Apple Developer account
- Node.js and npm installed

## Step 1: Build the Web App

```bash
# Install dependencies if not already done
npm install

# Build the production version of the web app
npm run build
```

## Step 2: Initialize Capacitor iOS Project

```bash
# Add iOS platform
npx cap add ios

# Copy web assets to native project
npx cap copy ios

# Update native plugins
npx cap update ios
```

## Step 3: Open the iOS Project in Xcode

```bash
npx cap open ios
```

## Step 4: Configure iOS Project in Xcode

1. In Xcode, select the project in the Project Navigator (left sidebar)
2. Select the "Implant Pass" target
3. Go to the "Signing & Capabilities" tab
4. Sign in with your Apple Developer account
5. Select your Team
6. Update the Bundle Identifier if needed (should match the appId in capacitor.config.ts)
7. Configure app capabilities:
   - Add "Face ID Usage Description" in Info.plist: "Implant Pass uses Face ID to securely access your implant data"
   - Add "Camera Usage Description" in Info.plist: "Implant Pass uses the camera to scan QR codes for implant data"

## Step 5: Configure App Icons and Launch Screen

1. In Xcode, open Assets.xcassets
2. Replace the AppIcon with your app icon (use the provided Swiss cross logo)
3. Configure the Launch Screen in LaunchScreen.storyboard

## Step 6: Build and Archive for App Store

1. In Xcode, select "Any iOS Device (arm64)" as the build target
2. Go to Product > Archive
3. When the archive is complete, the Organizer window will appear
4. Click "Distribute App"
5. Select "App Store Connect" and click "Next"
6. Select "Upload" and click "Next"
7. Select options for distribution and click "Next"
8. Review the settings and click "Upload"

## Step 7: Submit to App Store

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to "My Apps" and select your app
3. Create a new version if needed
4. Complete all required information:
   - App description
   - Screenshots
   - Privacy policy URL
   - App Review Information
   - Version information
5. Submit for review

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all dependencies are installed and compatible with iOS
2. **Signing Issues**: Verify your Apple Developer account and provisioning profiles
3. **Capacitor Plugin Issues**: Check for plugin compatibility and update if needed

### Updating the App

When making changes to the web app:

1. Run `npm run build` to rebuild the web app
2. Run `npx cap copy ios` to update the iOS project
3. Open Xcode with `npx cap open ios` and rebuild

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
