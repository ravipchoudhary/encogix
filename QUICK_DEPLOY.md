# 🚀 Quick Deploy Guide - Backend + Frontend Together on encogix.com

**Choose ONE of these options (all have frontend + backend together):**

---

## Option A: 1-Click Deploy on Render ⭐ (EASIEST)

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://render.com → Click "New+" → "Blueprint"
# 3. Paste your GitHub repo URL
# 4. Render reads render.yaml and deploys everything automatically
# 5. Get your Render URL → Add custom domain encogix.com
# 6. Update DNS at your registrar with the CNAME shown
```

✅ **Time**: 5 minutes  
✅ **Cost**: Free tier (limited), $7/mo recommended  
✅ **SSL**: Automatic

---

## Option B: Deploy on Railway

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://railway.app → Sign up with GitHub
# 3. New Project → Deploy from GitHub → Select encogix
# 4. Railway runs the Dockerfile and connects PostgreSQL
# 5. Set ADMIN_PASSWORD and other secrets
# 6. Add domain encogix.com
# 7. Update DNS with Railway's CNAME
```

✅ **Time**: 5 minutes  
✅ **Cost**: ~$5/month  
✅ **SSL**: Automatic

---

## Option C: Self-Hosted on VPS (DigitalOcean / Linode / AWS)

```bash
# 1. Buy a VPS (~$5/month)
# 2. SSH into it:
ssh root@your-vps-ip

# 3. Install Docker:
apt-get update && apt-get install docker.io docker-compose -y

# 4. Clone your repo:
git clone <your-github-repo> encogix
cd encogix

# 5. Copy and edit environment:
cp .env.production.example .env.production
# Edit .env.production with your values

# 6. Start with Docker Compose:
docker-compose -f docker-compose.production.yml up -d --build

# 7. Set up SSL with Traefik or Let's Encrypt

# 8. Point encogix.com DNS to your VPS IP
```

✅ **Time**: 20 minutes (first time)  
✅ **Cost**: $5-20/month  
✅ **SSL**: Manual setup or Traefik (auto)

---

## 📁 Key Files Created

```
Dockerfile              ← Builds entire app (frontend + backend)
docker-compose.production.yml  ← Local testing
render.yaml            ← Render one-click deploy config
railway.json           ← Railway deploy config
.env.production.example ← Template for secrets
DEPLOYMENT.md          ← Full deployment guide
```

---

## 🧪 Test Locally Before Deploying

```bash
# 1. Create local env file:
cp .env.production.example .env.local

# 2. Start locally:
docker-compose -f docker-compose.production.yml up --build

# 3. Visit http://localhost:3000
# 4. Test API: http://localhost:3000/api/health

# 5. Stop when done:
docker-compose -f docker-compose.production.yml down
```

---

## ❓ Which Option Should You Choose?

- **Render**: Easiest, free tier exists, Blueprint config ready ✅
- **Railway**: Also very easy, slightly cheaper paid tier
- **VPS**: Most control, but need Docker knowledge

---

## 🎯 Next Steps

1. **Choose your platform** (Render recommended)
2. **Push to GitHub** (if not already done)
3. **Follow the deploy steps above**
4. **Update DNS** when platform shows CNAME
5. **Test** at https://encogix.com

**Questions?** Check DEPLOYMENT.md for detailed instructions.
