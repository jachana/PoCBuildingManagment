import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { parsePagination, formatPaginatedResponse } from '../lib/pagination.js';
import { RecommendationCategory, Prisma } from '@prisma/client';

const createSchema = z.object({
  serviceName: z.string().min(1).max(100),
  category: z.nativeEnum(RecommendationCategory),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500),
  contactInfo: z.string().optional(),
});

const updateSchema = z.object({
  serviceName: z.string().min(1).max(100).optional(),
  category: z.nativeEnum(RecommendationCategory).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(1).max(500).optional(),
  contactInfo: z.string().optional(),
});

const router = Router();

// GET /recommendations
router.get('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const { category, sort } = req.query;

    const blockedUsers = await prisma.userBlock.findMany({
      where: { blockerId: req.user!.id },
      select: { blockedId: true },
    });
    const blockedIds = blockedUsers.map((b) => b.blockedId);

    const where: Prisma.RecommendationWhereInput = {
      author: { buildingId: req.user!.buildingId },
      authorId: blockedIds.length > 0 ? { notIn: blockedIds } : undefined,
      hidden: false,
    };
    if (category) where.category = category as RecommendationCategory;

    const orderBy: Prisma.RecommendationOrderByWithRelationInput =
      sort === 'rating:desc' ? { rating: 'desc' } : { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.recommendation.findMany({
        where,
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy,
      }),
      prisma.recommendation.count({ where }),
    ]);

    res.json(formatPaginatedResponse(items, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

// GET /recommendations/:id
router.get('/:id', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.recommendation.findUnique({
      where: { id },
      include: { author: { select: { id: true, displayName: true, avatarUrl: true, buildingId: true } } },
    });
    if (!item || item.hidden) throw new AppError(404, 'NOT_FOUND', 'Recommendation not found');
    if (item.author.buildingId !== req.user!.buildingId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');

    const { buildingId: _, ...author } = item.author;
    res.json({ ...item, author });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /recommendations
router.post('/', requireAuth, requireApproved, validate(createSchema), async (req: Request, res: Response) => {
  try {
    const item = await prisma.recommendation.create({
      data: { ...req.body, authorId: req.user!.id },
      include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err);
  }
});

// PATCH /recommendations/:id
router.patch('/:id', requireAuth, requireApproved, validate(updateSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.recommendation.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Recommendation not found');
    if (existing.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    }

    const item = await prisma.recommendation.update({
      where: { id },
      data: req.body,
      include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
    res.json(item);
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
