# Quick Start Guide - Separated Backend & Frontend

## What Changed?

✅ **Backend** - Now runs independently on port **5000**
- Express API server with all routes
- Located in `backend/server.js`
- Handles all business logic and database operations

✅ **Frontend** - Now runs independently on port **3000**  
- Next.js application
- Makes HTTP requests to backend API
- Separated dependency list (no Express, Multer, etc.)

## Quick Commands

### Start Development (Both Servers)
```bash
npm run dev
```

Terminal output will show:
- `BACKEND: ✅ Backend API running at http://localhost:5000`
- `FRONTEND: ▲ Ready started server on 0.0.0.0:3000`

### Start Individual Servers
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Build for Production
```bash
npm run build
```

### Start Production
```bash
npm start          # Starts backend
npm run start:frontend  # Starts frontend (separate terminal)
```

## File Structure

```
backend/
├── server.js       ← All API routes here
├── package.json    ← Backend dependencies only
└── .env            ← Backend config

frontend/
├── app/            ← Next.js pages
├── components/     ← React components  
├── package.json    ← Frontend dependencies only
├── .env.local      ← Dev config (points to localhost:5000)
└── .env.production ← Prod config

lib/               ← Shared utilities
prisma/            ← Database schema
```

## Environment Variables

### For Frontend Developers
- `.env.local` automatically uses `NEXT_PUBLIC_API_URL=http://localhost:5000`
- No changes needed for local development

### For Production
- Update `frontend/.env.production` with your actual backend URL
- Example: `NEXT_PUBLIC_API_URL=https://api.encogix.com`

## Making API Calls from Frontend

```javascript
// In any frontend component/page
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Example: Fetch projects
const response = await fetch(`${API_URL}/api/projects`);
const projects = await response.json();
```

## Database Commands

```bash
npm run db:migrate   # Apply pending migrations
npm run db:push      # Push schema changes (dev only)
npm run db:seed      # Seed initial data
npm run db:studio    # Open visual database editor
```

## Ports

- **Backend API**: 5000 (http://localhost:5000)
- **Frontend**: 3000 (http://localhost:3000)

## Common Issues

| Issue | Solution |
|-------|----------|
| "Port already in use" | Change port in `.env` files |
| API calls failing | Ensure backend is running on port 5000 |
| CORS errors | Check backend/server.js CORS config |
| .env not loading | Restart dev server |

## Summary

Before: Single `node server.js` (combined Express + Next.js)
After: Two separate servers (Backend + Frontend) communicating via API

Benefits:
✅ Independent scaling
✅ Easier testing & debugging
✅ Cleaner deployment pipeline
✅ Better for microservices
✅ Separate dependency management
