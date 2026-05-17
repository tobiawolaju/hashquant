"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { useState, useEffect } from "react";
import { LightweightChart } from "./LightweightChart";
import { useMarketData } from "../hooks/useMarketData";
import { Timeframe } from "../services/candleAggregator";
import { Search, ChevronDown, MousePointer2, Slash, Minus, Ruler, Magnet, Trash2, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

import { mockWalletData } from "@/lib/mockWalletData";
import { mockOrderBookData } from "@/lib/mockOrderBook";
import { MarketEntry } from "@/types/token";
import { dexscreenerService } from "@/services/dexscreenerService";
import { MONAD_CHAIN_ID } from "@/lib/monadTokens";


const tabs: TabType[] = ["Chart", "Orderbook", "Wallet"];


const timeframes: Timeframe[] = ['1s', '1m', '5m', '15m'];

type OrderPanelTab = "Open Orders" | "Positions";

const orderPanelTabs: OrderPanelTab[] = ["Open Orders", "Positions"];

const openOrders = [
    { pair: "MONI/MON", side: "BUY", price: "$0.000021", size: "50,000", status: "Pending" },
    { pair: "IGN/MON", side: "BUY", price: "$0.000230", size: "12,000", status: "Pending" },
    { pair: "MON/USDC", side: "SELL", price: "$0.0291", size: "800", status: "Partial" },
    { pair: "LV/MON", side: "BUY", price: "$0.000058", size: "30,000", status: "Pending" },
];

const positions = [
    { pair: "MONI/MON", entry: "$0.000019", current: "$0.000026", pnl: "+$36.40" },
    { pair: "IGN/MON", entry: "$0.000201", current: "$0.000249", pnl: "+$57.60" },
    { pair: "MON/USDC", entry: "$0.02950", current: "$0.02801", pnl: "-$11.92" },
    { pair: "LV/MON", entry: "$0.000061", current: "$0.000059", pnl: "-$6.00" },
];

export default function ViewPager() {
    const { activeTab, activeMarket, setActiveMarket, availableMarkets, setAvailableMarkets } = useDeriverseStore();
    const currentIndex = tabs.indexOf(activeTab);
    const [prevIndex, setPrevIndex] = useState(currentIndex);
    const [direction, setDirection] = useState(0);
    const [timeframe, setTimeframe] = useState<Timeframe>('1m');
    const [activeTool, setActiveTool] = useState<string>("cursor");
    const [isMagnetActive, setIsMagnetActive] = useState(false);
    const [activeOrderPanelTab, setActiveOrderPanelTab] = useState<OrderPanelTab>("Open Orders");

    // Update direction when tab changes
    if (currentIndex !== prevIndex) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
        setPrevIndex(currentIndex);
    }

    // Load trending Monad pairs from DexScreener on mount
    useEffect(() => {
        const loadMarkets = async () => {
            try {
                const trendingMarkets = await dexscreenerService.getTrendingPairs(MONAD_CHAIN_ID, 50);

                if (trendingMarkets.length > 0) {
                    setAvailableMarkets(trendingMarkets);

                    // Set the first market as active if none selected yet
                    if (!activeMarket.pairAddress) {
                        setActiveMarket(trendingMarkets[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to load markets:', error);
            }
        };

        loadMarkets();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // We request data for the active market's pair address
    const { candles, loading, currentPrice, setOnCandleUpdate } = useMarketData(activeMarket.pairAddress, timeframe);


    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <section className="h-[70vh] w-screen flex flex-col relative overflow-hidden bg-abyss">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Header Controls - Centered (Only on Chart) */}
            {activeTab === "Chart" && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                    {/* Active Market Display */}
                    <div className="flex items-center gap-2 bg-abyss-light/40 glass rounded-full px-4 py-2 shadow-2xl">
                        {activeMarket.iconUrl ? (
                            <img src={activeMarket.iconUrl} alt={activeMarket.symbol} className="w-4 h-4 rounded-full border border-white/10" />
                        ) : (
                            <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/30 uppercase">
                                {activeMarket.baseSymbol?.[0]}
                            </div>
                        )}
                        <span className="text-xs font-black text-white tracking-tighter">{activeMarket.symbol || 'Loading...'}</span>
                        {currentPrice !== null && (
                            <span className="text-xs font-mono text-neon">
                                ${currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}
                            </span>
                        )}
                        {activeMarket.priceChange24h !== 0 && (
                            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${activeMarket.priceChange24h >= 0 ? 'text-buy' : 'text-sell'}`}>
                                {activeMarket.priceChange24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {activeMarket.priceChange24h >= 0 ? '+' : ''}{activeMarket.priceChange24h.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex bg-abyss-light/40 glass rounded-full p-1 gap-1 shadow-2xl">
                        {timeframes.map(tf => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-5 py-2 rounded-full text-[12px] font-black tracking-tighter transition-all ${timeframe === tf
                                    ? 'bg-neon text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    : 'text-muted hover:text-white'
                                    }`}
                            >
                                {tf.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Immersive Chart Area */}
            <div className="flex-1 w-full h-full relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0 w-full h-full"
                    >


                        {activeTab === "Orderbook" && (
                            <div className="w-full h-full flex flex-col bg-abyss text-white/90 pt-12 px-4 sm:px-6 pb-24 select-none overflow-hidden">
                                <div className="flex min-h-0 flex-[1.05] flex-col overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.015] px-3 py-3">
                                    {/* Orderbook Header */}
                                    <div className="flex justify-between items-center pb-3 border-b border-white/5 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase shrink-0">
                                        <span className="w-1/3 text-left">Price (USD)</span>
                                        <span className="w-1/3 text-right">Size</span>
                                        <span className="w-1/3 text-right">Total</span>
                                    </div>

                                    <div
                                        className="min-h-0 flex-1 flex flex-col justify-end overflow-y-auto py-1 pr-1"
                                        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 18%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%)' }}
                                    >
                                        {mockOrderBookData.asks.slice(0, 24).reverse().map((ask, i) => {
                                            const total = parseFloat(ask.total);
                                            const maxTotal = parseFloat(mockOrderBookData.asks[23].total);
                                            const depthPercent = (total / maxTotal) * 100;

                                            return (
                                                <div key={`ask-${i}`} className="group relative flex justify-between items-center min-h-6 text-[12px] font-mono hover:bg-white/5 transition-colors">
                                                    {/* Depth Bar */}
                                                    <div
                                                        className="absolute right-0 top-0 bottom-0 bg-white/5 transition-all duration-500"
                                                        style={{ width: `${depthPercent}%` }}
                                                    />
                                                    <span className="w-1/3 text-left text-white/40 font-black z-10">{ask.price}</span>
                                                    <span className="w-1/3 text-right text-white/70 z-10">{ask.size}</span>
                                                    <span className="w-1/3 text-right text-white/30 z-10">{ask.total}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Current Price / Spread Indicator */}
                                    <div className="sticky top-0 bottom-0 z-20 py-4 my-2 border-y border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl overflow-hidden shrink-0 shadow-[0_0_28px_rgba(124,58,237,0.12)]">
                                        <div className="absolute inset-0 bg-neon-dim/10 animate-pulse" />
                                        <div className="relative flex items-center justify-between px-2">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(124,58,237,0.45)]">
                                                    {currentPrice?.toFixed(currentPrice < 1 ? 6 : 2) || activeMarket.priceUsd || "—"}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest -mt-1">Mid Price</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-xs font-mono ${activeMarket.priceChange24h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                                    {activeMarket.priceChange24h >= 0 ? '+' : ''}{activeMarket.priceChange24h.toFixed(2)}%
                                                </span>
                                                <span className="text-[10px] font-mono text-[#6b7280]">Spread: 1.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="min-h-0 flex-1 flex flex-col justify-start overflow-y-auto py-1 pr-1"
                                        style={{ maskImage: 'linear-gradient(to top, transparent, black 18%)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 18%)' }}
                                    >
                                        {mockOrderBookData.bids.slice(0, 24).map((bid, i) => {
                                            const total = parseFloat(bid.total);
                                            const maxTotal = parseFloat(mockOrderBookData.bids[23].total);
                                            const depthPercent = (total / maxTotal) * 100;

                                            return (
                                                <div key={`bid-${i}`} className="group relative flex justify-between items-center min-h-6 text-[12px] font-mono hover:bg-white/5 transition-colors">
                                                    {/* Depth Bar */}
                                                    <div
                                                        className="absolute right-0 top-0 bottom-0 bg-neon-dim/15 transition-all duration-500"
                                                        style={{ width: `${depthPercent}%` }}
                                                    />
                                                    <span className="w-1/3 text-left text-neon-dim font-black z-10">{bid.price}</span>
                                                    <span className="w-1/3 text-right text-white/70 z-10">{bid.size}</span>
                                                    <span className="w-1/3 text-right text-white/30 z-10">{bid.total}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-3 flex min-h-0 flex-[0.95] flex-col overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.02] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
                                    <div className="grid w-full grid-cols-2 gap-2 rounded-full bg-white/[0.03] p-1 border border-white/5 shrink-0">
                                        {orderPanelTabs.map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveOrderPanelTab(tab)}
                                                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition-all ${activeOrderPanelTab === tab
                                                    ? 'bg-[#7C3AED] text-white shadow-[0_0_24px_rgba(124,58,237,0.35)]'
                                                    : 'bg-transparent text-[#6b7280] hover:text-white'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                                        {activeOrderPanelTab === "Open Orders" ? (
                                            <div className="min-w-full">
                                                <div className="grid grid-cols-[1.25fr_0.75fr_1fr_0.85fr_0.9fr] gap-2 pb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#6b7280]">
                                                    <span>Pair</span>
                                                    <span>Side</span>
                                                    <span className="text-right">Price</span>
                                                    <span className="text-right">Size</span>
                                                    <span className="text-right">Status</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {openOrders.map((order) => (
                                                        <div key={`${order.pair}-${order.price}-${order.size}`} className="grid grid-cols-[1.25fr_0.75fr_1fr_0.85fr_0.9fr] gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 text-[11px] font-mono text-white/80">
                                                            <span className="font-black text-white">{order.pair}</span>
                                                            <span className={`font-black ${order.side === 'BUY' ? 'text-[#7C3AED]' : 'text-[#6b7280]'}`}>{order.side}</span>
                                                            <span className="text-right text-white/70">{order.price}</span>
                                                            <span className="text-right text-white/70">{order.size}</span>
                                                            <span className="text-right text-[#6b7280]">{order.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="min-w-full">
                                                <div className="grid grid-cols-[1.15fr_1fr_1fr_0.85fr] gap-2 pb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#6b7280]">
                                                    <span>Pair</span>
                                                    <span className="text-right">Entry</span>
                                                    <span className="text-right">Current</span>
                                                    <span className="text-right">PnL</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {positions.map((position) => (
                                                        <div key={`${position.pair}-${position.entry}`} className="grid grid-cols-[1.15fr_1fr_1fr_0.85fr] gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-3 py-3 text-[11px] font-mono text-white/80">
                                                            <span className="font-black text-white">{position.pair}</span>
                                                            <span className="text-right text-white/70">{position.entry}</span>
                                                            <span className="text-right text-white/70">{position.current}</span>
                                                            <span className={`text-right font-black ${position.pnl.startsWith('+') ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{position.pnl}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}



                        {activeTab === "Wallet" && (
                            <div
                                className="w-full h-full flex flex-col items-center justify-start bg-abyss pt-12 px-6 overflow-y-auto pb-24 scrollbar-hide"
                                style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
                            >
                                <div className="w-full max-w-sm flex flex-col items-center gap-1 mb-10">
                                    <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        {mockWalletData.totalBalanceUsd}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-mono text-neon bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
                                            {mockWalletData.address}
                                        </p>
                                        <button
                                            type="button"
                                            aria-label="Logout wallet"
                                            onClick={() => {}}
                                            className="text-xs font-mono text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full max-w-sm flex flex-col gap-3">
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest pl-2 mb-2">Assets</h3>
                                    {mockWalletData.tokens.map(token => (
                                        <div key={token.id} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 glass hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center text-neon border border-neon/30 font-black">
                                                    {token.symbol[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white">{token.symbol}</span>
                                                    <span className="text-xs text-white/50">{token.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-white">{token.usdValue}</span>
                                                <div className="flex gap-2">
                                                    <span className="text-xs text-white/50">{token.balance} {token.symbol}</span>
                                                    <span className={`text-xs ${token.isUp ? 'text-buy' : 'text-sell'}`}>
                                                        {token.change24h}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Hoisted Chart Container to prevent Unmount crashes */}
                <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'Chart' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'}`}
                >
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center bg-abyss">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={24} className="text-neon animate-spin" />
                                <div className="text-neon/30 text-xs font-black tracking-[0.3em] uppercase">
                                    Connecting to Monad...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LightweightChart
                            data={candles}
                            onTick={setOnCandleUpdate}
                            activeTool={activeTool}
                            isMagnetActive={isMagnetActive}
                            onToolChange={setActiveTool}
                        />
                    )}
                </div>

                {/* Left Sidebar - Quant Tools (Only visible on Chart) */}
                {activeTab === "Chart" && (
                    <div
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-2 p-1.5 bg-abyss-light/60 glass-heavy rounded-full shadow-2xl border border-white/5 touch-none"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <MarketSelector
                            activeMarket={activeMarket}
                            markets={availableMarkets}
                            onSelect={setActiveMarket}
                        />

                        <ToolButton
                            icon={<MousePointer2 size={18} />}
                            active={activeTool === "cursor"}
                            onClick={() => setActiveTool("cursor")}
                        />
                        <div className="w-full h-px bg-white/5 my-1" />
                        <ToolButton
                            icon={<Slash size={18} />}
                            active={activeTool === "trend"}
                            onClick={() => setActiveTool("trend")}
                        />
                        <ToolButton
                            icon={<Minus size={18} />}
                            active={activeTool === "level"}
                            onClick={() => setActiveTool("level")}
                        />
                        <ToolButton
                            icon={<Ruler size={18} />}
                            active={activeTool === "measure"}
                            onClick={() => setActiveTool("measure")}
                        />
                        <div className="w-full h-px bg-white/5 my-1" />
                        <ToolButton
                            icon={<Magnet size={18} />}
                            active={isMagnetActive}
                            onClick={() => setIsMagnetActive(!isMagnetActive)}
                        />
                        <ToolButton
                            icon={<Trash2 size={18} />}
                            className="text-sell/60 hover:text-sell"
                            onClick={() => setActiveTool("trash")}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

function MarketSelector({ activeMarket, markets, onSelect }: { activeMarket: MarketEntry; markets: MarketEntry[]; onSelect: (m: MarketEntry) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMarkets = markets.filter(m =>
        m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dexId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-12 h-14 flex flex-col items-center justify-center rounded-full transition-all duration-200 gap-1
                    ${isOpen ? 'bg-neon text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-muted hover:bg-white/5 hover:text-white'}
                `}
            >
                {activeMarket.iconUrl ? (
                    <img src={activeMarket.iconUrl} alt={activeMarket.symbol} className="w-5 h-5 rounded-full border border-white/20 mb-0.5 shadow-sm" />
                ) : (
                    <span className="text-[8px] font-black tracking-tighter uppercase opacity-50">Pair</span>
                )}
                <span className="text-[10px] font-black tracking-tighter leading-none">{activeMarket.baseSymbol || '...'}</span>
                <ChevronDown size={10} className={`mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        className="absolute left-14 top-0 z-[100] w-72 bg-abyss-light/95 glass-heavy rounded-2xl border border-white/10 shadow-2xl p-2 overflow-hidden flex flex-col"
                    >
                        <div className="px-3 py-2 border-b border-white/5 mb-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Monad Markets</span>
                                <span className="text-neon/50 text-[10px] font-bold">Live</span>
                            </div>
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search pair or DEX..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-neon/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto scrollbar-hide px-1 pb-1">
                            {filteredMarkets.map((market) => (
                                <button
                                    key={market.pairAddress || market.symbol}
                                    onClick={() => {
                                        onSelect(market);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                                        ${activeMarket.pairAddress === market.pairAddress
                                            ? 'bg-neon/20 text-white border border-neon/30'
                                            : 'hover:bg-white/5 text-white/60 hover:text-white border border-transparent'}
                                    `}
                                >
                                    <div className="flex flex-col items-start gap-0.5">
                                        <div className="flex items-center gap-1.5">
                                            {market.iconUrl ? (
                                                <img src={market.iconUrl} alt={market.symbol} className="w-3.5 h-3.5 rounded-full border border-white/10" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[7px] font-black text-white/30 truncate uppercase">
                                                    {market.baseSymbol?.[0]}
                                                </div>
                                            )}
                                            <span className="text-xs font-black">{market.symbol}</span>
                                            {market.dexId && (
                                                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/5 text-white/30 group-hover:text-white/50 border border-white/5 uppercase tracking-tighter truncate max-w-[60px]">
                                                    {market.dexId.startsWith('0x')
                                                        ? `${market.dexId.slice(0, 4)}...${market.dexId.slice(-2)}`
                                                        : market.dexId}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[9px] opacity-40 font-bold truncate max-w-[120px] ml-[1.15rem] leading-none">{market.name}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-[10px] font-mono text-white/70">
                                            {market.priceUsd !== '—' && market.priceUsd !== '0'
                                                ? `$${parseFloat(market.priceUsd) < 1 ? parseFloat(market.priceUsd).toFixed(6) : parseFloat(market.priceUsd).toFixed(2)}`
                                                : '—'
                                            }
                                        </span>
                                        {market.priceChange24h !== 0 && (
                                            <span className={`text-[9px] font-bold ${market.priceChange24h >= 0 ? 'text-buy' : 'text-sell'}`}>
                                                {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}

                            {markets.length === 0 && (
                                <div className="flex items-center justify-center py-6 text-white/20 text-[10px] font-bold">
                                    <Loader2 size={14} className="animate-spin mr-2" />
                                    Scanning Monad...
                                </div>
                            )}

                            {markets.length > 0 && filteredMarkets.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-white/20">
                                    <span className="text-xs font-bold mb-1">No matches found</span>
                                    <span className="text-[10px]">Try a different token or DEX</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ToolButton({ icon, active, onClick, className = "" }: { icon: React.ReactNode; active?: boolean; onClick: () => void; className?: string }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`
            w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
            ${active
                    ? 'bg-neon text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-muted hover:bg-white/5 hover:text-white'}
            ${className}
        `}>
            {icon}
        </button>
    );
}
