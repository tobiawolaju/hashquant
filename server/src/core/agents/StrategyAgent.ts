import { Action, StrategySignal } from '../types/index.js';
import { MarketAgent } from './MarketAgent.js';
import { SentimentAgent } from './SentimentAgent.js';

export class StrategyAgent {
  private readonly market = new MarketAgent();
  private readonly sentiment = new SentimentAgent();

  async run(pairAddress: string): Promise<StrategySignal> {
    const market = await this.market.analyze(pairAddress);
    const sentiment = this.sentiment.classify(market.rsi, market.volatility);
    let action: Action = 'HOLD';
    if (sentiment === 'bullish' && market.rsi < 70) action = 'BUY';
    if (sentiment === 'bearish' && market.rsi > 30) action = 'SELL';
    return {
      action,
      confidence: Math.min(0.99, Math.max(0.1, Math.abs(market.rsi - 50) / 50)),
      reasoning: `Sentiment ${sentiment}, RSI ${market.rsi.toFixed(2)}, EMA ${market.ema.toFixed(6)}, volatility ${(market.volatility * 100).toFixed(2)}%`
    };
  }
}
