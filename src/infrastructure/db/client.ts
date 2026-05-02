import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool({ connectionString: env.databaseUrl });

export async function initDb(): Promise<void> {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, wallet_address TEXT UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS strategies (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, state TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS trades (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, side TEXT NOT NULL, amount NUMERIC NOT NULL, status TEXT NOT NULL, tx_hash TEXT, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS signals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, action TEXT NOT NULL, confidence NUMERIC NOT NULL, reasoning TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);

  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_signals_user_id ON signals(user_id);');
}
