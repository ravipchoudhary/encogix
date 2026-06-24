#!/bin/bash
set -e

echo "🔧 Starting Render build process..."

# Step 1: Install root dependencies
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps

# Step 2: Generate Prisma client at root level
echo "🚀 Generating Prisma client..."
npx prisma generate --schema ./prisma/schema.prisma

# Verify generation
if [ -d ".prisma/client" ]; then
  echo "✅ Prisma client generated successfully at .prisma/client"
else
  echo "❌ ERROR: .prisma/client not found!"
  exit 1
fi

# Step 3: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
if [ ! -d "node_modules" ]; then
  echo "❌ ERROR: Backend node_modules not created!"
  exit 1
fi
echo "✅ Backend dependencies installed"
cd ..

# Step 4: Verify critical dependencies
echo "🔍 Verifying critical dependencies..."
if [ ! -f "backend/node_modules/jsonwebtoken/package.json" ]; then
  echo "❌ ERROR: jsonwebtoken not found in backend/node_modules!"
  exit 1
fi
echo "✅ jsonwebtoken verified"

echo "✅ Build complete!"
