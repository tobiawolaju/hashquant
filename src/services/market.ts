import { redis } from './redis.js';
const BASE='https://api.dexscreener.com/latest/dex';
export async function getTrendingMarkets(){const c=await redis.get('markets:trending'); if(c) return JSON.parse(c); const r=await fetch(`${BASE}/search?q=monad`); const j:any=await r.json(); const pairs=(j.pairs||[]).slice(0,50); await redis.set('markets:trending',JSON.stringify(pairs),'EX',30); return pairs;}
export async function getPair(pairAddress:string){const r=await fetch(`${BASE}/search?q=${pairAddress}`); const j:any=await r.json(); return (j.pairs||[]).find((p:any)=>p.pairAddress?.toLowerCase()===pairAddress.toLowerCase())||null;}
export async function getPairTrades(pairAddress:string){const p=await getPair(pairAddress); if(!p) return []; return [{price:Number(p.priceUsd),amount:Number(p.volume?.h24||0)/1000,side:'buy',timestamp:Date.now()}];}
export async function getOrderbook(pairAddress:string){const p=await getPair(pairAddress); const mid=Number(p?.priceUsd||0); return {pairAddress,sequence:Date.now(),bids:[1,2,3,4,5].map(i=>({price:mid*(1-i*0.001),size:100*i})),asks:[1,2,3,4,5].map(i=>({price:mid*(1+i*0.001),size:100*i})),timestamp:Date.now()};}
