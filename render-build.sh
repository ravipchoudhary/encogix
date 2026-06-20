#!/bin/bash
set -e

echo "🔧 Starting Render build process..."

# Step 1: Install root dependencies
echo "📦 Installing root dependencies..."
npm install

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
npm install
cd ..

echo "✅ Build complete!"
