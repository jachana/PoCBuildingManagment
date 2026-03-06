# Tasks: Plataforma Digital Comunidad Residencial Premium

**Input**: Design documents from `/specs/main/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in specification. Test tasks omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## User Stories (from spec)

- **US1**: Marketplace interno (buy/sell between residents) — P1
- **US2**: Recomendaciones de servicios (service recommendations with ratings) — P2
- **US3**: Emprendedores residentes (resident entrepreneur profiles) — P2
- **US4**: Moderacion y admin panel (reports, blocking, admin dashboard) — P3

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project scaffolding, Docker Compose, and dependency installation

- [x] T001 Create monorepo root structure with `package.json` at `SocialBuildingManagment/package.json`
- [x] T002 Create Docker Compose file with PostgreSQL 16, MinIO, and MailHog services at `SocialBuildingManagment/docker-compose.yml`
- [x] T003 [P] Initialize Expo project with TypeScript template, install expo-router, expo-dev-client, expo-image, expo-image-picker, expo-image-manipulator, expo-notifications, @tanstack/react-query, @tanstack/query-async-storage-persister, expo-secure-store, zod at `SocialBuildingManagment/package.json`
- [x] T004 [P] Initialize API backend project with Express, Prisma, bcrypt, jsonwebtoken, passport, passport-jwt, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, zod, cors, helmet, express-rate-limit, node-cron, swagger-jsdoc, swagger-ui-express at `api/package.json`
- [x] T005 [P] Initialize admin panel project with Vite, React, TypeScript, @tanstack/react-query, shadcn/ui setup at `admin/package.json`
- [x] T006 [P] Configure TypeScript for mobile app extending expo/tsconfig.base with strict mode and path aliases at `SocialBuildingManagment/tsconfig.json`
- [x] T007 [P] Configure TypeScript for API backend with strict mode, ES2022 target, NodeNext modules at `api/tsconfig.json`
- [x] T008 [P] Create `.env.example` files for API (`api/.env.example`), mobile (`SocialBuildingManagment/.env.example`), and admin (`admin/.env.example`) with all required environment variables per quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database & ORM

- [x] T009 Write full Prisma schema with all models (User, Building, Post, Recommendation, EntrepreneurProfile, Report, UserBlock, DeviceToken) and enums per data-model.md at `api/prisma/schema.prisma`
- [ ] T010 Create initial Prisma migration and verify it runs against Docker PostgreSQL at `api/prisma/migrations/`
- [x] T011 Create seed script with one Building, one Admin user (approved, ADMIN role), and one Resident user (approved) at `api/prisma/seed.ts`
- [x] T012 Create Prisma client singleton at `api/src/lib/prisma.ts`

### API Server Core

- [x] T013 Create Express app entry point with cors, helmet, JSON body parser, error handler, and Swagger UI mount at `api/src/index.ts`
- [x] T014 [P] Implement JWT utility: generateAccessToken, generateRefreshToken, verifyToken using jsonwebtoken at `api/src/lib/jwt.ts`
- [x] T015 [P] Implement auth middleware: requireAuth (verify JWT, attach user to req), requireApproved (check approved+unblocked), requireAdmin (check ADMIN role), scopeToBuilding (extract buildingId from JWT) at `api/src/middleware/auth.ts`
- [x] T016 [P] Implement authorization middleware: requireOwnerOrAdmin (compare resource authorId/userId with JWT sub) at `api/src/middleware/authorize.ts`
- [x] T017 [P] Implement request validation middleware using zod schemas with standard error format at `api/src/middleware/validate.ts`
- [x] T018 [P] Implement rate limiting middleware per security contract (5/min login, 3/hr register, 100/min general) at `api/src/middleware/rateLimit.ts`
- [x] T019 [P] Implement pagination utility: parsePagination (page, limit with max 50), formatPaginatedResponse at `api/src/lib/pagination.ts`
- [x] T020 [P] Implement standard error response utility matching API error format contract at `api/src/lib/errors.ts`

### Authentication Routes

- [x] T021 Implement POST /auth/register route: validate input (zod), check email uniqueness, hash password (bcrypt cost 12), create user with PENDING role, return user without passwordHash at `api/src/routes/auth.ts`
- [x] T022 Implement POST /auth/login route: find by email, verify bcrypt, reject if not approved/blocked (403), generate access+refresh tokens, return tokens+user at `api/src/routes/auth.ts`
- [x] T023 Implement POST /auth/refresh route: verify refresh token, issue new token pair, revoke old at `api/src/routes/auth.ts`
- [x] T024 Implement GET /users/me, PATCH /users/me, DELETE /users/me routes with private field handling per authorization matrix at `api/src/routes/users.ts`
- [x] T025 Implement GET /users route listing same-building users with public fields only (displayName, avatarUrl) with pagination at `api/src/routes/users.ts`

### File Storage

- [x] T026 Implement MinIO S3 client: initialize S3Client, createBucket (if not exists on startup), generatePresignedPutUrl, generatePresignedGetUrl with size/type validation per storage rules contract at `api/src/services/storage.ts`
- [x] T027 Implement POST /uploads/presign route: validate context (post/avatar/entrepreneur), validate contentType, generate presigned PUT URL (15 min), return uploadUrl + objectKey at `api/src/routes/uploads.ts`

### Mobile App Shell

- [x] T028 Create root layout with auth gate (redirect to login if no token) and TanStack Query provider with AsyncStorage persister at `app/_layout.tsx`
- [x] T029 [P] Create base API client with JWT token attachment from SecureStore, refresh token rotation on 401, and standard error handling at `src/services/api.ts`
- [x] T030 [P] Create auth service: register, login, refresh, logout, getToken, storeTokens using SecureStore at `src/services/auth.ts`
- [x] T031 [P] Create useAuth hook: login, register, logout mutations, currentUser query, isAuthenticated state at `src/hooks/useAuth.ts`
- [x] T032 [P] Create TypeScript model interfaces matching Prisma schema: User, Post, Recommendation, EntrepreneurProfile, Report, PaginatedResponse at `src/models/user.ts`, `src/models/post.ts`, `src/models/recommendation.ts`, `src/models/entrepreneur.ts`, `src/models/report.ts`
- [x] T033 Create login screen with email/password form, error display, link to register at `app/(auth)/login.tsx`
- [x] T034 Create register screen with email, password, fullName, displayName, unitNumber, phone fields, buildingId (hardcoded for PoC), validation with zod at `app/(auth)/register.tsx`
- [x] T035 Create tab layout with three tabs: Marketplace, Recomendaciones, Emprendedores using Expo Router tab navigator at `app/(tabs)/_layout.tsx`

### API Dockerfile

- [x] T036 Create multi-stage Dockerfile for API: build stage (npm ci, prisma generate, tsc) and run stage (node dist/index.js) at `api/Dockerfile`

**Checkpoint**: Foundation ready — auth works end-to-end (register → admin seed approves → login → JWT → protected routes). Docker Compose runs all services. Mobile app shell navigates between auth and tabs.

---

## Phase 3: User Story 1 — Marketplace Interno (Priority: P1) MVP

**Goal**: Residents can publish products for sale with images, browse listings by category, and mark items as sold.

**Independent Test**: Register user → admin approves → login → create post with images → see post in feed → filter by category → mark as sold → post disappears from active feed.

### Backend (API)

- [x] T037 [P] [US1] Create zod schemas for Post creation (title 1-100, description 1-1000, price >=0, category enum, images 1-5) and update at `api/src/routes/posts.ts`
- [x] T038 [US1] Implement GET /posts route: list posts for user's building, filter by category/status, sort by createdAt desc, paginated, replace image keys with presigned GET URLs, exclude hidden posts at `api/src/routes/posts.ts`
- [x] T039 [US1] Implement GET /posts/:id route: single post detail, verify same building, presigned image URLs at `api/src/routes/posts.ts`
- [x] T040 [US1] Implement POST /posts route: validate body, enforce activePostCount < building.maxPostsPerUser, create post, increment activePostCount, return created post at `api/src/routes/posts.ts`
- [x] T041 [US1] Implement PATCH /posts/:id route: owner can update title/description/price/category/status(SOLD), admin can update any field, decrement activePostCount on SOLD at `api/src/routes/posts.ts`
- [x] T042 [US1] Implement DELETE /posts/:id route: admin only, set status REMOVED, decrement activePostCount at `api/src/routes/posts.ts`
- [x] T043 [US1] Register posts router on Express app under /api/v1/posts with requireApproved middleware at `api/src/index.ts`

### Mobile (Posts)

- [x] T044 [P] [US1] Create posts API service: getPosts(filters, page), getPost(id), createPost(data), updatePost(id, data) at `src/services/posts.ts`
- [x] T045 [P] [US1] Create uploads API service: getPresignedUrl(filename, contentType, context), uploadImage(presignedUrl, file) at `src/services/uploads.ts`
- [x] T046 [P] [US1] Create usePosts hook: usePostsQuery (paginated, filterable), usePostQuery(id), useCreatePost mutation (optimistic), useUpdatePost mutation at `src/hooks/usePosts.ts`
- [x] T047 [P] [US1] Create ImagePicker component: pick from library/camera via expo-image-picker, compress via expo-image-manipulator (800px, 0.7 quality), return local URI at `src/components/ImagePicker.tsx`
- [x] T048 [P] [US1] Create PostCard component: expo-image for thumbnail, title, price (CLP formatted), category badge, author name, createdAt relative time at `src/components/PostCard.tsx`
- [x] T049 [P] [US1] Create CategoryFilter component: horizontal scrollable chip list for PostCategory enum, "All" option at `src/components/CategoryFilter.tsx`
- [x] T050 [US1] Create marketplace feed screen: FlatList of PostCard, CategoryFilter at top, pull-to-refresh, infinite scroll pagination at `app/(tabs)/marketplace/index.tsx`
- [x] T051 [US1] Create post detail screen: full images carousel (expo-image), title, description, price, category, author info, "Mark as Sold" button (if owner), "Report" button at `app/(tabs)/marketplace/[id].tsx`
- [x] T052 [US1] Create post creation screen: form with title, description, price (numeric input), category picker, ImagePicker (up to 5 images), upload images then submit post at `app/(tabs)/marketplace/create.tsx`

**Checkpoint**: Marketplace fully functional end-to-end. Residents can create listings with images, browse, filter by category, and mark as sold.

---

## Phase 4: User Story 2 — Recomendaciones de Servicios (Priority: P2)

**Goal**: Residents can recommend trusted service providers with ratings and browse recommendations by category.

**Independent Test**: Login → create recommendation with rating → see it in feed → filter by category → see average rating display.

### Backend (API)

- [x] T053 [P] [US2] Create zod schemas for Recommendation creation (serviceName 1-100, category enum, rating 1-5, comment 1-500, contactInfo optional) at `api/src/routes/recommendations.ts`
- [x] T054 [US2] Implement GET /recommendations route: list for user's building, filter by category, sort by createdAt or rating, paginated, exclude hidden at `api/src/routes/recommendations.ts`
- [x] T055 [US2] Implement POST /recommendations route: validate body, create recommendation at `api/src/routes/recommendations.ts`
- [x] T056 [US2] Implement PATCH /recommendations/:id route: owner or admin can update at `api/src/routes/recommendations.ts`
- [x] T057 [US2] Register recommendations router on Express app under /api/v1/recommendations with requireApproved middleware at `api/src/index.ts`

### Mobile (Recommendations)

- [x] T058 [P] [US2] Create recommendations API service: getRecommendations(filters, page), createRecommendation(data), updateRecommendation(id, data) at `src/services/recommendations.ts`
- [x] T059 [P] [US2] Create useRecommendations hook: useRecommendationsQuery (paginated, filterable), useCreateRecommendation mutation at `src/hooks/useRecommendations.ts`
- [x] T060 [P] [US2] Create RatingStars component: display 1-5 stars (read-only and interactive modes) at `src/components/RatingStars.tsx`
- [x] T061 [P] [US2] Create RecommendationCard component: serviceName, category badge, RatingStars, comment preview, author name at `src/components/RecommendationCard.tsx`
- [x] T062 [US2] Create recommendations feed screen: FlatList of RecommendationCard, CategoryFilter (RecommendationCategory), pull-to-refresh, pagination at `app/(tabs)/recommendations/index.tsx`
- [x] T063 [US2] Create recommendation detail screen: full comment, rating, contact info (if provided), author, "Report" button at `app/(tabs)/recommendations/[id].tsx`
- [x] T064 [US2] Create recommendation creation screen: form with serviceName, category picker, rating stars input, comment, optional contactInfo at `app/(tabs)/recommendations/create.tsx`

**Checkpoint**: Recommendations module fully functional. Residents can create, browse, and filter service recommendations.

---

## Phase 5: User Story 3 — Emprendedores Residentes (Priority: P2)

**Goal**: Residents can create a professional profile to showcase their services to neighbors, with optional resident discount.

**Independent Test**: Login → create entrepreneur profile → see it listed → other residents can view profile detail → edit own profile → deactivate profile.

### Backend (API)

- [x] T065 [P] [US3] Create zod schemas for EntrepreneurProfile creation (profession, category enum, description 1-1000, contactInfo, avatarUrl optional, residentDiscount optional) at `api/src/routes/entrepreneurs.ts`
- [x] T066 [US3] Implement GET /entrepreneurs route: list active profiles for user's building, filter by category, paginated, exclude hidden at `api/src/routes/entrepreneurs.ts`
- [x] T067 [US3] Implement GET /entrepreneurs/:id route: single profile detail at `api/src/routes/entrepreneurs.ts`
- [x] T068 [US3] Implement POST /entrepreneurs route: validate body, enforce one profile per user (409 if exists), create profile at `api/src/routes/entrepreneurs.ts`
- [x] T069 [US3] Implement PATCH /entrepreneurs/:id route: owner or admin update, including active toggle at `api/src/routes/entrepreneurs.ts`
- [x] T070 [US3] Implement DELETE /entrepreneurs/:id route: owner or admin at `api/src/routes/entrepreneurs.ts`
- [x] T071 [US3] Register entrepreneurs router on Express app under /api/v1/entrepreneurs with requireApproved middleware at `api/src/index.ts`

### Mobile (Entrepreneurs)

- [x] T072 [P] [US3] Create entrepreneurs API service: getEntrepreneurs(filters, page), getEntrepreneur(id), createProfile(data), updateProfile(id, data), deleteProfile(id) at `src/services/entrepreneurs.ts`
- [x] T073 [P] [US3] Create useEntrepreneurs hook: useEntrepreneursQuery, useEntrepreneurQuery(id), useCreateProfile, useUpdateProfile, useDeleteProfile at `src/hooks/useEntrepreneurs.ts`
- [x] T074 [P] [US3] Create EntrepreneurCard component: displayName, profession, category badge, description preview, resident discount badge (if set) at `src/components/EntrepreneurCard.tsx`
- [x] T075 [US3] Create entrepreneurs list screen: FlatList of EntrepreneurCard, CategoryFilter (EntrepreneurCategory), pagination at `app/(tabs)/entrepreneurs/index.tsx`
- [x] T076 [US3] Create entrepreneur detail screen: full profile with avatar (expo-image), profession, description, contact info, discount info, "Report" button at `app/(tabs)/entrepreneurs/[id].tsx`
- [x] T077 [US3] Create entrepreneur edit screen: form to create or update own profile, avatar upload via ImagePicker, all fields from schema at `app/(tabs)/entrepreneurs/edit.tsx`

**Checkpoint**: Entrepreneur profiles fully functional. Residents can create, view, edit, and deactivate their professional profiles.

---

## Phase 6: User Story 4 — Moderacion y Admin Panel (Priority: P3)

**Goal**: Content reporting system for residents, user blocking, and a web admin panel for building administrators to manage approvals, reports, users, and content.

**Independent Test**: (Mobile) Report a post → post auto-hides after 3 reports → block a user. (Admin) Login to web panel → approve pending user → review report → remove content → block user.

### Backend — Reports & Blocking

- [x] T078 [P] [US4] Create zod schemas for Report creation (contentType, contentId, reason enum, description optional) at `api/src/routes/reports.ts`
- [x] T079 [US4] Implement POST /reports route: validate reporter not reporting own content, create report, increment reportCount on target, auto-hide if reportCount >= 3 at `api/src/routes/reports.ts`
- [x] T080 [P] [US4] Implement POST /blocks, DELETE /blocks/:userId, GET /blocks routes for user-to-user blocking at `api/src/routes/blocks.ts`
- [x] T081 [US4] Update GET /posts, GET /recommendations, GET /entrepreneurs queries to exclude content from blocked users (filter by UserBlock) at `api/src/routes/posts.ts`, `api/src/routes/recommendations.ts`, `api/src/routes/entrepreneurs.ts`
- [x] T082 [US4] Register reports and blocks routers on Express app at `api/src/index.ts`

### Backend — Admin Routes

- [x] T083 [P] [US4] Implement GET /admin/pending-approvals route: list users with role=PENDING, paginated at `api/src/routes/admin.ts`
- [x] T084 [US4] Implement POST /admin/approve/:userId route: set approved=true, role=RESIDENT at `api/src/routes/admin.ts`
- [x] T085 [US4] Implement POST /admin/reject/:userId route: update user record at `api/src/routes/admin.ts`
- [x] T086 [US4] Implement POST /admin/block/:userId and POST /admin/unblock/:userId routes: set blocked flag, hide/unhide user content, revoke refresh tokens at `api/src/routes/admin.ts`
- [x] T087 [US4] Implement GET /admin/reports route: list reports with content details, filter by status, paginated at `api/src/routes/admin.ts`
- [x] T088 [US4] Implement PATCH /admin/reports/:id route: review or dismiss report, update content hidden/removed status accordingly at `api/src/routes/admin.ts`
- [x] T089 [US4] Register admin router on Express app under /api/v1/admin with requireAdmin middleware at `api/src/index.ts`

### Mobile — Reporting & Blocking

- [x] T090 [P] [US4] Create report modal screen: select reason (enum picker), optional description, submit report at `app/report.tsx`
- [x] T091 [US4] Add "Report" and "Block User" actions to PostCard, RecommendationCard, EntrepreneurCard detail screens (link to report modal) at `app/(tabs)/marketplace/[id].tsx`, `app/(tabs)/recommendations/[id].tsx`, `app/(tabs)/entrepreneurs/[id].tsx`

### Mobile — User Profile

- [x] T092 [P] [US4] Create user profile screen: display user info, list own posts/recommendations/entrepreneur profile, edit profile button at `app/profile/index.tsx`
- [x] T093 [US4] Create settings screen: edit displayName/phone/avatar, "Delete My Account" with confirmation dialog at `app/profile/settings.tsx`

### Admin Web Panel

- [x] T094 [P] [US4] Create admin API client with JWT auth, same endpoint pattern as mobile, typed responses at `admin/src/services/api.ts`
- [x] T095 [P] [US4] Create admin login page at `admin/src/pages/Login.tsx`
- [x] T096 [P] [US4] Create admin app layout with sidebar navigation (Dashboard, Approvals, Reports, Users, Content) and auth gate at `admin/src/App.tsx`
- [x] T097 [US4] Create Pending Approvals page: table of pending users with approve/reject buttons at `admin/src/pages/PendingApprovals.tsx`
- [x] T098 [US4] Create Reports page: table of reports with content preview, review/dismiss actions at `admin/src/pages/Reports.tsx`
- [x] T099 [US4] Create Users page: table of all users with role, approved, blocked status, block/unblock actions at `admin/src/pages/Users.tsx`
- [x] T100 [US4] Create Content Management page: list all posts/recommendations/entrepreneur profiles with hide/remove actions at `admin/src/pages/ContentManagement.tsx`
- [x] T101 [US4] Create Dashboard page: summary counts (pending approvals, open reports, total users, total posts) at `admin/src/pages/Dashboard.tsx`
- [x] T102 [US4] Create admin Dockerfile: build stage (npm ci, vite build) and run stage (nginx serving dist/) at `admin/Dockerfile`

**Checkpoint**: Full moderation system and admin panel functional. Admins can manage users, review reports, and moderate content via the web panel. Residents can report content and block users on mobile.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T103 [P] Add Swagger/OpenAPI documentation annotations to all API routes using swagger-jsdoc at `api/src/routes/*.ts`
- [x] T104 [P] Implement stale post expiration cron job (daily, expire posts >90 days, decrement activePostCount) using node-cron at `api/src/jobs/expirePosts.ts`
- [x] T105 [P] Add network status indicator component (online/offline badge) to mobile app tab layout at `src/components/NetworkStatus.tsx`, `app/(tabs)/_layout.tsx`
- [x] T106 [P] Create docker-compose.prod.yml for Coolify deployment with API, PostgreSQL, MinIO, admin panel services and production environment variables at `SocialBuildingManagment/docker-compose.prod.yml`
- [ ] T107 Verify full quickstart.md flow: docker compose up, prisma migrate, seed, API start, mobile build, admin panel start at `specs/main/quickstart.md`
- [x] T108 [P] Add image compression utility wrapping expo-image-manipulator (800px max width, 0.7 JPEG quality) at `src/utils/imageCompression.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 Marketplace (Phase 3)**: Depends on Foundational (Phase 2) — No dependency on other stories
- **US2 Recommendations (Phase 4)**: Depends on Foundational (Phase 2) — No dependency on US1
- **US3 Entrepreneurs (Phase 5)**: Depends on Foundational (Phase 2) — No dependency on US1/US2
- **US4 Moderation & Admin (Phase 6)**: Depends on Foundational (Phase 2) — Reports reference Posts/Recommendations/Entrepreneurs, so ideally at least one content story is done. Blocking filter updates (T081) require the content routes to exist.
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundational)
            ├── Phase 3 (US1: Marketplace)  ──┐
            ├── Phase 4 (US2: Recommendations) ├── Phase 6 (US4: Moderation & Admin)
            └── Phase 5 (US3: Entrepreneurs) ──┘         └── Phase 7 (Polish)
```

- US1, US2, US3 can all run **in parallel** after Phase 2
- US4 (Moderation) can start backend work (T078-T089) in parallel with content stories, but T081 (blocked user filtering) and T091 (report buttons on detail screens) need the content screens to exist
- Polish (Phase 7) runs after all stories

### Within Each User Story

- Backend routes before mobile screens (mobile depends on working API)
- Zod schemas before route implementations
- API service functions before hooks
- Hooks before screens
- List screen before detail screen before create/edit screen

### Parallel Opportunities

**Phase 1** (all tasks [P] can run in parallel):
```
T003 (Expo init) | T004 (API init) | T005 (Admin init)
T006 (mobile tsconfig) | T007 (API tsconfig) | T008 (.env files)
```

**Phase 2** (after T009-T013 complete, the [P] tasks can parallelize):
```
T014 (JWT) | T015 (auth middleware) | T016 (authorize) | T017 (validate) | T018 (rate limit) | T019 (pagination) | T020 (errors)
T028 (app layout) | T029 (API client) | T030 (auth service) | T031 (useAuth) | T032 (models)
```

**Phase 3-5** (after Phase 2, all three stories can run in parallel):
```
Developer A: T037-T052 (US1 Marketplace)
Developer B: T053-T064 (US2 Recommendations)
Developer C: T065-T077 (US3 Entrepreneurs)
```

**Phase 6** (within US4, backend and admin panel work in parallel):
```
T078-T089 (backend reports/admin routes) | T094-T096 (admin panel setup)
```

---

## Implementation Strategy

### MVP First (US1 Marketplace Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 Marketplace
4. **STOP and VALIDATE**: Register → login → create post with images → browse → filter → mark sold
5. Deploy to Coolify if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 Marketplace → Test → Deploy (MVP!)
3. Add US2 Recommendations → Test → Deploy
4. Add US3 Entrepreneurs → Test → Deploy
5. Add US4 Moderation & Admin → Test → Deploy
6. Polish → Final deploy

### Suggested MVP Scope

**US1 (Marketplace) alone** is a complete, deployable product that validates the core hypothesis: will residents use a private platform to buy/sell within their building? The other modules add value but are not required to validate adoption.

---

## Summary

| Phase | Story | Tasks | Parallel |
|-------|-------|-------|----------|
| Phase 1: Setup | — | 8 | 6 |
| Phase 2: Foundational | — | 28 | 16 |
| Phase 3: US1 Marketplace | US1 | 16 | 7 |
| Phase 4: US2 Recommendations | US2 | 12 | 5 |
| Phase 5: US3 Entrepreneurs | US3 | 13 | 4 |
| Phase 6: US4 Moderation & Admin | US4 | 25 | 7 |
| Phase 7: Polish | — | 6 | 5 |
| **Total** | | **108** | **50** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in same phase
- [US#] label maps task to specific user story for traceability
- Each user story is independently completable and testable after Phase 2
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- All API routes mount under `/api/v1/` prefix
- All mobile screens use Expo Router file-based routing
- Building scoping is automatic via JWT middleware — no buildingId in client queries
