import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { pool } from '../../infrastructure/db/client.js';
import { StrategyAgent } from '../../core/agents/StrategyAgent.js';
import { getNativeBalance } from '../../core/services/monad.service.js';
import { getOrderbook, getPairTrades, getTrendingMarkets } from '../../core/services/market.service.js';

export const v1Router = Router();
const strategyAgent = new StrategyAgent();

v1Router.get('/markets', async (_req, res) => res.json(await getTrendingMarkets()));
v1Router.get('/markets/:pairAddress/trades', async (req, res) => res.json(await getPairTrades(req.params.pairAddress)));
v1Router.get('/markets/:pairAddress/orderbook', async (req, res) => res.json(await getOrderbook(req.params.pairAddress)));
v1Router.get('/portfolio', async (req, res) => {
  const walletAddress = req.user!.walletAddress;
  const native = await getNativeBalance(walletAddress);
  res.json({ walletAddress, totalValueUsd: null, holdings: [{ symbol: 'MON', balance: native, valueUsd: null }] });
});
v1Router.get('/insights', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM signals WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5', [req.user!.userId]);
  const pairAddress = (rows[0]?.pair_address as string | undefined) ?? 'monad';
  const signal = await strategyAgent.run(pairAddress);
  res.json({ summary: `Current action ${signal.action}`, details: signal.reasoning, recentSignals: rows });
});
v1Router.get('/strategies/:id/state', async (req, res) => {
  const { rows } = await pool.query('SELECT state FROM strategies WHERE id=$1 AND user_id=$2', [req.params.id, req.user!.userId]);
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  return res.json({ state: rows[0].state });
});
v1Router.patch('/strategies/:id/state', async (req, res) => {
  const state = z.enum(['idle', 'running', 'paused']).parse(req.body.state);
  await pool.query('UPDATE strategies SET state=$1 WHERE id=$2 AND user_id=$3', [state, req.params.id, req.user!.userId]);
  res.json({ state });
});
v1Router.post('/orders/preview', async (req, res) => {
  const body = z.object({ pairAddress: z.string(), side: z.enum(['buy', 'sell']), amount: z.number().positive() }).parse(req.body);
  res.json({ estimatedPrice: 1, slippage: 0.005, fees: body.amount * 0.001, transaction: { to: body.pairAddress, data: '0x', value: '0x0' } });
});
v1Router.post('/orders', async (req, res) => {
  const body = z.object({ pairAddress: z.string(), side: z.enum(['buy', 'sell']), amount: z.number().positive() }).parse(req.body);
  const tradeId = crypto.randomUUID();
  await pool.query('INSERT INTO trades(id,user_id,pair_address,side,amount,status) VALUES($1,$2,$3,$4,$5,$6)', [tradeId, req.user!.userId, body.pairAddress, body.side, body.amount, 'pending']);
  res.json({ tradeId, transaction: { to: body.pairAddress, data: '0x', value: '0x0' } });
});
