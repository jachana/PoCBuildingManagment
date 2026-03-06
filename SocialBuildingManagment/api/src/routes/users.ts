import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { parsePagination, formatPaginatedResponse } from '../lib/pagination.js';

const updateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

const router = Router();

// GET /users/me - Full profile (private fields)
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, displayName: true, fullName: true,
        phone: true, unitNumber: true, avatarUrl: true, role: true,
        approved: true, buildingId: true, activePostCount: true,
        createdAt: true,
      },
    });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// PATCH /users/me - Update own profile
router.patch('/me', requireAuth, validate(updateUserSchema), async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: req.body,
      select: {
        id: true, email: true, displayName: true, fullName: true,
        phone: true, unitNumber: true, avatarUrl: true, role: true,
        approved: true, buildingId: true, createdAt: true,
      },
    });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /users/me - Delete own account
router.delete('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.$transaction([
      prisma.report.deleteMany({ where: { reportedById: req.user!.id } }),
      prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: req.user!.id }, { blockedId: req.user!.id }] } }),
      prisma.refreshToken.deleteMany({ where: { userId: req.user!.id } }),
      prisma.deviceToken.deleteMany({ where: { userId: req.user!.id } }),
      prisma.post.updateMany({ where: { authorId: req.user!.id }, data: { status: 'REMOVED' } }),
      prisma.entrepreneurProfile.deleteMany({ where: { userId: req.user!.id } }),
      prisma.recommendation.deleteMany({ where: { authorId: req.user!.id } }),
      prisma.user.delete({ where: { id: req.user!.id } }),
    ]);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

// GET /users - List building users (public fields)
router.get('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const where = { buildingId: req.user!.buildingId, approved: true, blocked: false };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, displayName: true, avatarUrl: true },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { displayName: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);
    res.json(formatPaginatedResponse(users, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
