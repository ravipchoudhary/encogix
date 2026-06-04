# Encogix Technology

Website, admin panel, and employee portal for [Encogix.com](https://www.encogix.com).

## Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Express + custom Next.js server (`server.js`)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (admin & employee roles)

## Quick start

### 1. PostgreSQL

```bash
docker compose up -d
```

Or use any PostgreSQL host and set `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/encogix?schema=public"
```

### 2. Environment

Copy `.env.example` to `.env` and update secrets (especially `JWT_SECRET`, `ADMIN_PASSWORD`, `DATABASE_URL`).

### 3. Database setup

```bash
npm install
npx prisma db push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

- **Admin:** `/admin/login` (default from `.env`: `ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- **Employee:** `/employee/login` (create employees in Admin → Employees first)

## Production deployment

**Important:** Deploy with `node server.js` (not static export). The Express server serves both `/api/*` routes and Next.js pages.

```bash
npm run build
npm run start
```

Set production env:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — strong random secret
- `NEXT_PUBLIC_SITE_URL` — `https://www.encogix.com`
- `NEXT_PUBLIC_API_URL` — same as public site URL (for SSR)
- `NODE_ENV=production`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Prisma generate + Next.js build |
| `npm run start` | Production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed admin, testimonials, sample projects |
| `npm run db:studio` | Prisma Studio GUI |
