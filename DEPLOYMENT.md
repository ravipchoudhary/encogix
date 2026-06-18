# Production Deployment Guide for encogix.com
## Full-Stack Unified Deployment (Backend + Frontend)

---

## ⚡ Option 1: Render (Recommended - Simplest)

Deploy everything on Render using `render.yaml`.

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production ready with Docker"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up (GitHub login recommended).
2. Click **"New +"** → **"Blueprint"**.
3. Paste your GitHub repo URL.
4. Render auto-detects `render.yaml` and shows the deployment plan.
5. Review settings and click **"Deploy"**.
6. Render automatically creates:
   - PostgreSQL database
   - Web service (Docker container)
   - Environment variables

### Step 3: Configure Domain
1. In Render dashboard, go to your service.
2. Click **"Settings"** → **"Custom Domain"**.
3. Add `encogix.com`.
4. Copy the CNAME value shown.
5. Go to your domain registrar and add this CNAME record.
6. Wait 5-30 min for DNS to propagate.

### Step 4: Test
- Visit `https://encogix.com`
- SSL is automatic ✅

**Time to deploy**: ~2-5 minutes

---

## 🚀 Option 2: Railway (Also Great)

Deploy on Railway with minimal config.

### Step 1: Connect Repository
1. Go to [railway.app](https://railway.app) and sign up.
2. Click **"New Project"** → **"Deploy from GitHub"**.
3. Select your `encogix` repo.

### Step 2: Configure Services
Railway auto-detects the Dockerfile and `railway.json`:
1. It will ask for environment variables:
   - `ADMIN_PASSWORD` - Railway generates a secure one
   - `RAZORPAY_KEY_ID` (optional, leave blank if not using)
   - `RAZORPAY_KEY_SECRET` (optional, leave blank if not using)

2. Railway auto-provisions PostgreSQL.

3. Click **"Deploy"**.

### Step 3: Connect Domain
1. In Railway project, click **"Domains"**.
2. Add `encogix.com`.
3. Copy the DNS records (CNAME or A record).
4. Add these to your domain registrar.
5. Done!

**Time to deploy**: ~3-5 minutes

---

## 💻 Option 3: Docker + VPS (DigitalOcean / Linode / AWS)

For more control, self-host on a VPS.

### Prerequisites
- VPS with Docker & docker-compose installed
- Domain pointing to VPS IP

### Step 1: SSH into VPS
```bash
ssh root@your-vps-ip
```

### Step 2: Clone and Setup
```bash
git clone <your-repo-url> encogix
cd encogix

# Copy example env
cp .env.production.example .env.production

# Edit with your credentials
nano .env.production
# Set: ADMIN_PASSWORD, RAZORPAY keys, etc.
```

### Step 3: Deploy with Docker Compose
```bash
docker-compose -f docker-compose.production.yml up -d --build
```

### Step 4: Setup SSL with Traefik
Install Traefik reverse proxy for automatic Let's Encrypt SSL:

```bash
# Download Traefik docker-compose
curl https://raw.githubusercontent.com/traefik/traefik/master/examples/docker-compose/docker-compose.yml -o traefik-compose.yml

# Start Traefik
docker-compose -f traefik-compose.yml up -d

# Update DNS to point to your VPS IP
```

### Step 5: Test
```bash
curl https://encogix.com
```

**Estimated cost**: $5-20/month (DigitalOcean basic droplet)

---

## 📋 Quick Reference

| Option | Ease | Cost | Setup Time | SSL |
|--------|------|------|-----------|-----|
| **Render** | ⭐⭐⭐⭐⭐ | Free tier + $7/mo | 2-5 min | Auto |
| **Railway** | ⭐⭐⭐⭐ | $5/mo starter | 3-5 min | Auto |
| **VPS** | ⭐⭐ | $5-20/mo | 15-30 min | Manual |

---

## 🔧 Local Testing Before Deploy

Test the full Docker setup locally:

```bash
# Create .env.local for testing
cp .env.production.example .env.local
# Edit .env.local with test values

# Run
docker-compose -f docker-compose.production.yml up --build

# Visit http://localhost:3000
# Test API: http://localhost:3000/api/health
```

Stop with:
```bash
docker-compose -f docker-compose.production.yml down
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Dockerfile compatibility; run `npm run build` locally first |
| Database connection error | Ensure `DATABASE_URL` is set correctly in env vars |
| 502 Bad Gateway | Wait 30-60s for app to start; check logs in platform dashboard |
| Domain not working | Wait 5-30 min for DNS; check CNAME/A record in registrar |
| SSL certificate error | Let platform auto-provision; if manual, use Certbot or acme.sh |

---

## 📚 Additional Resources

- **Render Docs**: https://docs.render.com
- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com
- **Let's Encrypt**: https://letsencrypt.org
