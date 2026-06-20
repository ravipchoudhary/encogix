# Fix for Render Deployment Error

## Problem
```
Error: Cannot find module '@prisma/client'
```

## Root Cause
The build command on Render isn't generating the Prisma client before starting the server.

## Solution

### Option 1: Fix render.yaml (Recommended)

Update your `render.yaml` file with:

```yaml
services:
  - type: web
    name: encogix-backend
    env: node
    rootDir: backend
    buildCommand: npm install && npm run build && npm run db:migrate
    startCommand: npm start
    autoDeploy: true
```

Key points:
- `rootDir: backend` - Tells Render to work in the backend folder
- `buildCommand: npm install && npm run build` - Installs deps and generates Prisma
- `npm run db:migrate` - Applies database migrations

### Option 2: Fix build in current deployment

If you already have a deployment on Render:

1. Go to your service settings
2. Update **Build Command** to:
   ```
   npm install && npm run build && npm run db:migrate
   ```
3. Update **Start Command** to:
   ```
   npm start
   ```
4. Make sure **Root Directory** is set to `backend` (if available in your plan)
5. Trigger a new deploy

### Option 3: Fix via package.json

Ensure `backend/package.json` has:

```json
{
  "scripts": {
    "build": "prisma generate",
    "postinstall": "prisma generate",
    "start": "node server.js",
    "db:migrate": "prisma migrate deploy"
  }
}
```

This ensures Prisma client is generated automatically.

---

## Deployment Steps for Fresh Deploy

### 1. Prepare Code Locally
```bash
# Make sure everything works locally first
npm run dev

# Test backend
npm run dev:backend
```

### 2. Update Configuration Files

#### backend/package.json
```json
{
  "scripts": {
    "build": "prisma generate",
    "postinstall": "prisma generate",
    "start": "node server.js",
    "db:migrate": "prisma migrate deploy"
  }
}
```

#### render.yaml
```yaml
services:
  - type: web
    name: encogix-backend
    env: node
    rootDir: backend
    buildCommand: npm install && npm run build && npm run db:migrate
    startCommand: npm start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: encogix-db
          property: connectionString
      - key: ADMIN_USERNAME
        value: admin
      - key: ADMIN_PASSWORD
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
      - key: BACKEND_PORT
        value: "5000"

databases:
  - name: encogix-db
    databaseName: encogix
    user: encogix_user
    plan: free
```

### 3. Push to GitHub
```bash
git add .
git commit -m "Fix backend deployment configuration"
git push origin main
```

### 4. Deploy on Render

**Option A: If using render.yaml**
- Go to Dashboard
- Click "New" → "Web Service"
- Select your repository
- Select branch with render.yaml
- Render will auto-detect and use the configuration

**Option B: If manually configuring**
- Create new Web Service
- Connect GitHub repo
- Set **Root Directory**: `backend`
- Set **Build Command**: `npm install && npm run build && npm run db:migrate`
- Set **Start Command**: `npm start`
- Add all Environment Variables
- Click Deploy

### 5. Set Environment Variables on Render

Go to your service → Environment:
- ADMIN_PASSWORD - Set to secure password
- JWT_SECRET - Set to random string (min 32 chars)
- RAZORPAY_KEY_ID - Your Razorpay key
- RAZORPAY_KEY_SECRET - Your Razorpay secret

DATABASE_URL will be auto-set when you link the PostgreSQL database.

### 6. Verify Deployment

Once deployed:
```bash
# Check if API is running
curl https://your-backend-name.onrender.com/api/health

# Should return:
# {"ok":true,"database":"connected"}
```

---

## Common Issues & Fixes

### Issue: Build fails with "Cannot find module"
**Fix**: Ensure `postinstall` script in backend/package.json runs `prisma generate`

### Issue: Database connection fails
**Fix**: 
1. Create PostgreSQL database in Render
2. Connect it to the service
3. Run migrations in Render Shell: `npx prisma migrate deploy`

### Issue: Port binding error
**Fix**: Ensure BACKEND_PORT env var is set (usually auto-assigned by Render)

### Issue: Migrations not applying
**Fix**: 
1. Go to Service Shell (Render dashboard)
2. Run: `cd backend && npx prisma migrate deploy`
3. Check: `npx prisma db push` (development only)

---

## Quick Checklist

- [ ] backend/package.json has `postinstall: "prisma generate"`
- [ ] backend/package.json has `build: "prisma generate"`
- [ ] render.yaml is in root directory
- [ ] render.yaml has `rootDir: backend`
- [ ] render.yaml has correct buildCommand with `npm run build`
- [ ] Database is created on Render
- [ ] All environment variables are set
- [ ] Code is pushed to GitHub
- [ ] Deployment shows as active (green)
- [ ] `/api/health` returns success
