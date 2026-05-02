import express from 'express';
import cors from 'cors';
import { apiRouter } from './api/routes/index.js';
import { errorHandler } from './api/middleware/auth.middleware.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(apiRouter);
  app.use(errorHandler);
  return app;
}
