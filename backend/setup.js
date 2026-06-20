#!/usr/bin/env node
/**
 * Setup script for backend deployment
 * Handles Prisma client generation with correct schema path
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  const backendDir = __dirname;
  const rootDir = path.join(backendDir, '..');
  const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
  
  console.log('🔧 Backend Setup');
  console.log('Root directory:', rootDir);
  console.log('Schema path:', schemaPath);
  
  if (fs.existsSync(schemaPath)) {
    console.log('✅ Schema found at', schemaPath);
    console.log('📦 Generating Prisma client...');
    
    execSync(`prisma generate --schema="${schemaPath}"`, {
      stdio: 'inherit',
      cwd: backendDir,
      env: { ...process.env, PRISMA_SCHEMA_PATH: schemaPath }
    });
    
    console.log('✅ Prisma client generated successfully');
  } else {
    console.log('⚠️  Schema not found at', schemaPath);
    console.log('   Backend can still run with pre-built Prisma client');
  }
  
  process.exit(0);
} catch (error) {
  console.error('⚠️  Setup warning (not fatal):', error.message);
  // Don't exit with error - let build continue
  process.exit(0);
}
