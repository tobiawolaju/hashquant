"use client";

import { motion } from "framer-motion";
import { useDeriverseStore } from "@/lib/store";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from "recharts";

export default function PortfolioTechnicalDashboard() {
    const { metrics } = useDeriverseStore();

    const stats = [
        { label: "Profit Factor", value: metrics.profitFactor, sub: "Gross Profit / Gross Loss" },
        { label: "Expectancy", value: `$${metrics.expectancy}`, sub: "Avg profit per trade" },
        { label: "Long/Short", value: `${metrics.longCount}/${metrics.shortCount}`, sub: "Directional bias" },
        { label: "Avg Win/Loss", value: `$${metrics.avgWin} / $${metrics.avgLoss}`, sub: "Risk/Reward profile" },
    ];

    const sessionData = [
        { name: "London", pnl: metrics.sessionPerformance.london },
        { name: "New York", pnl: metrics.sessionPerformance.ny },
        { name: "Asia", pnl: metrics.sessionPerformance.asia },
    ];

    return (
        <section className="min-h-screen bg-abyss py-24 px-4 md:px-8 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 rounded-full bg-neon shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                ADVANCED <span className="text-neon">ANALYTICS</span>
                            </h2>
                        </div>
                        <p className="text-muted/60 text-sm max-w-md">
                            Deep-dive metrics for professional risk management and performance optimization.
                        </p>
                    </div>

                    <div className="bg-surface/30 glass rounded-2xl p-4 border border-white/5 flex items-center gap-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Total PnL</p>
                            <p className={`text-2xl font-mono font-bold ${metrics.totalPnL >= 0 ? "text-buy" : "text-sell"}`}>
                                {metrics.totalPnL >= 0 ? "+" : ""}${metrics.totalPnL.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Win Rate</p>
                            <p className="text-2xl font-mono font-bold text-white">{metrics.winRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Performance Curve */}
                    <div className="lg:col-span-2 rounded-3xl bg-abyss-light/20 border border-white/5 p-6 min-h-[400px]">
                        <h3 className="text-sm font-semibold text-white/80 mb-6 flex items-center gap-2">
                            Equity Curve <span className="text-[10px] text-muted font-normal">(PnL Velocity)</span>
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics.pnlHistory}>
                                    <defs>
                                        <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        hide
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickFormatter={(v) => `$${v}`}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#16161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}
                                        itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="pnl"
                                        stroke="#a855f7"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#pnlGrad)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Stack */}
                    <div className="flex flex-col gap-4">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-1 bg-surface/20 border border-white/5 rounded-2xl p-5 flex flex-col justify-center"
                            >
                                <p className="text-[10px] uppercase tracking-widest text-muted mb-1">{s.label}</p>
                                <p className="text-xl font-bold text-white mb-1">{s.value}</p>
                                <p className="text-[11px] text-muted/40">{s.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Session Performance */}
                    <div className="rounded-3xl bg-abyss-light/20 border border-white/5 p-6 h-[300px]">
                        <h3 className="text-sm font-semibold text-white/80 mb-6">Session Alpha</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sessionData}>
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#16161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                                        {sessionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#a855f7" : "rgba(255,255,255,0.2)"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Largest Outcome */}
                    <div className="rounded-3xl bg-surface/10 border border-white/5 p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-white/80 mb-4">Risk Extremes</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-buy/5 border border-buy/10">
                                    <p className="text-[10px] uppercase tracking-widest text-buy/60 mb-1">Single Largest Win</p>
                                    <p className="text-2xl font-bold text-buy">+${metrics.largestGain.toLocaleString()}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-sell/5 border border-sell/10">
                                    <p className="text-[10px] uppercase tracking-widest text-sell/60 mb-1">Single Largest Loss</p>
                                    <p className="text-2xl font-bold text-sell">${metrics.largestLoss.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted/40 italic mt-4">
                            Outliers often define your long-term expectancy.
                        </p>
                    </div>

                    {/* Fees Analysis */}
                    <div className="rounded-3xl bg-abyss-light/20 border border-white/5 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full border-4 border-neon/20 border-t-neon flex items-center justify-center mb-4">
                            <span className="text-xl">💰</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Fee Efficiency</h3>
                        <p className="text-3xl font-black text-white mb-1">${metrics.totalFees.toLocaleString()}</p>
                        <p className="text-xs text-muted/60 mb-6">Total Protocol Revenue Generated</p>

                        <div className="w-full flex gap-2">
                            <div className="flex-1 p-2 rounded-lg bg-white/5 text-[10px] text-muted">
                                GAS: $2.40
                            </div>
                            <div className="flex-1 p-2 rounded-lg bg-white/5 text-[10px] text-muted">
                                LP: ${(metrics.totalFees - 2.4).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
