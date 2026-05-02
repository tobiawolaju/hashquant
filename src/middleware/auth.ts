import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthContext } from '../types/index.js';

declare global { namespace Express { interface Request { auth?: AuthContext } } }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, process.env.PRIVY_VERIFICATION_KEY || 'dev-secret') as any;
    const walletAddress = decoded.walletAddress || decoded.wallet?.address;
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) return res.status(401).json({ error: 'Invalid wallet' });
    req.auth = { userId: decoded.userId || decoded.sub, walletAddress };
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}
