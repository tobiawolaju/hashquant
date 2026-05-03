import { backendService } from './backendService';
import type { TradeData } from './backendService';

export { TradeData };

export const marketService = {
  async fetchHistory(pairAddress: string): Promise<TradeData[]> {
    if (!pairAddress) return [];
    return backendService.getRecentTrades(pairAddress);
  },

  subscribeTrades(_pairAddress: string, _onTrade: (trade: TradeData) => void): () => void {
    // Replaced by socketService ticker subscriptions in production integrations.
    return () => undefined;
  },
};
