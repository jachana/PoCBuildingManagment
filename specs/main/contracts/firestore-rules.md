# Security & Authorization Contract

**Date**: 2026-03-06

This file replaces the previous Firestore rules with PostgreSQL + API-level authorization.

---

## JWT Token Structure

```typescript
interface JwtPayload {
  sub: string;          // user UUID
  role: 'PENDING' | 'RESIDENT' | 'ADMIN' | 'BUILDING_MANAGER';
  buildingId: string;   // building UUID
  iat: number;
  exp: number;
}
```

- Access token: 15 min expiry
- Refresh token: 7 days expiry, stored in `refresh_tokens` table

---

## API Middleware Authorization

### `requireAuth`
Verifies valid JWT. Rejects if missing/expired/invalid.

### `requireApproved`
Extends `requireAuth`. Rejects if `user.approved !== true` or `user.blocked === true`.

### `requireAdmin`
Extends `requireApproved`. Rejects if `role !== 'ADMIN'`.

### `requireBuildingManager`
Extends `requireApproved`. Rejects if `role` not in `['ADMIN', 'BUILDING_MANAGER']`.

### `scopeToBuilding`
Automatically injects `WHERE building_id = :buildingId` (from JWT) into all data queries. Prevents cross-building data access.

### `requireOwnerOrAdmin`
For update/delete operations. Checks resource `authorId`/`userId` matches JWT `sub`, or caller is admin.

---

## Password Policy

- Minimum 8 characters
- Hashed with bcrypt (cost factor 12)
- Refresh tokens revoked on password change

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| POST /auth/login | 5 per minute per IP |
| POST /auth/register | 3 per hour per IP |
| POST /uploads/presign | 20 per hour per user |
| All other endpoints | 100 per minute per user |

---

## MinIO Storage Rules

| Bucket/Prefix | Max Size | Allowed Types | Access |
|---------------|----------|---------------|--------|
| `posts/*` | 5 MB | image/jpeg, image/png, image/webp | Presigned URL (15 min) |
| `avatars/*` | 2 MB | image/jpeg, image/png, image/webp | Presigned URL (15 min) |
| `entrepreneurs/*` | 5 MB | image/jpeg, image/png, image/webp | Presigned URL (15 min) |

Upload validation happens at presign time (backend checks context and content type).
Read access via presigned GET URLs generated on demand (1 hour expiry).
