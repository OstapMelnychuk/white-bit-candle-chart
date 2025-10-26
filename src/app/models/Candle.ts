export interface Candle {
  timestamp: number;
  open: number;
  close: number;
  high: number;
  low: number;
  symbol: string;
  ema: number;
}
