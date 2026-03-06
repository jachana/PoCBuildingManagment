# Quickstart: SocialBuildingManagment PoC

**Date**: 2026-03-06

---

## Prerequisites

- Node.js 20+ (LTS)
- Docker Desktop (for Docker Compose)
- Expo CLI: `npm install -g expo-cli`
- Xcode 15+ (for iOS builds, macOS only)
- Android Studio + Android SDK (for Android builds)
- Physical device recommended for push notification testing

---

## Local Development Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd SocialBuildingManagment
npm install
```

### 2. Start backend services with Docker Compose

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port 5432
- **MinIO** on port 9000 (console on 9001)
- **MailHog** on port 8025 (email testing, optional)

### 3. Setup backend API

```bash
cd api
npm install
cp .env.example .env        # Configure local env vars
npx prisma migrate dev      # Run database migrations
npx prisma db seed          # Seed initial data (admin user, building)
npm run dev                  # Start API with hot reload (port 3000)
```

### 4. Setup mobile app

```bash
# From project root
npx expo install             # Install Expo dependencies
npx expo prebuild            # Generate native projects
npx expo run:ios             # Or: npx expo run:android
```

### 5. Setup admin panel

```bash
cd admin
npm install
cp .env.example .env         # Point to local API
npm run dev                  # Start Vite dev server (port 5173)
```

---

## Environment Variables

### API (`api/.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/socialbuilding
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=socialbuilding
MINIO_USE_SSL=false
FCM_SERVICE_ACCOUNT=path/to/firebase-service-account.json  # Optional for PoC
PORT=3000
NODE_ENV=development
```

### Mobile app (`app.config.ts` or `.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Admin panel (`admin/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Docker Compose Services

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: socialbuilding
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  pgdata:
  miniodata:
```

---

## Project Structure

```
SocialBuildingManagment/
├── app/                        # Expo Router pages (mobile)
│   ├── _layout.tsx             # Root layout with auth gate
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab navigator
│   │   ├── marketplace/
│   │   ├── recommendations/
│   │   └── entrepreneurs/
│   ├── profile/
│   └── report.tsx
├── src/                        # Mobile app shared code
│   ├── components/
│   ├── hooks/
│   ├── services/               # API client (fetch + TanStack Query)
│   ├── models/                 # TypeScript types
│   └── utils/
├── api/                        # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── index.ts            # Express app entry
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   ├── recommendations.ts
│   │   │   ├── entrepreneurs.ts
│   │   │   ├── reports.ts
│   │   │   ├── uploads.ts
│   │   │   └── admin.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT verification
│   │   │   ├── authorize.ts    # Role-based access
│   │   │   └── validate.ts     # Request validation (zod)
│   │   ├── services/
│   │   │   ├── storage.ts      # MinIO S3 client
│   │   │   └── notifications.ts # FCM push (optional)
│   │   └── lib/
│   │       ├── prisma.ts       # Prisma client singleton
│   │       └── jwt.ts          # Token generation/verification
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── admin/                      # Admin web panel (Vite + React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PendingApprovals.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Users.tsx
│   │   │   └── ContentManagement.tsx
│   │   ├── components/
│   │   └── services/
│   │       └── api.ts          # API client
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml          # Local dev services
├── docker-compose.prod.yml     # Production (Coolify)
├── app.json                    # Expo config
├── tsconfig.json               # Mobile TypeScript config
└── package.json                # Mobile dependencies
```

---

## Key Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL + MinIO + MailHog |
| `docker compose down` | Stop all local services |
| `cd api && npm run dev` | Start API with hot reload |
| `cd api && npx prisma studio` | Open Prisma database browser |
| `cd api && npx prisma migrate dev` | Run pending migrations |
| `npx expo start --dev-client` | Start Expo dev server |
| `npx expo run:ios` | Build and run on iOS |
| `npx expo run:android` | Build and run on Android |
| `cd admin && npm run dev` | Start admin panel dev server |

---

## Coolify Deployment

The production setup mirrors local Docker Compose:

1. **API**: Build from `api/Dockerfile`, connect to Coolify-managed PostgreSQL
2. **PostgreSQL**: Coolify-managed database service
3. **MinIO**: Docker container on Coolify
4. **Admin panel**: Build from `admin/Dockerfile` (nginx serving static build)
5. **Mobile app**: Built via Expo EAS, distributed via App Store / Google Play / TestFlight

Environment variables are configured in Coolify's dashboard per service.
