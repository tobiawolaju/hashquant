export type StrategyState = 'idle' | 'running' | 'paused' | 'error';
export type Side = 'buy' | 'sell';
export type Sentiment = 'bullish' | 'bearish' | 'neutral';
export type Action = 'BUY' | 'SELL' | 'HOLD';

export interface AuthContext { userId: string; walletAddress: `0x${string}`; }
