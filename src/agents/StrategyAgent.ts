import { Action } from '../types/index.js';
import { MarketAgent } from './MarketAgent.js';
import { SentimentAgent } from './SentimentAgent.js';
export class StrategyAgent { market=new MarketAgent(); sentiment=new SentimentAgent(); async run(pairAddress:string){const m=await this.market.analyze(pairAddress); const s=this.sentiment.classify(m.rsi,m.volatility); let action:Action='HOLD'; if(s==='bullish'&&m.rsi<70) action='BUY'; if(s==='bearish'&&m.rsi>30) action='SELL'; const confidence=Math.min(0.99,Math.max(0.1,Math.abs(m.rsi-50)/50)); return {action,confidence,reasoning:`Sentiment ${s}, RSI ${m.rsi.toFixed(2)}, EMA ${m.ema.toFixed(6)}, volatility ${(m.volatility*100).toFixed(2)}%`}; }}
