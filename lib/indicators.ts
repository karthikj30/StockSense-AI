import {
  RSI,
  MACD,
  EMA,
  SMA,
  BollingerBands,
  ADX,
} from "technicalindicators";

import type { CandleData } from "./stock-data";

export interface TechnicalAnalysis {
  symbol: string;
  currentPrice: number;
  rsi: number;
  rsiSignal: "OVERBOUGHT" | "OVERSOLD" | "NEUTRAL";
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  macdCrossover: "BULLISH" | "BEARISH" | "NEUTRAL";
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  bbHigh: number;
  bbMid: number;
  bbLow: number;
  bbPosition: string;
  ema20: number;
  ema50: number;
  ema200: number;
  sma20: number;
  trend: string;
  adx: number;
  trendStrength: string;
  support: number;
  resistance: number;
  lastCandles: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    isGreen: boolean;
    bodyPercent: number;
    pattern: string;
  }[];
  priceVs52High: number;
  priceVs52Low: number;
  volumeSignal: string;
}

export function computeTechnicals(
  candles: CandleData[],
  symbol: string
): TechnicalAnalysis {
  if (candles.length < 50) {
    throw new Error("Need at least 50 candles for technical analysis");
  }

  const closes = candles.map((c) => c.close);
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const volumes = candles.map((c) => c.volume);
  const currentPrice = closes[closes.length - 1];

  const rsiValues = RSI.calculate({ values: closes, period: 14 });
  const rsiCurrent = rsiValues[rsiValues.length - 1] ?? 50;
  const rsiSignal =
    rsiCurrent > 70 ? "OVERBOUGHT" : rsiCurrent < 30 ? "OVERSOLD" : "NEUTRAL";

  const macdValues = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const macdLast = macdValues[macdValues.length - 1];
  const macdPrev = macdValues[macdValues.length - 2];
  const macdCrossover =
    macdLast && macdPrev
      ? macdLast.MACD! > macdLast.signal! &&
        macdPrev.MACD! <= macdPrev.signal!
        ? "BULLISH"
        : macdLast.MACD! < macdLast.signal! &&
            macdPrev.MACD! >= macdPrev.signal!
          ? "BEARISH"
          : "NEUTRAL"
      : "NEUTRAL";

  const bbValues = BollingerBands.calculate({
    values: closes,
    period: 20,
    stdDev: 2,
  });
  const bbLast = bbValues[bbValues.length - 1];
  const bbPosition =
    currentPrice > (bbLast?.upper ?? 0)
      ? "ABOVE_UPPER"
      : currentPrice > (bbLast?.middle ?? 0) * 1.01
        ? "NEAR_UPPER"
        : currentPrice < (bbLast?.lower ?? 0)
          ? "BELOW_LOWER"
          : currentPrice < (bbLast?.middle ?? 0) * 0.99
            ? "NEAR_LOWER"
            : "MIDDLE";

  const ema20Values = EMA.calculate({ values: closes, period: 20 });
  const ema50Values = EMA.calculate({ values: closes, period: 50 });
  const ema200Values =
    closes.length >= 200
      ? EMA.calculate({ values: closes, period: 200 })
      : null;
  const sma20Values = SMA.calculate({ values: closes, period: 20 });

  const ema20 = ema20Values[ema20Values.length - 1] ?? currentPrice;
  const ema50 = ema50Values[ema50Values.length - 1] ?? currentPrice;
  const ema200 = ema200Values
    ? (ema200Values[ema200Values.length - 1] ?? 0)
    : 0;
  const sma20 = sma20Values[sma20Values.length - 1] ?? currentPrice;

  let adxValue = 20;
  try {
    const adxValues = ADX.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: 14,
    });
    adxValue = adxValues[adxValues.length - 1]?.adx ?? 20;
  } catch {
    // ADX needs sufficient data
  }

  const trend =
    currentPrice > ema50 && ema50 > ema20 && adxValue > 30
      ? "STRONG_UPTREND"
      : currentPrice > ema50
        ? "UPTREND"
        : currentPrice < ema50 && ema50 < ema20 && adxValue > 30
          ? "STRONG_DOWNTREND"
          : currentPrice < ema50
            ? "DOWNTREND"
            : "SIDEWAYS";

  const trendStrength =
    adxValue > 35 ? "STRONG" : adxValue > 20 ? "MODERATE" : "WEAK";

  const recentLows = lows.slice(-20).sort((a, b) => a - b);
  const recentHighs = highs.slice(-20).sort((a, b) => b - a);
  const support = recentLows[2] ?? currentPrice * 0.95;
  const resistance = recentHighs[2] ?? currentPrice * 1.05;

  const allHighs = highs.slice(-252);
  const allLows = lows.slice(-252);
  const high52 = Math.max(...allHighs);
  const low52 = Math.min(...allLows);

  const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const lastVol = volumes[volumes.length - 1];
  const volumeSignal =
    lastVol > avgVol * 1.5 ? "HIGH" : lastVol < avgVol * 0.5 ? "LOW" : "NORMAL";

  const lastCandles = candles.slice(-5).map((c) => {
    const isGreen = c.close > c.open;
    const body = Math.abs(c.close - c.open);
    const range = c.high - c.low;
    const bodyPercent = range > 0 ? (body / range) * 100 : 0;
    const upperShadow = c.high - Math.max(c.open, c.close);
    const lowerShadow = Math.min(c.open, c.close) - c.low;

    let pattern = "Normal";
    if (bodyPercent < 10) pattern = "Doji (Indecision)";
    else if (!isGreen && upperShadow > body * 2)
      pattern = "Shooting Star (Bearish)";
    else if (isGreen && lowerShadow > body * 2) pattern = "Hammer (Bullish)";
    else if (bodyPercent > 80 && isGreen)
      pattern = "Bullish Marubozu (Strong Buy)";
    else if (bodyPercent > 80 && !isGreen)
      pattern = "Bearish Marubozu (Strong Sell)";

    return {
      date: new Date(c.time * 1000).toLocaleDateString("en-IN"),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
      isGreen,
      bodyPercent: parseFloat(bodyPercent.toFixed(1)),
      pattern,
    };
  });

  const bbUpper = parseFloat((bbLast?.upper ?? 0).toFixed(2));
  const bbMiddle = parseFloat((bbLast?.middle ?? 0).toFixed(2));
  const bbLower = parseFloat((bbLast?.lower ?? 0).toFixed(2));

  return {
    symbol,
    currentPrice,
    rsi: parseFloat(rsiCurrent.toFixed(2)),
    rsiSignal,
    macd: parseFloat((macdLast?.MACD ?? 0).toFixed(4)),
    macdSignal: parseFloat((macdLast?.signal ?? 0).toFixed(4)),
    macdHistogram: parseFloat((macdLast?.histogram ?? 0).toFixed(4)),
    macdCrossover,
    bbUpper,
    bbMiddle,
    bbLower,
    bbHigh: bbUpper,
    bbMid: bbMiddle,
    bbLow: bbLower,
    bbPosition,
    ema20: parseFloat(ema20.toFixed(2)),
    ema50: parseFloat(ema50.toFixed(2)),
    ema200: parseFloat(ema200.toFixed(2)),
    sma20: parseFloat(sma20.toFixed(2)),
    trend,
    adx: parseFloat(adxValue.toFixed(2)),
    trendStrength,
    support: parseFloat(support.toFixed(2)),
    resistance: parseFloat(resistance.toFixed(2)),
    lastCandles,
    priceVs52High: parseFloat(((currentPrice / high52) * 100).toFixed(1)),
    priceVs52Low: parseFloat(((currentPrice / low52) * 100).toFixed(1)),
    volumeSignal,
  };
}
