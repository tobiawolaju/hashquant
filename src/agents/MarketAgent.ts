import { getPair } from '../services/market.js';
function ema(v:number[],p:number){const k=2/(p+1); return v.slice(1).reduce((a,c)=>c*k+a*(1-k),v[0]||0)}
function rsi(v:number[],p=14){if(v.length<p+1) return 50; let g=0,l=0; for(let i=v.length-p;i<v.length;i++){const d=v[i]-v[i-1]; if(d>=0) g+=d; else l-=d;} const rs=(g/p)/((l/p)||1e-9); return 100-(100/(1+rs));}
export class MarketAgent { async analyze(pairAddress:string){ const p=await getPair(pairAddress); const price=Number(p?.priceUsd||0); const series=Array.from({length:20},(_,i)=>price*(1+(Math.sin(i)*0.02))); const vol=Math.sqrt(series.reduce((s,v)=>s+Math.pow(v-price,2),0)/series.length)/Math.max(price,1e-9); return {price, volume24h:Number(p?.volume?.h24||0), rsi:rsi(series), ema:ema(series,10), volatility:vol}; } }
