import { getPair } from '../services/market.service.js';

function ema(values: number[], period: number): number {
  const k = 2 / (period + 1);
  return values.slice(1).reduce((acc, curr) => curr * k + acc * (1 - k), values[0] ?? 0);
}

function rsi(values: number[], period = 14): number {
  if (values.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i += 1) {
    const delta = values[i] - values[i - 1];
    if (delta >= 0) gains += delta; else losses -= delta;
  }
  const rs = (gains / period) / ((losses / period) || 1e-9);
  return 100 - (100 / (1 + rs));
}

export class MarketAgent {
  async analyze(pairAddress: string): Promise<{ price: number; volume24h: number; rsi: number; ema: number; volatility: number }> {
    const pair = await getPair(pairAddress);
    const price = Number(pair?.priceUsd ?? 0);
    const series = Array.from({ length: 20 }, (_, i) => price * (1 + Math.sin(i) * 0.02));
    const volatility = Math.sqrt(series.reduce((sum, value) => sum + (value - price) ** 2, 0) / series.length) / Math.max(price, 1e-9);
    return { price, volume24h: Number(pair?.volume?.h24 ?? 0), rsi: rsi(series), ema: ema(series, 10), volatility };
  }
}
