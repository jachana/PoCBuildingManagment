# REST API Contract

**Date**: 2026-03-06 | **Base URL**: `/api/v1`
**Auth**: Bearer JWT in `Authorization` header
**Content-Type**: `application/json`

---

## Authentication

### POST /auth/register

Register a new user (pending approval).

**Body**:
```json
{
  "email": "string",
  "password": "string (min 8 chars)",
  "fullName": "string",
  "displayName": "string",
  "unitNumber": "string",
  "buildingId": "uuid",
  "phone": "string? (optional)"
}
```

**Response** `201`:
```json
{
  "id": "uuid",
  "email": "string",
  "displayName": "string",
  "role": "PENDING",
  "approved": false
}
```

**Errors**: `400` validation, `409` email already exists

---

### POST /auth/login

Authenticate and receive tokens.

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** `200`:
```json
{
  "accessToken": "jwt (15 min)",
  "refreshToken": "jwt (7 days)",
  "user": {
    "id": "uuid",
    "displayName": "string",
    "role": "string",
    "approved": true,
    "buildingId": "uuid"
  }
}
```

**Errors**: `401` invalid credentials, `403` account not approved / blocked

---

### POST /auth/refresh

Refresh access token.

**Body**:
```json
{
  "refreshToken": "string"
}
```

**Response** `200`:
```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

---

## Users

### GET /users/me

Get current user profile (all fields).

**Auth**: Required
**Response** `200`: Full user object including private fields

---

### GET /users

List users in same building (public fields only).

**Auth**: Required (approved)
**Query**: `?page=1&limit=20`
**Response** `200`:
```json
{
  "data": [{ "id", "displayName", "avatarUrl" }],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

---

### PATCH /users/me

Update own profile.

**Auth**: Required
**Body** (partial):
```json
{
  "displayName": "string?",
  "phone": "string?",
  "avatarUrl": "string?"
}
```

**Response** `200`: Updated user

---

### DELETE /users/me

Delete own account and cascade all data.

**Auth**: Required
**Response** `204`

---

## Marketplace Posts

### GET /posts

List marketplace posts for user's building.

**Auth**: Required (approved)
**Query**: `?page=1&limit=20&category=FURNITURE&status=ACTIVE&sort=createdAt:desc`
**Response** `200`:
```json
{
  "data": [{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "price": 50000,
    "currency": "CLP",
    "category": "FURNITURE",
    "images": ["presigned-url-1", "presigned-url-2"],
    "status": "ACTIVE",
    "author": { "id", "displayName", "avatarUrl" },
    "createdAt": "iso-date"
  }],
  "total": 120,
  "page": 1,
  "limit": 20
}
```

Note: `images` are returned as presigned GET URLs, not raw keys.

---

### GET /posts/:id

Get single post detail.

**Auth**: Required (approved, same building)
**Response** `200`: Full post object

---

### POST /posts

Create marketplace post.

**Auth**: Required (approved)
**Body**:
```json
{
  "title": "string (1-100)",
  "description": "string (1-1000)",
  "price": 50000,
  "category": "FURNITURE",
  "images": ["object-key-1", "object-key-2"]
}
```

**Response** `201`: Created post
**Errors**: `400` validation, `403` post limit reached

---

### PATCH /posts/:id

Update own post (or admin moderation).

**Auth**: Required (owner or admin)
**Body** (partial):
```json
{
  "title": "string?",
  "description": "string?",
  "price": "number?",
  "category": "string?",
  "status": "SOLD?"
}
```

**Response** `200`: Updated post

---

### DELETE /posts/:id

Remove post (admin only).

**Auth**: Required (admin)
**Response** `204`

---

## Recommendations

### GET /recommendations

List recommendations for user's building.

**Auth**: Required (approved)
**Query**: `?page=1&limit=20&category=ELECTRICIAN&sort=rating:desc`
**Response** `200`: Paginated list

---

### POST /recommendations

Create recommendation.

**Auth**: Required (approved)
**Body**:
```json
{
  "serviceName": "string (1-100)",
  "category": "ELECTRICIAN",
  "rating": 4,
  "comment": "string (1-500)",
  "contactInfo": "string? (optional)"
}
```

**Response** `201`: Created recommendation

---

### PATCH /recommendations/:id

Update own recommendation (or admin).

**Auth**: Required (owner or admin)
**Response** `200`: Updated recommendation

---

## Entrepreneur Profiles

### GET /entrepreneurs

List active entrepreneur profiles for user's building.

**Auth**: Required (approved)
**Query**: `?page=1&limit=20&category=LEGAL`
**Response** `200`: Paginated list

---

### GET /entrepreneurs/:id

Get single entrepreneur profile.

**Auth**: Required (approved, same building)
**Response** `200`: Full profile

---

### POST /entrepreneurs

Create own entrepreneur profile (one per user).

**Auth**: Required (approved)
**Body**:
```json
{
  "profession": "string",
  "category": "LEGAL",
  "description": "string (1-1000)",
  "contactInfo": "string",
  "avatarUrl": "string?",
  "residentDiscount": "string?"
}
```

**Response** `201`: Created profile
**Errors**: `409` already has a profile

---

### PATCH /entrepreneurs/:id

Update own profile.

**Auth**: Required (owner or admin)
**Response** `200`: Updated profile

---

### DELETE /entrepreneurs/:id

Delete own profile (or admin).

**Auth**: Required (owner or admin)
**Response** `204`

---

## Reports

### POST /reports

Report content.

**Auth**: Required (approved)
**Body**:
```json
{
  "contentType": "POST|RECOMMENDATION|ENTREPRENEUR",
  "contentId": "uuid",
  "reason": "INAPPROPRIATE|SPAM|WRONG_CATEGORY|SCAM|OTHER",
  "description": "string? (max 500)"
}
```

**Response** `201`: Created report
**Side effect**: Increments `reportCount` on target. If >= 3, sets `hidden: true`.

---

## User Blocking

### POST /blocks

Block a user.

**Auth**: Required (approved)
**Body**: `{ "userId": "uuid" }`
**Response** `201`

---

### DELETE /blocks/:userId

Unblock a user.

**Auth**: Required
**Response** `204`

---

### GET /blocks

List blocked users.

**Auth**: Required
**Response** `200`: Array of blocked user IDs

---

## File Uploads

### POST /uploads/presign

Get presigned URL for uploading an image.

**Auth**: Required (approved)
**Body**:
```json
{
  "filename": "photo.jpg",
  "contentType": "image/jpeg",
  "context": "post|avatar|entrepreneur"
}
```

**Response** `200`:
```json
{
  "uploadUrl": "https://minio.example.com/bucket/key?X-Amz-...",
  "objectKey": "posts/uuid/photo.jpg",
  "expiresIn": 900
}
```

---

## Admin Endpoints

### GET /admin/pending-approvals

List pending user registrations.

**Auth**: Required (admin)
**Query**: `?page=1&limit=20`
**Response** `200`: Paginated list of pending users

---

### POST /admin/approve/:userId

Approve a user.

**Auth**: Required (admin)
**Response** `200`: Updated user
**Side effect**: Sets `approved: true`, `role: RESIDENT`. Sends push notification.

---

### POST /admin/reject/:userId

Reject a user registration.

**Auth**: Required (admin)
**Body**: `{ "reason": "string?" }`
**Response** `200`

---

### POST /admin/block/:userId

Block a user.

**Auth**: Required (admin)
**Response** `200`
**Side effect**: Sets `blocked: true`. Hides all user's active content.

---

### POST /admin/unblock/:userId

Unblock a user.

**Auth**: Required (admin)
**Response** `200`

---

### GET /admin/reports

List reports for moderation.

**Auth**: Required (admin)
**Query**: `?status=PENDING&page=1&limit=20`
**Response** `200`: Paginated reports with content details

---

### PATCH /admin/reports/:id

Review a report.

**Auth**: Required (admin)
**Body**: `{ "status": "REVIEWED|DISMISSED" }`
**Response** `200`
**Side effect**: If REVIEWED, may hide/remove the reported content.

---

## Common Patterns

### Pagination

All list endpoints support `?page=1&limit=20` (max limit: 50).

Response includes:
```json
{ "data": [...], "total": 100, "page": 1, "limit": 20 }
```

### Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "message": "Invalid email format" }]
  }
}
```

### Building Scoping

All data queries are automatically scoped to the authenticated user's `buildingId` from JWT. No `buildingId` parameter needed in queries.
