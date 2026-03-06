# Backend Services Contract

**Date**: 2026-03-06

This file documents backend service logic (previously Cloud Functions, now Express route handlers + background jobs).

---

## Auth Lifecycle

### Registration (POST /auth/register)

1. Validate input (email format, password strength, required fields)
2. Check email uniqueness
3. Hash password with bcrypt (cost 12)
4. Create user with `role: PENDING`, `approved: false`
5. Return user (without password hash)
6. (Optional) Send notification to building admins

### Login (POST /auth/login)

1. Find user by email
2. Verify password with bcrypt
3. Reject if `approved === false` (403: "Account pending approval")
4. Reject if `blocked === true` (403: "Account blocked")
5. Generate access token (15 min) + refresh token (7 days)
6. Store refresh token hash in database
7. Return tokens + user info

### Token Refresh (POST /auth/refresh)

1. Verify refresh token signature
2. Check token exists in database (not revoked)
3. Issue new access + refresh token pair
4. Revoke old refresh token (rotation)

---

## Admin Actions

### Approve User (POST /admin/approve/:userId)

1. Verify caller is admin
2. Find user in PENDING status
3. Set `approved: true`, `role: RESIDENT`
4. Send push notification to user ("Your account has been approved")

### Reject User (POST /admin/reject/:userId)

1. Verify caller is admin
2. Update user status (keep record, don't delete)
3. Optional: send email notification with reason

### Block User (POST /admin/block/:userId)

1. Verify caller is admin
2. Set `blocked: true` on user
3. Set `hidden: true` on all user's active posts, recommendations, entrepreneur profile
4. Revoke all refresh tokens for the user
5. Send push notification ("Your account has been suspended")

### Unblock User (POST /admin/unblock/:userId)

1. Verify caller is admin
2. Set `blocked: false`
3. Unhide user's content that was hidden by the block action

---

## Content Moderation

### On Report Create (POST /reports)

1. Validate reporter is not reporting own content
2. Create report record
3. Increment `reportCount` on target content
4. If `reportCount >= 3`: set `hidden: true` on content
5. Send push notification to building admins ("New report requires review")

### On Report Review (PATCH /admin/reports/:id)

- If `REVIEWED`: admin decides to keep content hidden or remove it entirely
- If `DISMISSED`: decrement `reportCount`, unhide if it was auto-hidden

---

## Post Lifecycle

### On Post Status Change

- `ACTIVE -> SOLD`: decrement author's `activePostCount`
- `ACTIVE -> REMOVED`: decrement author's `activePostCount`
- Content restored to `ACTIVE`: increment `activePostCount`
- Enforce `activePostCount < building.maxPostsPerUser` on create

---

## Background Jobs (Cron)

### Expire Stale Posts

- **Schedule**: Daily at 03:00 UTC
- **Logic**: Find posts where `status = ACTIVE` and `createdAt < 90 days ago`
- **Action**: Set `status: EXPIRED`, decrement author's `activePostCount`
- **Implementation**: Node.js cron job (node-cron) running in the API process, or separate worker container

---

## Push Notification Events

| Event | Recipients | Message |
|-------|-----------|---------|
| User approved | Approved user | "Your account has been approved. Welcome!" |
| User blocked | Blocked user | "Your account has been suspended" |
| New report | Building admins | "New report on {contentType} requires review" |
| Content auto-hidden | Content author | "Your {contentType} has been temporarily hidden" |
| Content removed | Content author | "Your {contentType} has been removed by admin" |

**Implementation**: `firebase-admin` SDK on the backend sends FCM messages using device tokens stored in `device_tokens` table. This is the only Firebase dependency.
