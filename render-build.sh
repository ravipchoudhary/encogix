#!/bin/bash
set -e

echo "🔧 Installing dependencies..."
npm install

echo "🔧 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "🚀 Generating Prisma client..."
npx prisma generate --schema ./prisma/schema.prisma

echo "✅ Build complete!"
