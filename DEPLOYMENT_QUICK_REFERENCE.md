# Production Deployment Checklist - Quick Reference

## Current Situation
- ❌ Backend on Render - Has error: "Cannot find module '@prisma/client'"
- ❌ Frontend on Vercel - Not deployed yet
- ✅ Code is separated and ready for deployment

---

## Immediate Fix for Render Backend Error

### Quick Fix (5 minutes)
1. Update `backend/package.json`:
   ```json
   "scripts": {
     "build": "prisma generate",
     "postinstall": "prisma generate",
     "start": "node server.js"
   }
   ```

2. Update `render.yaml`:
   ```yaml
   buildCommand: npm install && npm run build && npm run db:migrate
   rootDir: backend
   ```

3. Push to GitHub:
   ```bash
   git add render.yaml backend/package.json
   git commit -m "Fix: Add Prisma generation to build process"
   git push origin main
   ```

4. On Render: Trigger manual deploy or wait for auto-deploy

✅ Backend should now start successfully!

---

## Deployment Steps

### Phase 1: Backend on Render (Do First!)

#### 1.1 Fix Code Issues
- ✅ Done! All files updated

#### 1.2 Configure Render Service
- Go to https://dashboard.render.com
- Create new Web Service
- Connect GitHub repo
- Set:
  - Root Directory: `backend`
  - Build: `npm install && npm run build && npm run db:migrate`
  - Start: `npm start`

#### 1.3 Create PostgreSQL Database
- In Render dashboard → Databases
- Create new PostgreSQL database
- Name: `encogix-db`
- Connect to your backend service

#### 1.4 Set Environment Variables
| Key | Value |
|-----|-------|
| NODE_ENV | production |
| ADMIN_USERNAME | admin |
| ADMIN_PASSWORD | [set in Render] |
| JWT_SECRET | [set in Render] |
| RAZORPAY_KEY_ID | [your key] |
| RAZORPAY_KEY_SECRET | [your secret] |

#### 1.5 Deploy & Verify
```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Should return:
# {"ok":true,"database":"connected"}
```

**Get Backend URL**: `https://your-backend-name.onrender.com`

---

### Phase 2: Frontend on Vercel (Do Second!)

#### 2.1 Update Environment Variables
Update `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://encogix.vercel.app
```

#### 2.2 Push to GitHub
```bash
git add frontend/.env.production
git commit -m "Add production API URL for Vercel deployment"
git push origin main
```

#### 2.3 Deploy on Vercel
- Go to https://vercel.com/dashboard
- Click "Add New" → "Project"
- Import GitHub repo
- Set Root Directory: `frontend`
- Add Environment Variables (same as .env.production)
- Click Deploy

#### 2.4 Verify Deployment
- Visit https://encogix.vercel.app
- Open DevTools → Network
- Make API call (e.g., load projects)
- Verify request goes to Render backend

---

## File Changes Summary

### Files Modified/Created:
```
backend/package.json
  ✅ Added: postinstall script
  ✅ Added: build script

frontend/package.json
  ✅ Added: postinstall script

frontend/.env.local
  ✅ Already set to localhost:5000

frontend/.env.production
  ✅ Updated with Render backend URL

render.yaml
  ✅ Updated for backend deployment

vercel.json
  ✅ Updated for frontend deployment

.env.example
  ✅ Updated with new structure
```

### New Documentation:
- ✅ PRODUCTION_DEPLOYMENT.md - Complete guide
- ✅ RENDER_FIX.md - Fix for current error
- ✅ VERCEL_FRONTEND_DEPLOYMENT.md - Vercel specific guide
- ✅ MONOREPO_SETUP.md - Architecture overview
- ✅ SETUP_GUIDE.md - Local development
- ✅ API_MIGRATION_GUIDE.md - API call updates

---

## Environment Variables Needed

### For Render Backend:
```
NODE_ENV=production
DATABASE_URL=[auto-set by Render]
ADMIN_PASSWORD=[generate strong password]
JWT_SECRET=[generate random 32+ char string]
RAZORPAY_KEY_ID=[your Razorpay live key]
RAZORPAY_KEY_SECRET=[your Razorpay secret]
BACKEND_PORT=5000
```

### For Vercel Frontend:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://encogix.vercel.app
```

---

## Testing Commands

### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Get projects
curl https://your-backend.onrender.com/api/projects

# Get blogs
curl https://your-backend.onrender.com/api/blogs
```

### Test Frontend
1. Visit https://encogix.vercel.app
2. Open browser DevTools (F12)
3. Go to Network tab
4. Click a button that loads data
5. Verify API calls go to Render backend

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Render: "Cannot find module @prisma/client" | Update build command with `npm run build` |
| Render: Database connection failed | Create PostgreSQL, connect to service, set DATABASE_URL |
| Vercel: API calls 404 | Verify NEXT_PUBLIC_API_URL is correct in env vars |
| Vercel: CORS errors | Check backend has CORS enabled (already done) |
| Vercel: Environment vars not loading | Re-deploy after setting vars in dashboard |

---

## Deployment Timeline

```
Day 1:
  ✅ Code separation (DONE)
  ✅ Local testing (DONE)
  ⏳ Fix & deploy backend (30 mins)
  ⏳ Deploy frontend (20 mins)
  ⏳ Test & verify (10 mins)

Total: ~1 hour
```

---

## Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads without 404
- [ ] API calls from frontend work
- [ ] Database is accessible
- [ ] Admin login works
- [ ] Employee login works
- [ ] Razorpay integration works
- [ ] Chatbot responds
- [ ] Job applications submit
- [ ] Contact forms save to DB

---

## Monitoring & Maintenance

### Regular Checks
- Visit https://your-backend.onrender.com/api/health daily
- Check Render logs for errors
- Check Vercel deployment logs
- Monitor database usage

### Scaling
- Render starter: $7/month
- Vercel: Free tier sufficient
- Database: Free tier with 90-day retention

### Backups
- Enable automatic backups on Render PostgreSQL
- Download backups monthly

---

## Next Steps

1. **NOW**: Fix backend package.json & render.yaml
2. **Push**: `git push origin main`
3. **Wait**: Render auto-deploys (5-10 mins)
4. **Verify**: Test `/api/health` endpoint
5. **Deploy Frontend**: Update vercel.json and deploy
6. **Test**: Verify API calls work

---

## Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Status**: Ready to deploy! 🚀
