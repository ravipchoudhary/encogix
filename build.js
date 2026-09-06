#!/usr/bin/env node

/** Install dependencies for the root project deployment. */

const { execSync } = require('child_process');

console.log('🔨 Starting build process...\n');

try {
  // Step 1: Install root dependencies
  console.log('📦 Step 1: Installing root dependencies...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Root dependencies installed\n');
  console.log('🎉 Root project dependencies are ready.\n');
  process.exit(0);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
