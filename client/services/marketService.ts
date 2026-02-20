import { getDeriverseClient } from './sdkClient';
import { DeriverseMarket } from '../types/deriverse';

export interface TradeData {
    price: number;
    size: number;
    timestamp: number;
}

/**
 * marketService
 *
 * Provides market data and trade streams for the Deriverse v1 protocol.
 */
export const marketService = {
    /**
     * Fetches active metadata for a given market (e.g. BTC-PERP).
     */
    async getMarketInfo(marketId: string): Promise<DeriverseMarket | null> {
        try {
            const client = getDeriverseClient();
            const market = await client.getMarket(marketId);

            return {
                ticker: marketId,
                price: market.price || 0,
                fundingRate: market.fundingRate || 0,
                openInterest: market.openInterest || 0,
            };
        } catch (e) {
            console.error(`Failed to fetch market info for ${marketId}`, e);
            return null;
        }
    },

    /**
     * Fetches historical trades for a given market.
     * In a real implementation, this would call the Deriverse SDK or a specialized indexer.
     */
    async fetchHistory(marketId: string): Promise<TradeData[]> {
        // Generate mock historical data for now
        const now = Date.now();
        const trades: TradeData[] = [];
        let price = 50000 + Math.random() * 1000;

        for (let i = 1000; i > 0; i--) {
            price += (Math.random() - 0.5) * 50;
            trades.push({
                price: price,
                size: Math.random() * 2,
                timestamp: now - i * 5000, // Every 5 seconds roughly
            });
        }
        return trades;
    },

    /**
     * Subscribes to live trades for a given market.
     */
    subscribeTrades(marketId: string, onTrade: (trade: TradeData) => void): () => void {
        // In a real implementation, this uses @solana/web3.js onAccountChange or similar
        // for program log parsing.
        const interval = setInterval(() => {
            onTrade({
                price: 50000 + Math.random() * 2000,
                size: Math.random() * 0.5,
                timestamp: Date.now(),
            });
        }, 1500);

        return () => clearInterval(interval);
    }
};
