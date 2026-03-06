import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { handleError, AppError } from '../lib/errors.js';

const blockSchema = z.object({
  userId: z.string().uuid(),
});

const router = Router();

router.post('/', requireAuth, requireApproved, validate(blockSchema), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (userId === req.user!.id) throw new AppError(400, 'VALIDATION_ERROR', 'Cannot block yourself');

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new AppError(404, 'NOT_FOUND', 'User not found');

    await prisma.userBlock.create({
      data: { blockerId: req.user!.id, blockedId: userId },
    });
    res.status(201).json({ message: 'User blocked' });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      res.status(200).json({ message: 'Already blocked' });
      return;
    }
    handleError(res, err);
  }
});

router.delete('/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await prisma.userBlock.deleteMany({
      where: { blockerId: req.user!.id, blockedId: userId },
    });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const blocks = await prisma.userBlock.findMany({
      where: { blockerId: req.user!.id },
      select: { blockedId: true },
    });
    res.json(blocks.map((b) => b.blockedId));
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
