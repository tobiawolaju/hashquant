import { Sentiment } from '../types/index.js';

export class SentimentAgent {
  classify(rsi: number, volatility: number): Sentiment {
    if (rsi > 60 && volatility < 0.03) return 'bullish';
    if (rsi < 40 && volatility > 0.04) return 'bearish';
    return 'neutral';
  }
}
