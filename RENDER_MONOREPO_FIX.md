# Fix for Render Deployment - Monorepo Prisma Dependencies

## Problem

```
Error: Cannot find module '@prisma/client'
Require stack:
  - /opt/render/project/src/lib/prisma.js
  - /opt/render/project/src/backend/server.js
```

## Root Cause

The monorepo structure has:
- Shared `lib/prisma.js` at root level
- Backend code in `backend/server.js`
- Prisma schema at `prisma/schema.prisma`

When Render uses `rootDir: backend`, it:
1. Only installs dependencies in `backend/node_modules`
2. The shared `lib/prisma.js` can't find `@prisma/client` from backend's node_modules
3. Server crashes trying to require Prisma

## Solution Applied

### 1. Updated `render.yaml`
**Removed** `rootDir: backend` - this was preventing root-level dependency installation

**New build strategy:**
```yaml
buildCommand: "npm install && cd backend && npm install && npm run setup"
startCommand: "cd backend && npm start"
```

This ensures:
1. Install root dependencies (`npm install`) - includes `@prisma/client`
2. Install backend dependencies (`cd backend && npm install`)
3. Generate Prisma client (`npm run setup`)
4. Start server (`cd backend && npm start`)

### 2. Updated Root `package.json`
Added Prisma to root level:
```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0"
  },
  "devDependencies": {
    "prisma": "^5.22.0"
  }
}
```

Now when Render runs `npm install` at root:
- ✅ Installs `@prisma/client` in `root/node_modules`
- ✅ Installs `prisma` CLI in `root/node_modules`
- ✅ `lib/prisma.js` can find `@prisma/client`
- ✅ Backend can access shared lib

### 3. Backend `setup.js` (Already Created)
The setup script intelligently:
- Finds Prisma schema at `../prisma/schema.prisma`
- Generates Prisma client
- Logs progress
- Doesn't fail if schema isn't found

---

## How It Now Works

```
Render Build Process:
  ↓
npm install (root level)
  ├─ Installs @prisma/client in root/node_modules
  ├─ Installs prisma CLI
  └─ Installs concurrently
  ↓
cd backend && npm install
  ├─ Installs backend dependencies
  └─ Runs postinstall: node setup.js
  ↓
npm run setup (in backend)
  ├─ Finds ../prisma/schema.prisma ✅
  ├─ Generates Prisma client
  └─ Creates .prisma/client in backend/.prisma
  ↓
cd backend && npm start
  ├─ Requires ../lib/prisma.js
  ├─ lib/prisma.js requires @prisma/client from root/node_modules ✅
  └─ Server starts successfully 🚀
```

---

## Dependency Resolution

**Before (Failed):**
```
backend/server.js
  └─ requires ../lib/prisma.js
      └─ requires @prisma/client
          └─ NOT FOUND (only in backend/node_modules)
```

**After (Works):**
```
backend/server.js
  └─ requires ../lib/prisma.js
      └─ requires @prisma/client
          └─ Found in root/node_modules ✅
```

---

## Deployment Steps

### Step 1: Push Updated Code
```bash
git add render.yaml package.json
git commit -m "Fix: Install Prisma at root level for monorepo"
git push origin main
```

### Step 2: Trigger Render Deploy
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### Step 3: Monitor Build Logs

Watch for:
```
✓ npm install (at root)
  - Installing @prisma/client ✅
  - Installing prisma ✅
  - Installing concurrently ✅

✓ cd backend && npm install
  - Running postinstall: node setup.js

✓ Backend Setup
  - Schema found ✅
  - Prisma client generated ✅

✓ Starting npm start
  - Backend API running ✅
  - Health check working ✅
```

### Step 4: Verify
```bash
# Test health endpoint
curl https://your-backend-name.onrender.com/api/health

# Expected:
# {"ok":true,"database":"connected"}
```

---

## File Changes Summary

### Modified Files:
1. **render.yaml**
   - Removed: `rootDir: backend`
   - Changed: Build command to handle monorepo structure

2. **package.json** (root)
   - Added: `@prisma/client` to dependencies
   - Added: `prisma` to devDependencies

### Already Created:
- ✅ `backend/setup.js` - Intelligent Prisma setup
- ✅ `backend/.prismarc.json` - Prisma config

---

## Monorepo Structure (For Reference)

```
project/
├── package.json (root - NOW HAS @prisma/client)
├── node_modules/ (includes @prisma/client)
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── setup.js
│   └── node_modules/
├── frontend/
│   ├── app/
│   ├── package.json
│   └── node_modules/
├── lib/
│   ├── prisma.js (requires @prisma/client from root)
│   ├── auth.js
│   └── ...
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## Key Points

✅ **Root package.json now has Prisma dependencies**
- Makes `@prisma/client` available to `lib/prisma.js`

✅ **Build process installs at both root and backend**
- Root: `npm install`
- Backend: `cd backend && npm install`

✅ **Setup script finds schema correctly**
- Located at `../prisma/schema.prisma`
- Works from backend directory

✅ **Server can now find all dependencies**
- Shared libs in `lib/` can access `@prisma/client`
- Backend can access shared libs

---

## Testing Locally

### Verify Monorepo Works Locally

```bash
# From root
npm install

# Should install @prisma/client at root level
ls node_modules/@prisma/

# Run backend
npm run dev:backend

# Should start successfully with database access
```

### Test Backend Only

```bash
cd backend
npm install
npm run setup
npm start

# Should output:
# ✅ Backend API running at http://localhost:5000
# ✅ Database: Connected
```

---

## Troubleshooting

### Still getting "@prisma/client not found"

**Cause:** Root package.json not updated or cache issue

**Fix:**
1. Verify @prisma/client in package.json: `grep "@prisma/client" package.json`
2. Push changes: `git push origin main`
3. Clear Render cache: Dashboard → Settings → "Clear Build Cache"
4. Redeploy

### Build still fails

**Cause:** Old build configuration still cached

**Fix:**
1. In Render Dashboard → Backend service → Settings
2. Manual Deploy with "Clean Build" option
3. Wait 10-15 minutes for full rebuild

### Prisma schema still not found

**Cause:** setup.js can't locate schema

**Fix:**
1. Check schema exists: `ls -la prisma/schema.prisma`
2. Verify setup.js has correct path
3. Test locally: `cd backend && npm run setup`

---

## Post-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render deployment completed
- [ ] Build logs show no errors
- [ ] Prisma client generated successfully
- [ ] Health check responds with 200
- [ ] Database connection established
- [ ] No "MODULE_NOT_FOUND" errors

---

## Next Steps

1. ✅ Push code (you've already done this)
2. ⏳ Wait for Render rebuild
3. ⏳ Verify logs show successful build
4. ⏳ Test `/api/health` endpoint
5. ⏳ Deploy frontend to Vercel
6. ⏳ Test API integration

---

## Summary

The fix ensures that in a monorepo structure:
1. Prisma is installed at the root level
2. Shared code can access Prisma dependencies
3. Backend can use shared libraries
4. Render deployment works correctly

**Status:** Ready to deploy! 🚀
