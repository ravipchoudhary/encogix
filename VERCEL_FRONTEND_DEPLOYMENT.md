# Vercel Frontend Deployment Guide

## Quick Summary

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Communication**: Frontend calls Backend API via HTTPS

---

## Step-by-Step Deployment

### Step 1: Prepare Frontend Code

Ensure `frontend/package.json` is correct:

```json
{
  "name": "encogix-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Step 2: Create Vercel Configuration

Update `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false,
  "framework": "nextjs",
  "env": [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID",
    "NEXT_PUBLIC_SITE_URL"
  ]
}
```

### Step 3: Set Environment Variables

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://encogix-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_here
NEXT_PUBLIC_SITE_URL=https://encogix.vercel.app
```

### Step 4: Push Code to GitHub

```bash
git add .
git commit -m "Deploy frontend to Vercel with separated backend"
git push origin main
```

### Step 5: Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

### Step 6: Add Environment Variables in Vercel

In Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://encogix-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Make sure to select these are available in:
- [ ] Production
- [ ] Preview
- [ ] Development

### Step 7: Deploy

Click "Deploy" to start the build and deployment process.

---

## Verify Deployment

### Check 1: Frontend Loads
```bash
# Visit your Vercel URL
https://encogix.vercel.app

# Should load without 404 errors
```

### Check 2: API Calls Work
1. Open browser DevTools → Network tab
2. Click a button that makes an API call (e.g., load projects)
3. Check the Network tab - should see requests to your Render backend
4. Requests should go to: `https://your-backend-name.onrender.com/api/...`

### Check 3: Environment Variables Loaded
1. In browser console, run:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   // Should print: https://encogix-backend.onrender.com
   ```

---

## API Calls from Frontend

All API calls should use the utility in `frontend/lib/api-client.ts`:

```typescript
import { getAPI, postAPI, uploadAPI } from '@/lib/api-client';

// Fetch data
const projects = await getAPI('/api/projects');

// Submit form
const result = await postAPI('/api/contact', { name, email, message });

// Upload file
const formData = new FormData();
formData.append('resume', file);
const result = await uploadAPI('/api/jobs/apply', formData);
```

The utility automatically uses `process.env.NEXT_PUBLIC_API_URL` from your environment.

---

## Connect Custom Domain

### Add Domain on Vercel
1. Dashboard → Project Settings → Domains
2. Click "Add"
3. Enter your domain: `encogix.com`
4. Choose verification method (CNAME or A record)
5. Follow DNS setup at your registrar

### Update Environment Variable
Once domain is working:
1. Go to Environment Variables
2. Update `NEXT_PUBLIC_SITE_URL=https://encogix.com`
3. Re-deploy

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Main branch** → Production
- **Other branches** → Preview URLs (for testing)
- **Pull Requests** → Preview deployments

---

## Troubleshooting

### Issue: "Cannot find module" during build
**Solution**: 
- Check all dependencies are in `frontend/package.json`
- Clear Vercel cache and redeploy
- Check build logs in Vercel dashboard

### Issue: API calls failing / 404 errors
**Solution**:
1. Verify backend is running: `https://your-backend.onrender.com/api/health`
2. Check `NEXT_PUBLIC_API_URL` is correct in Vercel env vars
3. Verify CORS is enabled on backend
4. Check Network tab in DevTools for actual URL being called

### Issue: Environment variables not loading
**Solution**:
1. Verify they're set in Vercel dashboard
2. Make sure `NEXT_PUBLIC_` prefix is used (for frontend access)
3. Re-deploy after adding vars
4. Check deployment logs show the vars being used

### Issue: TypeScript errors after deployment
**Solution**:
1. Check `frontend/tsconfig.json` is correct
2. Run locally: `npm run build` to see errors
3. Fix errors in code and push again

---

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

export default function Logo() {
  return <Image src="/logo.png" alt="Logo" width={200} height={200} />;
}
```

### API Calls Optimization
- Use React Query or SWR for caching
- Implement request deduplication
- Cache static data on frontend

### Bundle Size
```bash
# Check bundle size locally
npm run build

# Analyze what's being bundled
npm run analyze  # if analyzer is configured
```

---

## Debugging

### View Logs
1. Dashboard → Project → Deployments → Latest
2. Click "View Details"
3. See build logs and any runtime errors

### Test Locally
```bash
# Build locally
cd frontend
npm run build

# Test production build
npm start

# Visit http://localhost:3000
```

### Test API Calls
```bash
# From browser console
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Environment Reference

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=3000
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://encogix-backend.onrender.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_SITE_URL=https://encogix.com
```

### Vercel Dashboard Variables
Same as `.env.production` above, plus:
- Select appropriate environments (Production/Preview/Development)
- Verify all variables show as "Added"

---

## Deployment Checklist

- [ ] frontend/package.json has all dependencies
- [ ] vercel.json is configured correctly
- [ ] Frontend .env files are in .gitignore
- [ ] All API calls use `api-client.ts` utility
- [ ] Frontend builds locally without errors: `npm run build`
- [ ] GitHub repo is up to date
- [ ] Environment variables are set in Vercel dashboard
- [ ] Backend is running on Render
- [ ] `NEXT_PUBLIC_API_URL` points to Render backend
- [ ] Frontend deploys successfully
- [ ] API calls work in production

---

## Next Steps

1. **Backend First**: Deploy backend on Render first
2. **Get Backend URL**: Copy the Render backend URL
3. **Update Frontend**: Set `NEXT_PUBLIC_API_URL` to backend URL
4. **Deploy Frontend**: Push to GitHub and Vercel will auto-deploy
5. **Test**: Verify API calls work in production

---

## Support

For issues:
- Check Vercel logs: Dashboard → Project → Deployments
- Check backend logs: Render dashboard → Backend service → Logs
- Test locally: Run both servers and test manually
- Read error messages carefully - they usually indicate the fix needed
