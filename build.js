#!/usr/bin/env node

/**
 * Build script for Render deployment
 * Handles Prisma client generation at the root level for monorepo structure
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Starting build process...\n');

try {
  // Step 1: Install root dependencies
  console.log('📦 Step 1: Installing root dependencies...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Root dependencies installed\n');

  // Step 2: Generate Prisma client at root level
  console.log('🔧 Step 2: Generating Prisma client...');
  execSync('npx prisma generate --schema ./prisma/schema.prisma', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Prisma client generated\n');

  // Step 3: Install backend dependencies
  console.log('📦 Step 3: Installing backend dependencies...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'backend')
  });
  console.log('✅ Backend dependencies installed\n');

  // Step 4: Install frontend dependencies
  console.log('📦 Step 4: Installing frontend dependencies...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'frontend')
  });
  console.log('✅ Frontend dependencies installed\n');

  console.log('🎉 Build complete!\n');
  process.exit(0);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
