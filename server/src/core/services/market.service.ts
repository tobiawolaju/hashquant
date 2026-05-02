import { redis } from '../../infrastructure/cache/redis.js';

const BASE = 'https://api.dexscreener.com/latest/dex';

type DexPair = {
  pairAddress?: string;
  priceUsd?: string;
  volume?: { h24?: string | number };
};

async function fetchDex(path: string): Promise<{ pairs: DexPair[] }> {
  const response = await fetch(`${BASE}/${path}`);
  if (!response.ok) throw new Error(`DexScreener request failed: ${response.status}`);
  const payload = (await response.json()) as { pairs?: DexPair[] };
  return { pairs: payload.pairs ?? [] };
}

export async function getTrendingMarkets(): Promise<DexPair[]> {
  const cached = await redis.get('markets:trending');
  if (cached) return JSON.parse(cached) as DexPair[];
  const payload = await fetchDex('search?q=monad');
  const pairs = (payload.pairs ?? []).slice(0, 50);
  await redis.set('markets:trending', JSON.stringify(pairs), 'EX', 30);
  return pairs;
}

export async function getPair(pairAddress: string): Promise<DexPair | null> {
  const payload = await fetchDex(`search?q=${pairAddress}`);
  return (payload.pairs ?? []).find((pair) => pair.pairAddress?.toLowerCase() === pairAddress.toLowerCase()) ?? null;
}

export async function getPairTrades(pairAddress: string): Promise<Array<{ price: number; amount: number; side: 'buy'; timestamp: number }>> {
  const pair = await getPair(pairAddress);
  if (!pair) return [];
  return [{ price: Number(pair.priceUsd), amount: Number(pair.volume?.h24 ?? 0) / 1000, side: 'buy', timestamp: Date.now() }];
}

export async function getOrderbook(pairAddress: string): Promise<{ pairAddress: string; sequence: number; bids: Array<{ price: number; size: number }>; asks: Array<{ price: number; size: number }>; timestamp: number; simulated: true }> {
  const pair = await getPair(pairAddress);
  const mid = Number(pair?.priceUsd ?? 0);
  // Simulated depth from live mid-price because DexScreener does not provide L2 orderbook.
  return {
    pairAddress,
    sequence: Date.now(),
    bids: [1, 2, 3, 4, 5].map((i) => ({ price: mid * (1 - i * 0.001), size: 100 * i })),
    asks: [1, 2, 3, 4, 5].map((i) => ({ price: mid * (1 + i * 0.001), size: 100 * i })),
    timestamp: Date.now(),
    simulated: true
  };
}
