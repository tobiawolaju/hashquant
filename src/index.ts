import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import cron from 'node-cron';
import { initDb, pool } from './db/client.js';
import { router } from './routes/index.js';
import { StrategyAgent } from './agents/StrategyAgent.js';
import { createSocket } from './sockets/index.js';
import crypto from 'crypto';

const app=express(); app.use(cors()); app.use(express.json()); app.use(router);
const server=http.createServer(app); const io=createSocket(server); const sa=new StrategyAgent();
cron.schedule('*/20 * * * * *', async ()=>{ const {rows}=await pool.query("SELECT id,user_id,pair_address FROM strategies WHERE state='running'"); for(const s of rows){ const sig=await sa.run(s.pair_address); await pool.query('INSERT INTO signals(id,user_id,pair_address,action,confidence,reasoning) VALUES($1,$2,$3,$4,$5,$6)',[crypto.randomUUID(),s.user_id,s.pair_address,sig.action,sig.confidence,sig.reasoning]); io.to(s.user_id).emit('strategy_signals',{strategyId:s.id,...sig,pairAddress:s.pair_address}); }});
io.on('connection',(socket)=>{socket.join(socket.data.auth.userId); socket.emit('portfolio',{walletAddress:socket.data.auth.walletAddress});});
initDb().then(()=>server.listen(process.env.PORT||8080));
