# Encogix - Monorepo Architecture (Separated Frontend & Backend)

## Overview

The application has been restructured as a monorepo with completely separated frontend and backend servers:

- **Backend**: Express.js API server running on port 5000
- **Frontend**: Next.js application running on port 3000
- Both communicate via HTTP API calls

## Directory Structure

```
encogix/
├── backend/              # Backend Express API server
│   ├── server.js        # Main backend server (all API routes)
│   ├── package.json     # Backend-only dependencies
│   ├── .env             # Backend configuration
│   └── [shared libs]    # ../lib, ../prisma
├── frontend/            # Frontend Next.js application
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── public/          # Static assets
│   ├── package.json     # Frontend-only dependencies
│   ├── .env.local       # Local development config
│   ├── .env.production  # Production config
│   └── next.config.mjs  # Next.js configuration
├── lib/                 # Shared libraries (Prisma, auth, etc.)
├── prisma/              # Database schema and migrations
├── package.json         # Root package.json (for monorepo scripts)
└── .env                 # Root environment variables

## Environment Configuration

### Root .env (Production)
- DATABASE_URL
- ADMIN credentials
- RAZORPAY keys
- BACKEND_PORT
- FRONTEND_PORT

### backend/.env (Backend Server)
```env
DATABASE_URL=...
BACKEND_PORT=5000
NODE_ENV=development
```

### frontend/.env.local (Development)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=3000
```

### frontend/.env.production (Production)
```env
NEXT_PUBLIC_API_URL=https://api.encogix.com
PORT=3000
```

## Getting Started

### 1. Install Dependencies

From the root directory:
```bash
npm install
```

This will automatically install dependencies for both backend and frontend.

### 2. Run Development Environment

Run both servers together:
```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

### Run Individual Servers

Backend only:
```bash
npm run dev:backend
```

Frontend only:
```bash
npm run dev:frontend
```

### 3. Database Setup

```bash
# Apply migrations
npm run db:migrate

# Push schema (development)
npm run db:push

# Seed database
npm run db:seed

# Prisma Studio (visual database tool)
npm run db:studio
```

## Production Deployment

### Build Frontend
```bash
npm run build
```

### Start Production
```bash
npm start
```

This starts the backend API server. The frontend should be served separately via:
```bash
npm run start:frontend
```

## API Endpoints

All API endpoints are prefixed with `/api`:

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/projects` - List projects
- `GET /api/projects/:slug` - Get project details
- `GET /api/blogs` - List blogs
- `GET /api/jobs` - List jobs
- `POST /api/contact` - Submit contact form
- `POST /api/audit` - Request website audit
- `POST /api/jobs/apply` - Apply for job
- `POST /api/internships/apply` - Apply for internship
- `POST /api/chatbot` - Chat with bot

### Admin Endpoints (`/api/admin/`)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/leads` - List leads
- `GET /api/admin/employees` - List employees
- (And many more admin management endpoints)

### Employee Endpoints (`/api/employee/`)
- `POST /api/employee/login` - Employee login
- `POST /api/employee/punch-in` - Clock in
- `POST /api/employee/punch-out` - Clock out
- `GET /api/employee/attendance` - View attendance
- (And many more employee endpoints)

## Frontend Configuration

The frontend automatically uses the `NEXT_PUBLIC_API_URL` environment variable for all API calls.

Update your API client code to use:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Usage in fetch calls
fetch(`${API_URL}/api/endpoint`)
```

## Troubleshooting

### Both Servers Won't Start
- Ensure ports 5000 and 3000 are available
- Check if another process is using these ports

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` is correctly set
- Check CORS configuration in backend/server.js
- Ensure backend server is running

### Database Connection Issues
- Verify DATABASE_URL in .env
- Run `npm run db:migrate` to apply migrations
- Check if Prisma is properly installed

## Migration from Old Setup

The old combined server.js is still available for reference. To completely remove the old setup:

1. Delete the old `server.js` (backup first if needed)
2. Remove Next.js-related entries from root package.json
3. Run `npm install` to update dependencies

## Performance Notes

- Backend and frontend are now independently scalable
- Can deploy backend and frontend to different servers/containers
- Easier to implement separate CI/CD pipelines
- Better for microservices architecture

## Notes

- Shared libraries (auth, slug, chatbot-knowledge) are in the root `/lib` directory
- Prisma schema and migrations are in the root `/prisma` directory
- Both services share the same database via Prisma
