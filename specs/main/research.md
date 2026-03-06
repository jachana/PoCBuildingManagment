# Research: SocialBuildingManagment PoC

**Date**: 2026-03-06 | **Spec**: specs/main/spec.md

---

## 1. Mobile Framework: Expo (CNG) + React Native

**Decision**: Expo with prebuild (Continuous Native Generation) workflow
**Rationale**: Expo CNG provides managed DX with full native module access via Config Plugins. `expo-dev-client` enables native modules without maintaining native code manually. Performance difference vs bare RN is under 5%.
**Alternatives considered**:
- Bare React Native: More boilerplate, manual native config, no benefit for PoC
- Flutter: Strong contender but React Native has wider availability in Chilean market per spec requirements
- Expo Go (managed only): Cannot run native modules; insufficient for push notifications

---

## 2. Backend: Node.js + Express + Prisma + PostgreSQL

**Decision**: Custom REST API with Node.js/Express, Prisma ORM, PostgreSQL database
**Rationale**: Self-hosted on Coolify via Docker. Full control over data, no vendor lock-in, aligns with constitution requirement for RESTful API with OpenAPI docs. Prisma provides type-safe database access with migrations. PostgreSQL is battle-tested for relational data (users, posts, recommendations with relationships).
**Alternatives considered**:
- Firebase (Firestore + Cloud Functions): Vendor lock-in, less control, harder to self-host. Doesn't align with Coolify deployment model.
- Supabase: Good option but adds external dependency. Could be considered for future scaling.
- Fastify instead of Express: Faster but smaller ecosystem. Express is sufficient for PoC throughput.
- NestJS: More structure but over-engineered for PoC scope (YAGNI).

---

## 3. Authentication: Custom JWT with Passport.js

**Decision**: Email/password auth with JWT tokens, Passport.js local strategy, bcrypt for password hashing
**Rationale**: Self-hosted, no external auth dependency. JWT tokens work well with mobile apps (stored in SecureStore). Admin-approval flow implemented as a simple `approved` boolean on user record. Phone verification deferred to post-PoC.
**Flow**:
1. User registers with email/password + unit number
2. Backend creates user with `status: 'pending'`
3. Admin approves in admin panel -> `status: 'approved'`
4. User can now login and receive JWT with role/buildingId claims
5. JWT refresh via refresh token stored in httpOnly cookie (web) or SecureStore (mobile)

**Token structure**:
```json
{
  "sub": "user-uuid",
  "role": "resident|admin|building_manager",
  "buildingId": "building-uuid",
  "iat": 1709740800,
  "exp": 1709827200
}
```
**Alternatives considered**:
- Firebase Auth: External dependency, doesn't align with self-hosted model
- Supabase Auth: Good but adds external service
- Auth0/Clerk: SaaS cost, overkill for single-building PoC
- OAuth2 with Google/Apple: Nice-to-have, add later as secondary login method

---

## 4. Navigation: Expo Router

**Decision**: Expo Router (file-based routing built on React Navigation)
**Rationale**: Default for new Expo projects, file-based routing simplifies the 3-tab + auth + admin structure. Supports route groups for auth protection.
**Alternatives considered**:
- React Navigation standalone: More verbose, Expo Router is a superset

**App structure**:
```
app/
  _layout.tsx          (root layout with auth gate)
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx        (tab navigator)
    marketplace/
    recommendations/
    entrepreneurs/
  profile/
  report.tsx
```

---

## 5. Offline Support Strategy

**Decision**: TanStack Query (React Query) with AsyncStorage persistence
**Rationale**: TanStack Query provides caching, background refetch, and optimistic updates out of the box. With `@tanstack/query-async-storage-persister`, cached data survives app restarts. Reads serve from cache when offline; mutations queue via `onlineMutationManager`.
**Key details**:
- `staleTime: 5 * 60 * 1000` (5 min) for most queries
- `gcTime: 24 * 60 * 60 * 1000` (24h) for offline cache retention
- Optimistic updates for creating posts/recommendations
- Network status indicator in UI
**Alternatives considered**:
- Firestore offline persistence: Not applicable with custom backend
- WatermelonDB: Full local-first DB, overkill for PoC
- Custom fetch + AsyncStorage: TanStack Query does this better with less code

---

## 6. File Storage: MinIO (S3-compatible)

**Decision**: MinIO for object storage, S3-compatible API
**Rationale**: Runs in Docker Compose locally, deployable on Coolify. Same S3 API everywhere. Presigned URLs for direct mobile uploads (avoids backend as proxy). Can swap to any S3-compatible service later.
**Upload flow**:
1. Mobile requests presigned upload URL from backend
2. Backend generates presigned PUT URL (expires 15 min)
3. Mobile uploads directly to MinIO via presigned URL
4. Backend stores the object key in database
5. For reads, backend generates presigned GET URL or serves via CDN

**Alternatives considered**:
- Firebase Storage: External dependency
- Local filesystem: No horizontal scaling, harder to manage
- Cloudinary: SaaS cost, unnecessary for PoC

---

## 7. Image Handling Pipeline

**Decision**: expo-image-picker -> expo-image-manipulator (compress) -> presigned URL upload to MinIO -> expo-image (display with caching)
**Rationale**: Same Expo image pipeline, only the upload target changes (presigned URL to MinIO instead of Firebase Storage).
**Key details**:
- Compress to JPEG, max 800px width, 0.7 quality before upload
- Upload via `fetch(presignedUrl, { method: 'PUT', body: file })`
- `expo-image` has built-in disk/memory caching for display
**Alternatives considered**:
- react-native-compressor: More robust but adds native dependency complexity

---

## 8. Admin Panel

**Decision**: Separate lightweight React web app (Vite + React + TanStack Query)
**Rationale**: Admin features (tables, filters, user management) better suited to web. Connects to same backend API. Deployed as separate container on Coolify.
**Key dependencies**:
- `react` + `vite`
- `@tanstack/react-query` (same caching approach as mobile)
- `shadcn/ui` or similar for UI components
- Same API client as mobile (shared types via monorepo)
**Alternatives considered**:
- react-admin: Good for rapid CRUD, but adds learning curve for customization
- Retool/Appsmith: Low-code, but external dependency

---

## 9. Push Notifications

**Decision**: Firebase Cloud Messaging (FCM) for delivery + expo-notifications for presentation, triggered from custom backend
**Rationale**: FCM is the standard for mobile push on both iOS and Android. The backend sends push via Firebase Admin SDK (only dependency on Firebase). `expo-notifications` handles display.
**Key details**:
- Backend stores FCM device tokens per user
- Push triggered by backend events (approval, reports, new posts)
- Only Firebase dependency is FCM — no Firestore, no Firebase Auth
- `firebase-admin` npm package on backend for sending pushes
**Alternatives considered**:
- OneSignal: Good alternative, free tier sufficient for PoC
- Expo Push Service: Adds intermediary, less control
- Web Push only: Doesn't work well on mobile

---

## 10. Local Development: Docker Compose

**Decision**: Docker Compose for all backend services locally
**Services**:
- `postgres`: PostgreSQL 16
- `minio`: MinIO (S3-compatible storage)
- `api`: Backend Node.js app (hot reload with nodemon/tsx)
- `mailhog` (optional): Email testing for verification emails

**Rationale**: One `docker compose up` to run everything. Same database engine locally and in production. MinIO provides S3 API locally without cloud dependency.
**Alternatives considered**:
- SQLite for local dev: Different behavior vs PostgreSQL in production
- Firebase Emulator Suite: Not applicable with custom backend

---

## 11. Deployment: Coolify

**Decision**: Coolify for production deployment via Docker
**Approach**:
- Backend API: Docker container (Node.js)
- PostgreSQL: Managed by Coolify (or Docker container)
- MinIO: Docker container on Coolify
- Admin panel: Static build served by Nginx container (or Coolify static hosting)
- Mobile app: Built and distributed via Expo EAS (separate from Coolify)

**Rationale**: Self-hosted PaaS, no cloud vendor lock-in. Supports Docker Compose deployments. Built-in SSL, reverse proxy, and deployment automation.
**Alternatives considered**:
- Railway/Render: SaaS cost, external dependency
- Raw Docker on VPS: More manual ops work
- Kubernetes: Overkill for PoC

---

## 12. Multi-Tenancy (Future-Proofing)

**Decision**: Single database, `buildingId` foreign key on all tenant-scoped tables
**Rationale**: Simplest for PoC, sufficient for 1-50 buildings. API middleware enforces tenant isolation based on JWT claims.
**Scaling path**:
1. PoC (1 building): `buildingId` on all rows, enforced in queries
2. Growth (2-10): Same architecture, add building management
3. Scale (10-50): Row-level security policies in PostgreSQL
4. Large (50+): Schema-per-tenant or separate databases
**Alternatives considered**:
- Schema-per-tenant: Operational overhead, unnecessary for PoC
- Separate databases: Even more overhead

---

## 13. Data Privacy

**Decision**: Separate public/private user fields + bcrypt passwords + minimal disclosure
**Implementation**:
- Public fields (visible to building residents): displayName, avatarUrl
- Private fields (owner + admin only): email, phone, unitNumber, fullName
- API never returns private fields unless authorized
- "Delete My Account" endpoint cascades deletion
- Privacy policy required at signup (Chilean Ley 19.628 compliance)
**Alternatives considered**:
- Separate tables for public/private: Adds joins, column-level API filtering is simpler

---

## 14. Content Moderation

**Decision**: Reactive moderation — user reports + admin panel review
**Design**:
- Report button on all content items
- `reports` table: contentId, contentType, reportedBy, reason, status
- Auto-hide after 3 reports from different users (database trigger or API check)
- Admin panel shows pending reports
- Admin can: remove content, warn user, block user
- User-to-user blocking (required by Apple App Store for UGC apps)
**Alternatives considered**:
- Automated NLP moderation: Overkill for small community PoC

---

## 15. TypeScript Configuration

**Decision**: Extend `expo/tsconfig.base` with strict mode (mobile); standard strict tsconfig (backend)
**Mobile** (`tsconfig.json`):
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```
**Backend** (`api/tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

---

## Summary: Recommended Stack for PoC

| Layer | Choice | Key Package |
|---|---|---|
| Mobile framework | Expo (CNG) | `expo`, `expo-dev-client` |
| Navigation | Expo Router | `expo-router` |
| Backend | Node.js + Express | `express`, `cors`, `helmet` |
| ORM | Prisma | `prisma`, `@prisma/client` |
| Database | PostgreSQL 16 | via Docker |
| Auth | JWT + Passport.js | `passport`, `passport-jwt`, `bcrypt`, `jsonwebtoken` |
| File storage | MinIO (S3-compatible) | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| API docs | Swagger/OpenAPI | `swagger-jsdoc`, `swagger-ui-express` |
| Data fetching | TanStack Query | `@tanstack/react-query` |
| Offline cache | AsyncStorage persister | `@tanstack/query-async-storage-persister` |
| Image picking | expo-image-picker | `expo-image-picker` |
| Image compression | expo-image-manipulator | `expo-image-manipulator` |
| Image display | expo-image | `expo-image` |
| Push notifications | FCM + expo-notifications | `firebase-admin` (backend), `expo-notifications` (mobile) |
| Admin panel | Vite + React | `react`, `vite`, `shadcn/ui` |
| Local dev | Docker Compose | PostgreSQL + MinIO + API |
| Deployment | Coolify | Docker containers |
| Language | TypeScript (strict) | `typescript` |
