#!/bin/bash

# Build the app
echo "Building the web app..."
npm run build

# Initialize Capacitor if not already done
if [ ! -d "ios" ] && [ ! -d "android" ]; then
  echo "Initializing Capacitor..."
  npx cap init PhishShieldAI com.phishshield.app
fi

# Add platforms if they don't exist
if [ ! -d "ios" ]; then
  echo "Adding iOS platform..."
  npx cap add ios
fi

if [ ! -d "android" ]; then
  echo "Adding Android platform..."
  npx cap add android
fi

# Sync the web code to the native projects
echo "Syncing web code to native projects..."
npx cap sync

echo "Export complete! You can now open the native projects:"
echo "For iOS: npx cap open ios"
echo "For Android: npx cap open android"
echo "The web app is already built in the 'dist' directory."