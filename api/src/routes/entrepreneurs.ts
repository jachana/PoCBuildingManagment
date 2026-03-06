import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { parsePagination, formatPaginatedResponse } from '../lib/pagination.js';
import { EntrepreneurCategory, Prisma } from '@prisma/client';

const createSchema = z.object({
  profession: z.string().min(1).max(100),
  category: z.nativeEnum(EntrepreneurCategory),
  description: z.string().min(1).max(1000),
  contactInfo: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  residentDiscount: z.string().max(200).optional(),
});

const updateSchema = z.object({
  profession: z.string().min(1).max(100).optional(),
  category: z.nativeEnum(EntrepreneurCategory).optional(),
  description: z.string().min(1).max(1000).optional(),
  contactInfo: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  residentDiscount: z.string().max(200).optional(),
  active: z.boolean().optional(),
});

const router = Router();

router.get('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const { category } = req.query;
    const blockedUsers = await prisma.userBlock.findMany({
      where: { blockerId: req.user!.id },
      select: { blockedId: true },
    });
    const blockedIds = blockedUsers.map((b) => b.blockedId);

    const where: Prisma.EntrepreneurProfileWhereInput = {
      user: { buildingId: req.user!.buildingId },
      userId: blockedIds.length > 0 ? { notIn: blockedIds } : undefined,
      active: true,
      hidden: false,
    };
    if (category) where.category = category as EntrepreneurCategory;

    const [items, total] = await Promise.all([
      prisma.entrepreneurProfile.findMany({
        where,
        include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.entrepreneurProfile.count({ where }),
    ]);
    res.json(formatPaginatedResponse(items, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/:id', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const item = await prisma.entrepreneurProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true, buildingId: true } } },
    });
    if (!item || item.hidden) throw new AppError(404, 'NOT_FOUND', 'Profile not found');
    if (item.user.buildingId !== req.user!.buildingId) throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    const { buildingId: _, ...user } = item.user;
    res.json({ ...item, user });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/', requireAuth, requireApproved, validate(createSchema), async (req: Request, res: Response) => {
  try {
    const existing = await prisma.entrepreneurProfile.findUnique({ where: { userId: req.user!.id } });
    if (existing) throw new AppError(409, 'CONFLICT', 'You already have an entrepreneur profile');

    const item = await prisma.entrepreneurProfile.create({
      data: { ...req.body, userId: req.user!.id },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err);
  }
});

router.patch('/:id', requireAuth, requireApproved, validate(updateSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.entrepreneurProfile.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Profile not found');
    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    }
    const item = await prisma.entrepreneurProfile.update({
      where: { id },
      data: req.body,
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
    res.json(item);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete('/:id', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.entrepreneurProfile.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Profile not found');
    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    }
    await prisma.entrepreneurProfile.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
