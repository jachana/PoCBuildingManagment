import { Request, Response, NextFunction } from 'express';

export function requireOwnerOrAdmin(ownerField: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    // Admin always passes
    if (req.user.role === 'ADMIN') {
      next();
      return;
    }
    // Check ownership from response locals (set by route handler)
    const ownerId = res.locals[ownerField];
    if (ownerId && ownerId === req.user.id) {
      next();
      return;
    }
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not authorized' } });
  };
}
