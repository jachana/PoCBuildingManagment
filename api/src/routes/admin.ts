import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { parsePagination, formatPaginatedResponse } from '../lib/pagination.js';
import { ReportStatus } from '@prisma/client';

const router = Router();

// GET /admin/pending-approvals
router.get('/pending-approvals', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const where = { role: 'PENDING' as const, approved: false };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, email: true, displayName: true, fullName: true,
          unitNumber: true, phone: true, buildingId: true, createdAt: true,
        },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);
    res.json(formatPaginatedResponse(users, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

// POST /admin/approve/:userId
router.post('/approve/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    if (user.approved) throw new AppError(400, 'VALIDATION_ERROR', 'User already approved');

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { approved: true, role: 'RESIDENT' },
      select: { id: true, email: true, displayName: true, role: true, approved: true },
    });
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /admin/reject/:userId
router.post('/reject/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User rejected and removed' });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /admin/block/:userId
router.post('/block/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');

    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { blocked: true } }),
      prisma.post.updateMany({ where: { authorId: userId, status: 'ACTIVE' }, data: { hidden: true } }),
      prisma.recommendation.updateMany({ where: { authorId: userId }, data: { hidden: true } }),
      prisma.entrepreneurProfile.updateMany({ where: { userId: userId }, data: { hidden: true } }),
      prisma.refreshToken.deleteMany({ where: { userId: userId } }),
    ]);
    res.json({ message: 'User blocked' });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /admin/unblock/:userId
router.post('/unblock/:userId', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { blocked: false } }),
      prisma.post.updateMany({ where: { authorId: userId }, data: { hidden: false } }),
      prisma.recommendation.updateMany({ where: { authorId: userId }, data: { hidden: false } }),
      prisma.entrepreneurProfile.updateMany({ where: { userId: userId }, data: { hidden: false } }),
    ]);
    res.json({ message: 'User unblocked' });
  } catch (err) {
    handleError(res, err);
  }
});

// GET /admin/reports
router.get('/reports', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const status = req.query.status as ReportStatus | undefined;
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reportedBy: { select: { id: true, displayName: true } },
          post: { select: { id: true, title: true, authorId: true } },
          recommendation: { select: { id: true, serviceName: true, authorId: true } },
          entrepreneur: { select: { id: true, profession: true, userId: true } },
        },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.count({ where }),
    ]);
    res.json(formatPaginatedResponse(reports, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

const reviewSchema = z.object({
  status: z.enum(['REVIEWED', 'DISMISSED']),
});

// PATCH /admin/reports/:id
router.patch('/reports/:id', requireAuth, requireAdmin, validate(reviewSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) throw new AppError(404, 'NOT_FOUND', 'Report not found');

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status: req.body.status,
        reviewedById: req.user!.id,
        reviewedAt: new Date(),
      },
    });

    // If dismissed, decrement reportCount and potentially unhide
    if (req.body.status === 'DISMISSED') {
      if (report.contentType === 'POST' && report.postId) {
        const post = await prisma.post.update({
          where: { id: report.postId },
          data: { reportCount: { decrement: 1 } },
        });
        if (post.reportCount < 3 && post.hidden) {
          await prisma.post.update({ where: { id: report.postId }, data: { hidden: false } });
        }
      } else if (report.contentType === 'RECOMMENDATION' && report.recommendationId) {
        const rec = await prisma.recommendation.update({
          where: { id: report.recommendationId },
          data: { reportCount: { decrement: 1 } },
        });
        if (rec.reportCount < 3 && rec.hidden) {
          await prisma.recommendation.update({ where: { id: report.recommendationId }, data: { hidden: false } });
        }
      } else if (report.contentType === 'ENTREPRENEUR' && report.entrepreneurId) {
        const ent = await prisma.entrepreneurProfile.update({
          where: { id: report.entrepreneurId },
          data: { reportCount: { decrement: 1 } },
        });
        if (ent.reportCount < 3 && ent.hidden) {
          await prisma.entrepreneurProfile.update({ where: { id: report.entrepreneurId }, data: { hidden: false } });
        }
      }
    }

    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
