import { Pool } from 'pg';
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, wallet_address TEXT UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS strategies (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, state TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS trades (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, side TEXT NOT NULL, amount NUMERIC NOT NULL, status TEXT NOT NULL, tx_hash TEXT, created_at TIMESTAMPTZ DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS signals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, pair_address TEXT NOT NULL, action TEXT NOT NULL, confidence NUMERIC NOT NULL, reasoning TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now());`);
}
