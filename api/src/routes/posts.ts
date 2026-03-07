import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';
import { parsePagination, formatPaginatedResponse } from '../lib/pagination.js';
import { generatePresignedGetUrl } from '../services/storage.js';
import { PostCategory, PostStatus, Prisma } from '@prisma/client';

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  price: z.number().int().min(0),
  category: z.nativeEnum(PostCategory),
  images: z.array(z.string()).min(1).max(5),
});

const updatePostSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  price: z.number().int().min(0).optional(),
  category: z.nativeEnum(PostCategory).optional(),
  status: z.enum(['SOLD']).optional(),
});

const router = Router();

async function resolveImageUrls(images: string[]): Promise<string[]> {
  try {
    return await Promise.all(
      images.map((key) =>
        key.startsWith('http://') || key.startsWith('https://')
          ? key
          : generatePresignedGetUrl(key),
      ),
    );
  } catch {
    return images;
  }
}

// GET /posts - List posts for building
router.get('/', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const pagination = parsePagination(req);
    const { category, status } = req.query;

    // Get IDs of users blocked by current user
    const blockedUsers = await prisma.userBlock.findMany({
      where: { blockerId: req.user!.id },
      select: { blockedId: true },
    });
    const blockedIds = blockedUsers.map((b) => b.blockedId);

    const where: Prisma.PostWhereInput = {
      author: { buildingId: req.user!.buildingId },
      authorId: blockedIds.length > 0 ? { notIn: blockedIds } : undefined,
      hidden: false,
      status: (status as PostStatus) || 'ACTIVE',
    };
    if (category) {
      where.category = category as PostCategory;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    const postsWithUrls = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        images: await resolveImageUrls(post.images),
      })),
    );

    res.json(formatPaginatedResponse(postsWithUrls, total, pagination));
  } catch (err) {
    handleError(res, err);
  }
});

// GET /posts/:id - Single post
router.get('/:id', requireAuth, requireApproved, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, displayName: true, avatarUrl: true, buildingId: true } } },
    });

    if (!post || post.hidden) {
      throw new AppError(404, 'NOT_FOUND', 'Post not found');
    }
    if (post.author.buildingId !== req.user!.buildingId) {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    }

    const { buildingId: _, ...author } = post.author;
    res.json({
      ...post,
      author,
      images: await resolveImageUrls(post.images),
    });
  } catch (err) {
    handleError(res, err);
  }
});

// POST /posts - Create post
router.post('/', requireAuth, requireApproved, validate(createPostSchema), async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { building: { select: { maxPostsPerUser: true } } },
    });

    if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
    if (user.activePostCount >= user.building.maxPostsPerUser) {
      throw new AppError(403, 'FORBIDDEN', `Post limit reached (max ${user.building.maxPostsPerUser})`);
    }

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          ...req.body,
          authorId: req.user!.id,
        },
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
      });
      await tx.user.update({
        where: { id: req.user!.id },
        data: { activePostCount: { increment: 1 } },
      });
      return created;
    });

    res.status(201).json({
      ...post,
      images: await resolveImageUrls(post.images),
    });
  } catch (err) {
    handleError(res, err);
  }
});

// PATCH /posts/:id - Update post
router.patch('/:id', requireAuth, requireApproved, validate(updatePostSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Post not found');

    if (existing.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError(403, 'FORBIDDEN', 'Not authorized');
    }

    const data: Prisma.PostUpdateInput = { ...req.body };
    const markingSold = req.body.status === 'SOLD' && existing.status === 'ACTIVE';

    const post = await prisma.$transaction(async (tx) => {
      const updated = await tx.post.update({
        where: { id },
        data,
        include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
      });
      if (markingSold) {
        await tx.user.update({
          where: { id: existing.authorId },
          data: { activePostCount: { decrement: 1 } },
        });
      }
      return updated;
    });

    res.json({
      ...post,
      images: await resolveImageUrls(post.images),
    });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /posts/:id - Admin remove
router.delete('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Post not found');

    await prisma.$transaction([
      prisma.post.update({ where: { id }, data: { status: 'REMOVED' } }),
      prisma.user.update({ where: { id: existing.authorId }, data: { activePostCount: { decrement: 1 } } }),
    ]);

    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
