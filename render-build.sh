#!/bin/bash
set -e

echo "� Installing root dependencies..."
npm ci

echo "📦 Installing backend dependencies..."
cd backend
npm ci
cd ..

echo "🚀 Generating Prisma client..."
npx prisma generate --schema ./prisma/schema.prisma

echo "✅ Build complete!"
