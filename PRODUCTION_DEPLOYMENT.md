# Production Deployment Guide

## Architecture

- **Backend**: Deployed on Render (Node.js)
- **Frontend**: Deployed on Vercel (Next.js)
- **Database**: PostgreSQL on Render
- **Communication**: Frontend calls Backend API via HTTPS

---

## Backend Deployment on Render

### Prerequisites
1. Render account (render.com)
2. GitHub repository with code pushed
3. PostgreSQL database (Render will create one)

### Step 1: Deploy Backend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `encogix-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npm run db:migrate`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Plan**: Starter ($7/month)

### Step 2: Set Environment Variables

In Render dashboard, go to Environment and add:

```
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=[generate a strong password]
JWT_SECRET=[generate a random secret]
RAZORPAY_KEY_ID=[your Razorpay key]
RAZORPAY_KEY_SECRET=[your Razorpay secret]
BACKEND_PORT=5000
DATABASE_URL=[automatically set from connected database]
```

### Step 3: Create Database

1. In Render dashboard, go to Databases
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `encogix-db`
   - **Database**: `encogix`
   - **User**: `encogix_user`
   - **Region**: Same as backend
   - **Plan**: Free

The `DATABASE_URL` will be automatically injected into the backend environment.

### Step 4: Verify Deployment

After deployment completes:
```bash
# Check health endpoint
curl https://your-backend-url.onrender.com/api/health

# Should return:
# {"ok":true,"database":"connected"}
```

### Backend URL Format
```
https://encogix-backend.onrender.com
```

Note: Save this URL for frontend deployment.

---

## Frontend Deployment on Vercel

### Prerequisites
1. Vercel account (vercel.com)
2. GitHub repository with code pushed
3. Backend URL from Render

### Step 1: Deploy Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables

In Vercel project settings, go to Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://encogix-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://encogix.vercel.app (or your domain)
```

### Step 3: Verify Deployment

After deployment:
1. Visit your Vercel frontend URL
2. Open browser DevTools → Network
3. Make an API call (e.g., load projects)
4. Verify it goes to `https://encogix-backend.onrender.com/api/...`

### Frontend URL Format
```
https://encogix.vercel.app  (temporary)
https://your-domain.com     (with custom domain)
```

---

## Environment Variables Reference

### Backend (.env for Render)
```env
# Core
NODE_ENV=production
BACKEND_PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host/encogix

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_random_jwt_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```

### Frontend (.env.production for Vercel)
```env
NEXT_PUBLIC_API_URL=https://encogix-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Troubleshooting

### Backend won't start
**Error**: "Cannot find module '@prisma/client'"
- Solution: Ensure `postinstall` script runs: `npm run build` generates Prisma client
- Check: Build logs in Render dashboard

**Error**: "Database connection failed"
- Solution: Verify `DATABASE_URL` is set correctly
- Check: Database is created and running
- Test: Run migrations manually in Render Shell

### Frontend API calls failing
**Error**: "Failed to fetch from API"
- Solution: Verify `NEXT_PUBLIC_API_URL` is correct in Vercel env vars
- Check: Backend is running and accessible
- Test: `curl https://your-backend/api/health` from terminal

**Error**: CORS errors in browser console
- Solution: Backend already has CORS enabled for all origins
- Check: Network tab shows correct API URL being called
- Test: Make request from Postman to verify backend works

### Database issues
**Error**: "Database URL not found"
- Solution: Connect PostgreSQL database to Render service
- Check: Environment variables loaded correctly
- Test: In Render Shell: `echo $DATABASE_URL`

**Error**: "Migrations not applied"
- Solution: Run manually in Render Shell: `npx prisma migrate deploy`
- Check: Verify migrations folder exists
- Test: Connect to DB and check tables exist

---

## Deployment Checklist

### Before Deploying Backend
- [ ] `backend/package.json` has all dependencies
- [ ] `backend/server.js` uses `process.env.DATABASE_URL`
- [ ] Prisma schema is correct
- [ ] Migrations are created
- [ ] `.gitignore` excludes node_modules and .env
- [ ] GitHub repo is up to date

### Before Deploying Frontend
- [ ] `frontend/package.json` is updated
- [ ] All API calls use `process.env.NEXT_PUBLIC_API_URL`
- [ ] Use `api-client.ts` utility from `frontend/lib/`
- [ ] `.env.production` has correct backend URL
- [ ] `.gitignore` excludes build files
- [ ] GitHub repo is up to date

### After Deployment
- [ ] Backend health check works: `/api/health`
- [ ] Frontend loads without errors
- [ ] API calls work (check Network tab in DevTools)
- [ ] Database is accessible
- [ ] Razorpay integration works
- [ ] Environment variables are correct on both platforms

---

## Custom Domain Setup

### For Backend (Render)
1. Render dashboard → Backend service → Settings
2. Scroll to "Custom Domain"
3. Add: `api.encogix.com`
4. Update DNS records at domain registrar

### For Frontend (Vercel)
1. Vercel dashboard → Project Settings → Domains
2. Add custom domain: `encogix.com`
3. Follow DNS setup instructions

Then update:
- Frontend: `NEXT_PUBLIC_API_URL=https://api.encogix.com`
- Frontend: `NEXT_PUBLIC_SITE_URL=https://encogix.com`

---

## Monitoring & Logs

### Render Backend Logs
- Dashboard → Service → Logs
- Watch for startup errors and API failures

### Vercel Frontend Logs
- Dashboard → Project → Deployments → View Details
- Check build logs and runtime logs

### Database Logs
- Render dashboard → Database → Logs
- Monitor for connection issues

---

## Scaling & Performance

### Backend (Render)
- Starter plan: $7/month (suitable for small projects)
- Can upgrade to Standard ($25/month) for better performance
- Use caching for frequently accessed data

### Frontend (Vercel)
- Free tier includes production deployments
- Automatic CDN distribution
- Preview deployments for each PR

### Database (Render)
- Free PostgreSQL has 90-day retention
- Upgrade for better performance and backups
- Use database indexes for common queries
