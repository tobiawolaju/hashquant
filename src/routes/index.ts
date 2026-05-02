import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth.js';
import { getOrderbook, getPairTrades, getTrendingMarkets } from '../services/market.js';
import { getNativeBalance } from '../services/monad.js';
import { pool } from '../db/client.js';
import { StrategyAgent } from '../agents/StrategyAgent.js';

export const router = Router(); router.use(requireAuth); const sa=new StrategyAgent();
router.get('/v1/markets', async (_req,res)=>res.json(await getTrendingMarkets()));
router.get('/v1/markets/:pairAddress/trades', async (req,res)=>res.json(await getPairTrades(req.params.pairAddress)));
router.get('/v1/markets/:pairAddress/orderbook', async (req,res)=>res.json(await getOrderbook(req.params.pairAddress)));
router.get('/v1/portfolio', async (req,res)=>{ const wallet=req.auth!.walletAddress; const native=await getNativeBalance(wallet); res.json({walletAddress:wallet,totalValueUsd:native*3000,holdings:[{symbol:'MON',balance:native,valueUsd:native*3000}]});});
router.get('/v1/insights', async (req,res)=>{ const {rows}=await pool.query('SELECT * FROM signals WHERE user_id=$1 ORDER BY created_at DESC LIMIT 5',[req.auth!.userId]); const pairs=(rows[0]?.pair_address)||'monad'; const signal=await sa.run(pairs); res.json({summary:`Current action ${signal.action}`,details:signal.reasoning,recentSignals:rows});});
router.get('/v1/strategies/:id/state', async (req,res)=>{ const {rows}=await pool.query('SELECT state FROM strategies WHERE id=$1 AND user_id=$2',[req.params.id,req.auth!.userId]); if(!rows[0]) return res.status(404).json({error:'not found'}); res.json({state:rows[0].state});});
router.patch('/v1/strategies/:id/state', async (req,res)=>{ const state=z.enum(['idle','running','paused']).parse(req.body.state); await pool.query('UPDATE strategies SET state=$1 WHERE id=$2 AND user_id=$3',[state,req.params.id,req.auth!.userId]); res.json({state});});
router.post('/v1/orders/preview', async (req,res)=>{ const b=z.object({pairAddress:z.string(),side:z.enum(['buy','sell']),amount:z.number().positive()}).parse(req.body); const estimatedPrice=1; res.json({estimatedPrice,slippage:0.005,fees:b.amount*0.001,transaction:{to:b.pairAddress,data:'0x',value:'0x0'}});});
router.post('/v1/orders', async (req,res)=>{ const b=z.object({pairAddress:z.string(),side:z.enum(['buy','sell']),amount:z.number().positive()}).parse(req.body); const id=crypto.randomUUID(); await pool.query('INSERT INTO trades(id,user_id,pair_address,side,amount,status) VALUES($1,$2,$3,$4,$5,$6)',[id,req.auth!.userId,b.pairAddress,b.side,b.amount,'pending']); res.json({tradeId:id,transaction:{to:b.pairAddress,data:'0x',value:'0x0'}});});
