import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { privateV1Router, publicV1Router } from './v1.routes.js';

export const apiRouter = Router();
apiRouter.use('/v1', publicV1Router);
apiRouter.use('/v1', requireAuth, privateV1Router);
