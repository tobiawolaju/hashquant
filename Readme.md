# 💎 Hashquant: Turning Random James into Quants

**Hashquant** is a high-fidelity, on-chain trading dashboard built for the **Deriverse Ecosystem**. Our mission is to **turn retail traders into quants** by providing narrated analytics and a high-performance interactive trading journal that transforms raw Solana data into actionable strategy.

---

## 🚀 The Hackathon Pitch: Narrated Analytics

Hashquant addresses the **Deriverse Hackathon** requirements by moving beyond static charts and into the future of data storytelling. 

### 🎨 Emotional Storytelling (The "Quant Narrative" Layer)
We don't just show data; we tell the story of your edge. Hashquant features a dynamic, "lyrics-style" portfolio review that narrates your trading journey:
- **Session Alpha**: Identifies exactly when you have your quant edge (London vs. NY).
- **Directional Bias**: Critiques your Long/Short ratio.
- **Risk Resilience**: Narrates your recovery from max drawdown.

### 📊 Technical Rigor (Advanced Analytics)
Powered by a custom on-chain indexer, Hashquant computes 13+ critical KPIs directly from the **Deriverse Program ID** (`CDESjex...`):
- **Equity Curve & Drawdown**: High-fidelity Recharts visualizations of PnL velocity.
- **Fee Leakage Analysis**: Transparent tracking of protocol vs. gas fees.
- **Profit Factor & Expectancy**: Professional-grade statistical modeling.
- **Win Rate & Distribution**: Deep-dive metrics for strategy optimization.

### 📝 Smart Trading Journal
Every trade is automatically indexed and enriched with a high-performance **TradingView Lightweight Chart** snapshot.
- **Trade Playback**: See exactly what the market looked like at the moment of your entry.
- **Notes & Ethics**: Locally stored annotations (Privacy First) to track emotions and self-correct behaviors.

---

## 🛠️ Technical Architecture

Hashquant is a professional-grade frontend solution for the Solana mainnet/devnet environment:

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS (Abyss Dark Theme)
- **Charts**: `lightweight-charts` (Financial) + `recharts` (Analytics)
- **Auth & Wallet**: Privy (Embedded Wallets & Signer Bridge)
- **State**: Zustand (Reactive Metrics Engine)
- **On-Chain**: `@solana/web3.js` + Custom Deriverse Indexer

---

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-username/Hashquant.git
   cd Hashquant/client
   npm install
   ```

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_DERIVERSE_PROGRAM_ID=CDESjex4EDBKLwx9ZPzVbjiHEHatasb5fhSJZMzNfvw2
   NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
   ```

3. **Run Dev**:
   ```bash
   npm run dev
   ```

---

## 🔒 Privacy & Security

- **Local Annotations**: Your notes and emotions are stored in **IndexedDB/LocalStorage**. 
- **On-Chain Transparency**: Performance data is derived purely from public blockchain data.
- **Non-Custodial**: Your keys, your crypto. Handled via Privy/Solana Web3.js bridge.

---

## 🏆 Submission Category
**Design & Develop a Comprehensive Trading Analytics Solution for Deriverse.**

*Hashquant: Empowering the next generation of on-chain quants.*
