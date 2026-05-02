import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { v1Router } from './v1.routes.js';

export const apiRouter = Router();
apiRouter.use('/v1', requireAuth, v1Router);
