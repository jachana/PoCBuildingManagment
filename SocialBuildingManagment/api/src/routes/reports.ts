import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { ContentType, ReportReason } from '@prisma/client';

const createReportSchema = z.object({
  contentType: z.nativeEnum(ContentType),
  contentId: z.string().uuid(),
  reason: z.nativeEnum(ReportReason),
  description: z.string().max(500).optional(),
});

const router = Router();

router.post('/', requireAuth, requireApproved, validate(createReportSchema), async (req: Request, res: Response) => {
  try {
    const { contentType, contentId, reason, description } = req.body;

    // Verify content exists and reporter is not the owner
    let ownerId: string | null = null;
    if (contentType === 'POST') {
      const post = await prisma.post.findUnique({ where: { id: contentId } });
      if (!post) throw new AppError(404, 'NOT_FOUND', 'Content not found');
      ownerId = post.authorId;
    } else if (contentType === 'RECOMMENDATION') {
      const rec = await prisma.recommendation.findUnique({ where: { id: contentId } });
      if (!rec) throw new AppError(404, 'NOT_FOUND', 'Content not found');
      ownerId = rec.authorId;
    } else if (contentType === 'ENTREPRENEUR') {
      const ent = await prisma.entrepreneurProfile.findUnique({ where: { id: contentId } });
      if (!ent) throw new AppError(404, 'NOT_FOUND', 'Content not found');
      ownerId = ent.userId;
    }

    if (ownerId === req.user!.id) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Cannot report your own content');
    }

    const report = await prisma.report.create({
      data: {
        reason,
        description,
        contentType,
        reportedById: req.user!.id,
        ...(contentType === 'POST' && { postId: contentId }),
        ...(contentType === 'RECOMMENDATION' && { recommendationId: contentId }),
        ...(contentType === 'ENTREPRENEUR' && { entrepreneurId: contentId }),
      },
    });

    // Increment reportCount and auto-hide if >= 3
    if (contentType === 'POST') {
      const updated = await prisma.post.update({
        where: { id: contentId },
        data: { reportCount: { increment: 1 } },
      });
      if (updated.reportCount >= 3) {
        await prisma.post.update({ where: { id: contentId }, data: { hidden: true } });
      }
    } else if (contentType === 'RECOMMENDATION') {
      const updated = await prisma.recommendation.update({
        where: { id: contentId },
        data: { reportCount: { increment: 1 } },
      });
      if (updated.reportCount >= 3) {
        await prisma.recommendation.update({ where: { id: contentId }, data: { hidden: true } });
      }
    } else if (contentType === 'ENTREPRENEUR') {
      const updated = await prisma.entrepreneurProfile.update({
        where: { id: contentId },
        data: { reportCount: { increment: 1 } },
      });
      if (updated.reportCount >= 3) {
        await prisma.entrepreneurProfile.update({ where: { id: contentId }, data: { hidden: true } });
      }
    }

    res.status(201).json(report);
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
