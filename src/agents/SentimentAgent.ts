import { Sentiment } from '../types/index.js';
export class SentimentAgent { classify(rsi:number,vol:number):Sentiment{ if(rsi>60&&vol<0.03) return 'bullish'; if(rsi<40&&vol>0.04) return 'bearish'; return 'neutral'; } }
