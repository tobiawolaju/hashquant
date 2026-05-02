import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../infrastructure/config/env.js';
import { AuthUser } from '../../core/types/index.js';

declare global { namespace Express { interface Request { user?: AuthUser } } }

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  try {
    const decoded = jwt.verify(token, env.privyVerificationKey) as Record<string, unknown>;
    const walletAddress = (decoded.walletAddress as string | undefined) || ((decoded.wallet as { address?: string } | undefined)?.address);
    const userId = (decoded.userId as string | undefined) || (decoded.sub as string | undefined);
    if (!walletAddress || !userId || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      res.status(401).json({ error: 'Invalid auth payload' });
      return;
    }
    req.user = { userId, walletAddress: walletAddress as `0x${string}` };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  res.status(500).json({ error: err.message || 'Internal server error' });
}
