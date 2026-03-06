import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { validate } from '../middleware/validate.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';
import { handleError, AppError } from '../lib/errors.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(100),
  displayName: z.string().min(1).max(50),
  unitNumber: z.string().min(1).max(20),
  buildingId: z.string().uuid(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, displayName, unitNumber, buildingId, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Email already registered');
    }

    const building = await prisma.building.findUnique({ where: { id: buildingId } });
    if (!building) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid building ID');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        displayName,
        unitNumber,
        buildingId,
        phone: phone || null,
      },
      select: { id: true, email: true, displayName: true, role: true, approved: true },
    });

    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/login', loginLimiter, validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid email or password');
    }

    if (!user.approved) {
      throw new AppError(403, 'FORBIDDEN', 'Account pending approval');
    }
    if (user.blocked) {
      throw new AppError(403, 'FORBIDDEN', 'Account blocked');
    }

    const payload = { sub: user.id, role: user.role, buildingId: user.buildingId };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        displayName: user.displayName,
        role: user.role,
        approved: user.approved,
        buildingId: user.buildingId,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, 'UNAUTHORIZED', 'Invalid refresh token');
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError(401, 'UNAUTHORIZED', 'Refresh token expired or revoked');
    }

    // Revoke old token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.blocked) {
      throw new AppError(401, 'UNAUTHORIZED', 'User not found or blocked');
    }

    const newPayload = { sub: user.id, role: user.role, buildingId: user.buildingId };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await prisma.refreshToken.create({
      data: {
        tokenHash: newTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
