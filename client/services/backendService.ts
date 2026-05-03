import { MarketEntry } from '@/types/token';
import { apiClient } from './apiClient';

export interface TradeData { price: number; size: number; timestamp: number; }
export type StrategyState = 'idle' | 'running' | 'paused' | 'error';

export const backendService = {
  getMarkets: () => apiClient.get<MarketEntry[]>('/v1/markets'),
  getRecentTrades: (pairAddress: string) => apiClient.get<TradeData[]>(`/v1/markets/${pairAddress}/trades`),
  getOrderBook: (pairAddress: string) => apiClient.get<{asks:{price:string;size:string;total:string}[];bids:{price:string;size:string;total:string}[]}>(`/v1/markets/${pairAddress}/orderbook`),
  getPortfolio: () => apiClient.get<any>('/v1/portfolio'),
  getInsights: () => apiClient.get<any>('/v1/insights'),
  getStrategies: () => apiClient.get<any[]>('/v1/strategies'),
  getStrategyState: (strategyId: string) => apiClient.get<{state: StrategyState}>(`/v1/strategies/${strategyId}/state`),
  updateStrategyState: (strategyId: string, state: StrategyState) => apiClient.patch<{state: StrategyState}>(`/v1/strategies/${strategyId}/state`, { state }),
  previewOrder: (payload: any) => apiClient.post<any>('/v1/orders/preview', payload),
  submitOrder: (payload: any) => apiClient.post<any>('/v1/orders', payload),
};
