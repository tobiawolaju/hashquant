import Redis from 'ioredis';
import { env } from '../config/env.js';

type RedisClient = {
  on: (event: string, handler: (error: unknown) => void) => void;
  connect: () => Promise<void>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, mode: 'EX', ttlSeconds: number) => Promise<unknown>;
};

const RedisCtor = Redis as unknown as new (url: string, options: Record<string, unknown>) => RedisClient;

export const redis = new RedisCtor(env.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false
});

let cacheAvailable = false;
let connectAttempted = false;

redis.on('error', (error: unknown) => {
  cacheAvailable = false;
  console.warn('Redis unavailable; continuing without cache.', error);
});

async function ensureRedis(): Promise<boolean> {
  if (cacheAvailable) return true;
  if (connectAttempted) return false;
  connectAttempted = true;

  try {
    await redis.connect();
    cacheAvailable = true;
    return true;
  } catch {
    cacheAvailable = false;
    return false;
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  if (!(await ensureRedis())) return null;
  try {
    return await redis.get(key);
  } catch {
    cacheAvailable = false;
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!(await ensureRedis())) return;
  try {
    await redis.set(key, value, 'EX', ttlSeconds);
  } catch {
    cacheAvailable = false;
  }
}
