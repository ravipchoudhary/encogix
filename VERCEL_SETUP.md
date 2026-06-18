# Vercel Deployment Checklist for encogix.com

## Prerequisites
- GitHub/GitLab account with repo pushed
- Vercel account (free tier works)
- Backend server deployed (Render, Railway, etc.) or using external API

## 5-Minute Setup

1. **Sign in to Vercel**
   - Visit https://vercel.com and log in with GitHub/GitLab

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your encogix repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `.` (already set correctly)

3. **Add Environment Variables**
   Before clicking "Deploy", add these in the Environment Variables section:
   ```
   NEXT_PUBLIC_SITE_URL          https://encogix.com
   NEXT_PUBLIC_WHATSAPP          919431607346
   NEXT_PUBLIC_CONTACT_EMAIL     contact@encogix.com
   NEXT_PUBLIC_BACKEND_URL       https://your-backend.render.com (if separate backend)
   DATABASE_URL                  postgresql://user:pass@host/encogix (if needed)
   ADMIN_USERNAME                admin
   ADMIN_PASSWORD                your_secure_password
   NODE_ENV                       production
   RAZORPAY_KEY_ID               (optional, add if using payments)
   RAZORPAY_KEY_SECRET           (optional, add if using payments)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 min)
   - You'll get a preview URL: `https://encogix.vercel.app`

5. **Connect Domain**
   - In Vercel project: Settings → Domains
   - Add `encogix.com`
   - Vercel shows DNS records needed
   - Go to your domain registrar and update DNS
   - Wait 5-60 min for DNS propagation

6. **Test**
   - Visit `https://encogix.com`
   - Should see your site with auto SSL ✅

## Redeploy After Changes
- Push to main branch → Vercel auto-rebuilds
- Or manually trigger in Vercel dashboard

## Backend Deployment (if not using managed API)
- Deploy `server.js` separately to Render/Railway
- Update `NEXT_PUBLIC_BACKEND_URL` to match backend URL
- Test API calls from frontend

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/learn/deployment
