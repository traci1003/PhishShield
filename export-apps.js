// Script to export PhishShield AI to multiple platforms
const { execSync } = require('child_process');

console.log('PhishShield AI Export Tool');
console.log('=========================');

// Build the web app
console.log('\n📦 Building the web app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web app built successfully!');
} catch (error) {
  console.error('❌ Failed to build web app:', error.message);
  process.exit(1);
}

// Initialize Capacitor
console.log('\n🚀 Initializing Capacitor for mobile platforms...');
try {
  execSync('npx cap init PhishShieldAI com.phishshield.app', { stdio: 'inherit' });
  console.log('✅ Capacitor initialized!');
} catch (error) {
  console.log('⚠️ Capacitor may already be initialized:', error.message);
}

// Add iOS platform
console.log('\n📱 Adding iOS platform...');
try {
  execSync('npx cap add ios', { stdio: 'inherit' });
  console.log('✅ iOS platform added!');
} catch (error) {
  console.log('⚠️ iOS platform may already exist:', error.message);
}

// Add Android platform
console.log('\n🤖 Adding Android platform...');
try {
  execSync('npx cap add android', { stdio: 'inherit' });
  console.log('✅ Android platform added!');
} catch (error) {
  console.log('⚠️ Android platform may already exist:', error.message);
}

// Sync the web code to native projects
console.log('\n🔄 Syncing web code to native projects...');
try {
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Sync completed successfully!');
} catch (error) {
  console.error('❌ Failed to sync:', error.message);
  process.exit(1);
}

console.log('\n🎉 Export complete! Your app is now ready for multiple platforms:');
console.log('   - Web: The app is built in the "dist" directory');
console.log('   - iOS: Run "npx cap open ios" to open in Xcode');
console.log('   - Android: Run "npx cap open android" to open in Android Studio');
console.log('\nThank you for using PhishShield AI!');