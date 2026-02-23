# Dominus Quant (DQuant)

**Dominus Quant (DQuant)** is a narrative-driven, AI-assisted trading intelligence platform designed for crypto markets. Built as a personal project, it combines portfolio analytics, behavioral insights, and optional automated execution to help retail traders make data-driven decisions while keeping self-sabotage in check.

This project showcases full-stack, distributed, and on-chain infrastructure design suitable for Web3 or blockchain system engineering roles.

---

## Key Features

### 1. Narrative Portfolio Analytics
- Transforms raw trade data into actionable insights.  
- Generates narrative-style summaries (like a “sportif wrap”) for each trade and session.  
- Highlights patterns in trading psychology, peak performance periods, and strategy efficiency.

**Example Insights:**
- “In your last 30 days, you traded 87 times. 62% were long. Your best day was Tuesday.”  
- “You lose 58% of trades you entered within 15 minutes of a previous loss.”  
- “Your win rate drops after 3 consecutive wins.”  

---

### 2. Deep AI Intelligence
- AI-driven recommendations to prevent self-sabotage.  
- Behavioral analysis of execution timing, strategy, and FOMO tendencies.  
- Detects performance decay, optimal holding periods, and risk patterns.

**Example AI Insights:**
- Execution Timing: “You are profitable when holding trades longer than 2 hours.”  
- Psychology Trap: “You lose 58% of trades you entered within 15 minutes of a previous loss.”  
- Performance Decay: “Win rate drops after 3 consecutive wins.”

---

### 3. Trade Journaling
- Automatic indexing of trades with structured metadata: pair, PnL, date, strategy notes.  
- Quick navigation between trades with embedded lessons.  
- Supports spot trading across multiple assets (SOL, BTC, ETH, etc.).

**Sample Trade Entries:**
- **SOL/USDC | 2026-02-19 | +$342.50** – Clean breakout from 4H consolidation. Entered on retest of $148.  
- **BTC/USDC | 2026-02-18 | $128.30** – FOMO into a pump. No setup, just chased the green candle.  
- **ETH/USDC | 2026-02-17 | +$89.10** – Scalped London session open. Tight stop, quick profit.

---

### 4. Portfolio Analytics Dashboard
- Tracks cumulative PnL, win rate, trading volume, fees, and long/short bias.  
- Detects best sessions and peak focus periods.  
- Highlights largest gains and losses to improve strategy refinement.

**Example Dashboard Metrics:**
- Total PnL: +$890.3  
- Win Rate: 60%  
- Long/Short Bias: 0:0 (Bearish leaning)  
- Best Session: New York  
- Largest Single Gain: +$567.2  

---

## System Architecture

This project demonstrates engineering depth across frontend, backend, and infrastructure:

**Frontend**
- Next.js 16 (App Router)  
- Tailwind CSS (Abyss Dark Theme)  
- Zustand (Reactive Metrics Engine)  

**Charts & Visualizations**
- `lightweight-charts` for trade playback  
- `recharts` for portfolio analytics  

**Backend / On-Chain Integration**
- `@solana/web3.js` + custom Deriverse indexer  
- Automated signal processing pipeline  
- Optional pool-based trading engine (user capital aggregation)

**AI & Intelligence Layer**
- Real-time behavioral analytics  
- Signal confidence scoring  
- Execution pattern detection and recommendations

**Distributed Design**
- Edge-device readiness for signal monitoring  
- Modular architecture supporting future decentralized execution  

---

## Why This Project Matters

- Demonstrates ability to handle **real-time analytics** and **complex state management**.  
- Showcases **on-chain integration** with Solana ecosystem.  
- Highlights **AI and behavioral analytics** for decision-making.  
- Provides a **playground for distributed, multi-user systems**.  
- Serves as a portfolio piece proving full-stack, infrastructure, and systems engineering competency in Web3 contexts.

---

## Next Steps / Expansion

- Optional automated pool mode for capital allocation and trading.  
- Real-time narrative detection engine for multiple assets.  
- Edge-device distributed intelligence contribution.  
- Extended AI insights for adaptive risk management and strategy optimization.  

---

## Tech Stack Highlights

- **Frontend:** Next.js 16, Tailwind CSS, Zustand  
- **Charts & Analytics:** Lightweight Charts, Recharts  
- **Backend / On-Chain:** Solana web3.js, Deriverse Indexer  
- **AI Layer:** Custom Python / Node.js signal analysis  
- **Distributed Design:** Edge node integration, modular infrastructure  

---

This repository is intended as both a **personal engineering portfolio** and a demonstration of how to combine **full-stack, Web3, and AI infrastructure** to build next-generation trading platforms.