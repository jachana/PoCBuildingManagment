import { Router, Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth, requireApproved } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import { generatePresignedUploadUrl } from '../services/storage.js';
import { handleError, AppError } from '../lib/errors.js';

const presignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  context: z.enum(['post', 'avatar', 'entrepreneur']),
});

const router = Router();

router.post('/presign', requireAuth, requireApproved, uploadLimiter, validate(presignSchema), async (req: Request, res: Response) => {
  try {
    const { filename, contentType, context } = req.body;
    const ext = filename.split('.').pop() || 'jpg';
    const objectKey = `${context}s/${req.user!.id}/${crypto.randomUUID()}.${ext}`;

    const uploadUrl = await generatePresignedUploadUrl(objectKey, contentType, context);

    res.json({ uploadUrl, objectKey, expiresIn: 900 });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Invalid')) {
      handleError(res, new AppError(400, 'VALIDATION_ERROR', err.message));
    } else {
      handleError(res, err);
    }
  }
});

export default router;
