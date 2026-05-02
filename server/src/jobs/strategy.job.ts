import cron from 'node-cron';
import crypto from 'crypto';
import { Server } from 'socket.io';
import { StrategyAgent } from '../core/agents/StrategyAgent.js';
import { pool } from '../infrastructure/db/client.js';

export function startStrategyJob(io: Server): void {
  const strategyAgent = new StrategyAgent();
  cron.schedule('*/20 * * * * *', async () => {
    const { rows } = await pool.query("SELECT id,user_id,pair_address FROM strategies WHERE state='running'");
    for (const strategy of rows as Array<{ id: string; user_id: string; pair_address: string }>) {
      const signal = await strategyAgent.run(strategy.pair_address);
      await pool.query('INSERT INTO signals(id,user_id,pair_address,action,confidence,reasoning) VALUES($1,$2,$3,$4,$5,$6)', [crypto.randomUUID(), strategy.user_id, strategy.pair_address, signal.action, signal.confidence, signal.reasoning]);
      io.to(`user:${strategy.user_id}`).emit('strategy_signals', { strategyId: strategy.id, ...signal, pairAddress: strategy.pair_address });
    }
  });
}
