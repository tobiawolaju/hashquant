import http from 'http';
import { createApp } from './app.js';
import { createSocket } from './api/sockets/index.js';
import { initDb } from './infrastructure/db/client.js';
import { startStrategyJob } from './jobs/strategy.job.js';
import { env } from './infrastructure/config/env.js';

const app = createApp();
const server = http.createServer(app);
const io = createSocket(server);

await initDb();
startStrategyJob(io);

server.listen(env.port);
