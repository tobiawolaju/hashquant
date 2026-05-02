# Dominus Quant Frontend Analysis → Backend Requirements Specification

## 1) System Overview
- Frontend stack: Next.js App Router + React client components with Zustand state, framer-motion UI effects, lightweight-charts for candles, and mock/local services for several trading features.
- Current architecture is **frontend-heavy** with direct calls to DexScreener from the browser and extensive mock fallback data.
- There is no production backend integration yet for auth sessions, portfolio, orders, auto-trading, AI insights, or journal indexing.

## 2) Project Structure (Frontend Surface)

### Root-level
- `client/app/page.tsx`: top-level composition for Splash, ViewPager, Journal, Portfolio section, FAB actions, trade modal, AI modal.
- `client/lib/store.ts`: central Zustand store (global UI + market + analytics state).

### Pages / Views
- `client/components/ViewPager.tsx`: main view switcher (`Chart`, `Orderbook`, `Wallet`) and market selector / timeframe / tool controls.
- `client/components/TradingJournal.tsx`: paginated journal cards + AI Insight trigger.
- `client/components/PortfolioAnalysisLyrics.tsx`: analytics storytelling view bound to computed metrics.
- `client/components/AIInsightModal.tsx`: AI advice overlay content.
- `client/components/ExecutionModal.tsx`: manual execution confirmation UI.

### Components
- `client/components/LightweightChart.tsx`: chart rendering and drawing overlays.
- `client/components/BottomFABBar.tsx`: tab switching + play/pause auto-trade toggle + BUY action.

### Hooks / Services
- `client/hooks/useMarketData.ts`: candle lifecycle, history load, live tick subscription.
- `client/services/marketService.ts`: market history + live polling abstraction.
- `client/services/dexscreenerService.ts`: DexScreener REST adapters.
- `client/services/analyticsService.ts`: PnL and session metrics engine.
- `client/services/journalIndexerService.ts`: stubbed trade-history service.
- `client/services/privyWalletBridge.ts`: wallet signer interface bridge.
- `client/services/sdkClient.ts`: deprecated stub.

### State Management
- **Zustand** only (`useDeriverseStore`) for app-wide state:
  - navigation tab,
  - modal visibility,
  - journal pagination,
  - portfolio section activation,
  - analytics trades/metrics,
  - active market + available markets.

## 3) Feature Mapping and Backend Needs

### 3.1 Token Selection (DexScreener-style market discovery)
**Frontend behavior**
- On mount, `ViewPager` loads trending pairs with `dexscreenerService.getTrendingPairs(MONAD_CHAIN_ID, 50)`.
- Selected market is stored globally (`activeMarket`) and used for chart/ticker/orderbook context.

**Current data source**
- Direct third-party API (DexScreener), with fallback defaults (`FALLBACK_MARKETS`).

**Backend support needed**
- A backend market-discovery endpoint to avoid browser-side dependence on third-party API and rate limits.
- Cached, normalized token/pair metadata with deterministic ranking strategy.
- Optional search endpoint and per-chain filters.

### 3.2 TradingView/Chart equivalent (Lightweight Chart)
**Frontend behavior**
- `useMarketData` loads synthetic history from current price and subscribes to live updates.
- Timeframes: `1s | 1m | 5m | 15m`.
- Chart supports user drawings (pure client-side).

**Current data source**
- `marketService.fetchHistory`: synthetic candles seeded from latest spot price.
- `marketService.subscribeTrades`: polling every 5 seconds to DexScreener.

**Backend support needed**
- True OHLCV historical candles endpoint.
- Low-latency live trade/price stream (WebSocket recommended).
- Granularity support for required timeframes.

### 3.3 Wallet View (balances + address)
**Frontend behavior**
- Wallet tab displays total balance, address, and token holdings.

**Current data source**
- Fully mocked via `mockWalletData`.

**Backend support needed**
- Authenticated wallet portfolio endpoint by wallet address.
- Per-asset balances + USD valuation + 24h change.
- Multi-chain support considerations (project is Monad-focused but contains Solana legacy typing).

### 3.4 Order Book View
**Frontend behavior**
- Displays asks, bids, depth bars, spread, and liquidity/volume hints.

**Current data source**
- Fully mocked with generated rows (`mockOrderBookData`).

**Backend support needed**
- Real order book snapshot endpoint.
- Incremental depth updates (WebSocket) for smooth live book.
- Sequence IDs to guarantee ordered application of deltas.

### 3.5 Trading Panel (manual buy/sell)
**Frontend behavior**
- BUY opens `ExecutionModal` with amount + “slide to lock” confirmation UI.
- No actual order submit call is implemented.

**Current data source**
- Local-only component state.

**Backend support needed**
- Order preview endpoint (fees/slippage/route).
- Order placement endpoint (market/limit support).
- Order status endpoint / stream (pending/confirmed/failed lifecycle).
- Wallet signature challenge flow (if custodial/non-custodial hybrid).

### 3.6 Auto Trading (“Play button”)
**Frontend behavior**
- Play/Pause button toggles local `isPlaying` state only.

**Current data source**
- Pure local UI state.

**Backend support needed**
- Strategy lifecycle APIs (`start`, `pause`, `stop`, `status`).
- Signal generation + execution logs.
- Risk constraints and kill-switch endpoint.

### 3.7 AI Advice View
**Frontend behavior**
- Modal shows static hardcoded text insights.

**Current data source**
- Static strings.

**Backend support needed**
- Insight generation endpoint scoped to user trade history + behavior metrics.
- Optional historical insight versions and explanations.

### 3.8 Analytics / Wrap View
**Frontend behavior**
- Uses `analyticsService.computeMetrics()` over trades from store (currently defaulting to mock journal).
- Displays total PnL, win rate, volume, fees, bias, session performance, largest gain, drawdown.

**Current data source**
- Mostly mock (`journalEntries`) or local computed aggregates.

**Backend support needed**
- Trade history endpoint (raw fills/orders).
- Optional backend-computed analytics endpoint to keep formulas canonical.
- Time-windowed and segmented metrics endpoints (daily/weekly/30d/all-time).

## 4) API Detection (Current frontend network calls)

## 4.1 Directly used endpoints
1. `GET https://api.dexscreener.com/token-pairs/v1/{chainId}/{tokenAddress}`
- requestBody: none
- expectedResponse (frontend expectation): `DexScreenerPair[]`
- whereUsed: `dexscreenerService.getPairsByToken`

2. `GET https://api.dexscreener.com/latest/dex/pairs/{chainId}/{pairAddress}`
- requestBody: none
- expectedResponse: `{ schemaVersion: string, pairs: DexScreenerPair[] | null }`
- whereUsed: `dexscreenerService.getPairByAddress`, indirectly `getLatestPrice`, `marketService`

3. `GET https://api.dexscreener.com/latest/dex/search?q={query}`
- requestBody: none
- expectedResponse: `{ schemaVersion: string, pairs: DexScreenerPair[] | null }`
- whereUsed: `dexscreenerService.searchPairs`, indirectly `getTrendingPairs`

## 4.2 No internal backend endpoints currently present
- No `fetch('/api/...')` or axios calls to a project backend were detected.
- No order submission endpoint calls exist.
- No auth/session endpoint calls exist.

## 5) State and Data Flow

### Global state (Zustand)
- `activeTab`, execution modal open/close, journal pagination.
- `isPortfolioActive`, `aiInsightOpen`.
- `trades`, `metrics` with `setTrades` and `refreshAnalytics`.
- `activeMarket`, `availableMarkets`.

### Token selection lifecycle
1. App mount → `ViewPager` loads markets.
2. Markets stored in global `availableMarkets`.
3. User selects one → `activeMarket` changes.
4. `useMarketData` reacts to `activeMarket.pairAddress` + timeframe and reloads history/subscription.
5. Chart + price chips + orderbook headline update from this active context.

### Trade action lifecycle (currently incomplete)
1. User presses BUY button in FAB.
2. Opens `ExecutionModal`.
3. User enters size and slides lock.
4. No API call; no transaction signing; no status update persisted.

### Wallet data lifecycle (currently mock)
1. Wallet tab always reads `mockWalletData`.
2. No wallet connector or authenticated user binding in UI runtime.

## 6) Wallet + Auth Integration Points

### Existing integration artifacts
- `createPrivySigner()` adapts a Privy wallet object to SDK wallet signature methods.
- `PrivyWallet` interface expects `{ address, signTransaction }`.
- `journalIndexerService.fetchTradeHistory(walletAddress)` exists as a stub (returns empty).

### Backend implications
- Backend must support wallet-address keyed identities.
- If Privy is used for auth, backend should verify ownership via SIWE/signature challenge or Privy-issued identity token validation.
- Backend should expose user-scoped routes expecting authenticated principal + bound wallet(s).
- For trading, backend likely needs a “prepare transaction” + “submit signed transaction” flow.

## 7) Real-time Requirements

### Live-updating components
- Chart ticker and candle stream (`useMarketData`/`marketService`).
- Order book depth ladders (currently mock but visually designed for live updates).
- Auto-trading status (play/pause state currently local, should become server state).
- Potentially AI signals/advice freshness.

### Transport expectation
- Frontend currently uses 5s polling for trades.
- Production backend should provide:
  - WebSocket streams for tick + orderbook + strategy events.
  - Polling fallback endpoints.

## 8) Missing Backend Requirements Classification

### MUST have
- Auth/session + wallet identity verification.
- Market metadata list/search endpoints.
- Historical candles endpoint.
- Live price stream.
- Wallet balances/portfolio endpoint.
- Order creation + order status endpoints.
- User trade history endpoint.

### SHOULD have
- Backend-computed analytics endpoint (same metrics currently local).
- Orderbook snapshot + delta streams.
- AI insights generation endpoint.
- Strategy configuration and auto-trading control endpoints.

### OPTIONAL
- Notification/webhook endpoints.
- Saved chart drawings/templates.
- Social/token watchlist and alerting.

## 9) Proposed Backend API Contract (normalized)

### Market APIs
- `GET /v1/markets/trending?chain=monad&limit=50`
- `GET /v1/markets/search?q=...&chain=monad`
- `GET /v1/markets/{pairAddress}`
- `GET /v1/markets/{pairAddress}/candles?timeframe=1m&from=...&to=...&limit=...`
- `GET /v1/markets/{pairAddress}/orderbook` (snapshot)
- `WS /v1/stream/markets` topics: `ticker`, `trades`, `orderbook`.

### Wallet/User APIs
- `POST /v1/auth/wallet/challenge`
- `POST /v1/auth/wallet/verify`
- `GET /v1/users/me`
- `GET /v1/wallets/{address}/portfolio`
- `GET /v1/wallets/{address}/transactions`

### Trading APIs
- `POST /v1/orders/preview`
- `POST /v1/orders`
- `GET /v1/orders/{orderId}`
- `GET /v1/orders?wallet=...&status=...`
- `WS /v1/stream/orders`.

### Auto-trading APIs
- `POST /v1/strategies/{id}/start`
- `POST /v1/strategies/{id}/pause`
- `POST /v1/strategies/{id}/stop`
- `GET /v1/strategies/{id}/status`
- `GET /v1/strategies/{id}/signals`

### Analytics + AI APIs
- `GET /v1/analytics/summary?wallet=...&window=30d`
- `GET /v1/analytics/pnl-history?wallet=...&granularity=day`
- `GET /v1/journal?wallet=...&page=...&limit=...`
- `POST /v1/insights/generate`
- `GET /v1/insights/latest?wallet=...`

## 10) TypeScript Data Models (backend-facing)

```ts
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  wallets: WalletRef[];
  preferences?: {
    baseCurrency: 'USD' | string;
    defaultChain: 'monad' | string;
  };
}

export interface WalletRef {
  address: string;
  chain: 'monad' | 'solana' | string;
  isPrimary: boolean;
  verifiedAt?: string;
}

export interface Token {
  address: string;
  chain: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
}

export interface MarketData {
  pairAddress: string;
  chain: string;
  dexId: string;
  baseToken: Token;
  quoteToken: Token;
  priceUsd: number;
  priceNative?: number;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  updatedAt: string;
}

export interface Candle {
  pairAddress: string;
  timeframe: '1s' | '1m' | '5m' | '15m' | string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel { price: number; size: number; total?: number; }

export interface OrderBookSnapshot {
  pairAddress: string;
  sequence: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface Trade {
  id: string;
  userId: string;
  walletAddress: string;
  pairAddress: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  size: number;
  price?: number;
  filledSize?: number;
  averageFillPrice?: number;
  feeUsd?: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Signal {
  id: string;
  strategyId: string;
  pairAddress: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  rationale?: string;
  createdAt: string;
}

export interface Portfolio {
  walletAddress: string;
  totalValueUsd: number;
  dayChangeUsd: number;
  dayChangePct: number;
  holdings: Array<{
    token: Token;
    balance: string;
    valueUsd: number;
    change24hPct?: number;
  }>;
  updatedAt: string;
}

export interface Analytics {
  walletAddress: string;
  window: '7d' | '30d' | '90d' | 'all';
  totalPnL: number;
  winRate: number;
  totalVolume: number;
  totalFees: number;
  longCount: number;
  shortCount: number;
  largestGain: number;
  largestLoss: number;
  maxDrawdown: number;
  sharpe?: number;
  sessionPerformance: { london: number; ny: number; asia: number };
  pnlHistory: Array<{ timestamp: number; pnl: number; drawdown: number }>;
  generatedAt: string;
}
```

## 11) End-to-End User Flows and Required Backend Actions

### Flow A: User connects wallet
1. Frontend requests auth challenge for wallet address.
2. User signs challenge via Privy-connected wallet.
3. Frontend sends signed payload for verification.
4. Backend creates/loads user, binds wallet, returns session/JWT.
5. Frontend uses token for subsequent portfolio/orders/journal requests.

### Flow B: User selects token/market
1. Frontend requests trending/search markets.
2. User selects a pair.
3. Backend provides latest market metadata + initial candles.
4. Frontend subscribes to real-time stream for ticker/trades/book.
5. Backend pushes updates keyed by selected pair.

### Flow C: User views analytics
1. Frontend requests trade history or analytics summary.
2. Backend aggregates fills/orders into normalized trade records.
3. Backend computes metrics (or returns raw trades for client compute).
4. Frontend renders wrap/lyrics statistics and journal list.

### Flow D: User places manual trade
1. Frontend sends preview request (pair, side, size).
2. Backend returns estimated fill, fee, slippage, tx payload template.
3. User confirms and signs transaction.
4. Backend submits/relays order, tracks status.
5. Frontend receives status updates and reflects in journal + metrics.

### Flow E: User enables auto trading
1. Frontend starts strategy profile for wallet/pair/risk config.
2. Backend validates guardrails and transitions strategy to RUNNING.
3. Backend emits signals/executions in real time.
4. Frontend play/pause reflects authoritative server strategy state.
5. Backend persists signal outcomes for analytics + AI insights.

## 12) Risks / Missing Pieces
- Chain ambiguity: codebase includes Monad market context but Solana/Deriverse legacy types and comments.
- No canonical auth flow in UI yet.
- Manual trading UI has no submit handler or status handling.
- Orderbook/portfolio/insights are mocked; backend contracts must be introduced before removing mock dependencies.
- Current chart history is synthetic; users may misinterpret historical fidelity unless replaced with true OHLCV.

## 13) Implementation Priority (recommended)
1. Auth + wallet identity.
2. Markets + candles + ticker stream.
3. Portfolio endpoint.
4. Order preview/place/status.
5. Journal + analytics API.
6. Auto-trading lifecycle.
7. AI insights endpoint.
