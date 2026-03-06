# Data Model: SocialBuildingManagment PoC

**Date**: 2026-03-06 | **Spec**: specs/main/spec.md
**Database**: PostgreSQL 16 | **ORM**: Prisma

---

## Entity Relationship Overview

```
Building 1──* User
Building 1──* Post (via User.buildingId)
Building 1──* Recommendation (via User.buildingId)
Building 1──* EntrepreneurProfile (via User.buildingId)
User 1──* Post
User 1──* Recommendation
User 1──0..1 EntrepreneurProfile
User 1──* Report (as reporter)
User 1──* UserBlock (as blocker)
Post 1──* Report
Recommendation 1──* Report
EntrepreneurProfile 1──* Report
```

---

## Prisma Schema

### User

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String
  displayName     String              // First name + last initial (public)
  fullName        String              // Full legal name (private)
  phone           String?             // Phone number (private)
  unitNumber      String              // Apartment/unit (private)
  avatarUrl       String?
  role            UserRole  @default(PENDING)
  approved        Boolean   @default(false)
  blocked         Boolean   @default(false)
  activePostCount Int       @default(0)
  buildingId      String
  building        Building  @relation(fields: [buildingId], references: [id])
  posts           Post[]
  recommendations Recommendation[]
  entrepreneur    EntrepreneurProfile?
  reports         Report[]  @relation("ReportedBy")
  blockedUsers    UserBlock[] @relation("Blocker")
  blockedBy       UserBlock[] @relation("Blocked")
  deviceTokens    DeviceToken[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([buildingId])
  @@index([email])
}

enum UserRole {
  PENDING
  RESIDENT
  ADMIN
  BUILDING_MANAGER
}
```

### Building

```prisma
model Building {
  id              String   @id @default(uuid())
  name            String
  address         String
  maxPostsPerUser Int      @default(10)
  users           User[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Post (Marketplace)

```prisma
model Post {
  id          String     @id @default(uuid())
  title       String     @db.VarChar(100)
  description String     @db.VarChar(1000)
  price       Int                          // Price in CLP
  currency    String     @default("CLP")
  category    PostCategory
  images      String[]                     // MinIO object keys
  status      PostStatus @default(ACTIVE)
  reportCount Int        @default(0)
  hidden      Boolean    @default(false)
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  reports     Report[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([authorId])
  @@index([status, createdAt(sort: Desc)])
  @@index([category, createdAt(sort: Desc)])
}

enum PostCategory {
  FURNITURE
  ELECTRONICS
  HOME_APPLIANCES
  CLOTHING
  SPORTS
  BOOKS
  MOVING_ITEMS
  OTHER
}

enum PostStatus {
  ACTIVE
  SOLD
  REMOVED
  EXPIRED
}
```

**State transitions**:
```
ACTIVE -> SOLD       (author marks as sold)
ACTIVE -> REMOVED    (admin removes)
ACTIVE -> hidden     (auto: reportCount >= 3, hidden=true but status stays ACTIVE)
hidden -> unhidden   (admin reinstates, hidden=false)
ACTIVE -> EXPIRED    (cron: createdAt > 90 days)
```

### Recommendation

```prisma
model Recommendation {
  id          String                @id @default(uuid())
  serviceName String                @db.VarChar(100)
  category    RecommendationCategory
  rating      Int                               // 1-5
  comment     String                @db.VarChar(500)
  contactInfo String?
  reportCount Int                   @default(0)
  hidden      Boolean               @default(false)
  authorId    String
  author      User                  @relation(fields: [authorId], references: [id])
  reports     Report[]
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@index([authorId])
  @@index([category, createdAt(sort: Desc)])
}

enum RecommendationCategory {
  NANNY
  TRANSPORTATION
  DOG_WALKER
  DECORATOR
  ELECTRICIAN
  GARDENER
  PERSONAL_TRAINER
  PLUMBER
  CLEANER
  OTHER
}
```

**Validation rules**:
- `rating`: integer 1-5
- `serviceName`: length 1-100
- `comment`: length 1-500

### EntrepreneurProfile

```prisma
model EntrepreneurProfile {
  id               String              @id @default(uuid())
  profession       String
  category         EntrepreneurCategory
  description      String              @db.VarChar(1000)
  contactInfo      String
  avatarUrl        String?
  residentDiscount String?
  active           Boolean             @default(true)
  reportCount      Int                 @default(0)
  hidden           Boolean             @default(false)
  userId           String              @unique        // One profile per user
  user             User                @relation(fields: [userId], references: [id])
  reports          Report[]
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt
}

enum EntrepreneurCategory {
  LEGAL
  HEALTH
  DESIGN
  COACHING
  PHOTOGRAPHY
  EDUCATION
  TECHNOLOGY
  BEAUTY
  FITNESS
  OTHER
}
```

### Report

```prisma
model Report {
  id              String       @id @default(uuid())
  reason          ReportReason
  description     String?      @db.VarChar(500)
  status          ReportStatus @default(PENDING)
  contentType     ContentType
  postId          String?
  post            Post?        @relation(fields: [postId], references: [id])
  recommendationId String?
  recommendation  Recommendation? @relation(fields: [recommendationId], references: [id])
  entrepreneurId  String?
  entrepreneur    EntrepreneurProfile? @relation(fields: [entrepreneurId], references: [id])
  reportedById    String
  reportedBy      User         @relation("ReportedBy", fields: [reportedById], references: [id])
  reviewedById    String?
  reviewedAt      DateTime?
  createdAt       DateTime     @default(now())

  @@index([status, createdAt])
  @@index([contentType, status])
}

enum ReportReason {
  INAPPROPRIATE
  SPAM
  WRONG_CATEGORY
  SCAM
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWED
  DISMISSED
}

enum ContentType {
  POST
  RECOMMENDATION
  ENTREPRENEUR
}
```

### UserBlock

```prisma
model UserBlock {
  id        String   @id @default(uuid())
  blockerId String
  blocker   User     @relation("Blocker", fields: [blockerId], references: [id])
  blockedId String
  blocked   User     @relation("Blocked", fields: [blockedId], references: [id])
  createdAt DateTime @default(now())

  @@unique([blockerId, blockedId])
  @@index([blockerId])
  @@index([blockedId])
}
```

### DeviceToken (for push notifications)

```prisma
model DeviceToken {
  id        String   @id @default(uuid())
  token     String   @unique
  platform  String               // "ios" | "android"
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([userId])
}
```

---

## API Authorization Matrix

Queries are scoped by `buildingId` derived from the authenticated user's JWT.

| Resource | List | Read | Create | Update | Delete |
|----------|------|------|--------|--------|--------|
| Building | own only | own only | admin | admin | admin |
| User (public) | same building | same building | self (register) | self or admin | admin |
| User (private fields) | - | self or admin | self | self | - |
| Post | same building, !hidden | same building, !hidden | self (approved) | self or admin | admin |
| Recommendation | same building, !hidden | same building, !hidden | self (approved) | self or admin | admin |
| EntrepreneurProfile | same building, !hidden | same building, !hidden | self (1 per user) | self or admin | self or admin |
| Report | admin only | admin only | any approved | admin | never |
| UserBlock | - | - | self | - | self |
