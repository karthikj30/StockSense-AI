export type CandlePatternSignal = "bullish" | "bearish" | "neutral";

export interface CandlePattern {
  name: string;
  signal: CandlePatternSignal;
  description: string;
  analogy: string;
}

export const CANDLE_PATTERNS: Record<string, CandlePattern> = {
  doji: {
    name: "Doji",
    signal: "neutral",
    description:
      "Open and close are nearly equal, forming a cross shape. Signals indecision — buyers and sellers are balanced.",
    analogy:
      "Like a tug-of-war where neither side can pull the rope. The market is pausing before picking a direction.",
  },
  hammer: {
    name: "Hammer",
    signal: "bullish",
    description:
      "Small body at the top with a long lower wick. Appears after a downtrend and suggests buyers are stepping in.",
    analogy:
      "Like a hammer hitting the floor — price was pushed down hard but bounced back up by the end of the day.",
  },
  inverted_hammer: {
    name: "Inverted Hammer",
    signal: "bullish",
    description:
      "Small body at the bottom with a long upper wick after a decline. Buyers tried to push price up — early reversal hint.",
    analogy:
      "Like testing a locked door — someone pushed hard from below, suggesting interest at these lower prices.",
  },
  hanging_man: {
    name: "Hanging Man",
    signal: "bearish",
    description:
      "Hammer shape appearing after an uptrend. Long lower wick shows selling pressure despite the recovery.",
    analogy:
      "Like a ceiling hook holding something heavy — the uptrend may be losing steam and ready to drop.",
  },
  shooting_star: {
    name: "Shooting Star",
    signal: "bearish",
    description:
      "Small body at the bottom with a long upper wick after an uptrend. Buyers pushed up but sellers took control.",
    analogy:
      "Like a firework that shoots up and fizzles — the rally ran out of fuel and sellers pushed price back down.",
  },
  bullish_engulfing: {
    name: "Bullish Engulfing",
    signal: "bullish",
    description:
      "A green candle completely engulfs the previous red candle's body. Strong reversal signal after a decline.",
    analogy:
      "Like a small wave being swallowed by a bigger one — buyers overwhelmed sellers in one decisive move.",
  },
  bearish_engulfing: {
    name: "Bearish Engulfing",
    signal: "bearish",
    description:
      "A red candle completely engulfs the previous green candle's body. Strong reversal signal after a rally.",
    analogy:
      "Like a sunny day suddenly covered by dark clouds — sellers took over and erased the previous day's gains.",
  },
  marubozu_bullish: {
    name: "Bullish Marubozu",
    signal: "bullish",
    description:
      "A full green body with no wicks. Buyers controlled the entire session from open to close.",
    analogy:
      "Like a one-way street going up — no hesitation, pure buying pressure all day long.",
  },
  marubozu_bearish: {
    name: "Bearish Marubozu",
    signal: "bearish",
    description:
      "A full red body with no wicks. Sellers controlled the entire session from open to close.",
    analogy:
      "Like a waterfall — price only went down with no bounce back during the session.",
  },
  morning_star: {
    name: "Morning Star",
    signal: "bullish",
    description:
      "Three-candle pattern: large red, small-bodied star, then large green. Classic bottom reversal after a downtrend.",
    analogy:
      "Like dawn breaking after a dark night — the worst selling is over and a new uptrend may be starting.",
  },
  evening_star: {
    name: "Evening Star",
    signal: "bearish",
    description:
      "Three-candle pattern: large green, small-bodied star, then large red. Classic top reversal after an uptrend.",
    analogy:
      "Like sunset ending a bright day — the rally is fading and sellers may take control next.",
  },
  piercing_line: {
    name: "Piercing Line",
    signal: "bullish",
    description:
      "A green candle opens below the prior red close and closes above its midpoint. Moderate bullish reversal.",
    analogy:
      "Like a needle piercing through fabric — buyers broke through the selling pressure from yesterday.",
  },
  dark_cloud_cover: {
    name: "Dark Cloud Cover",
    signal: "bearish",
    description:
      "A red candle opens above the prior green close and closes below its midpoint. Moderate bearish reversal.",
    analogy:
      "Like a dark cloud covering the sun — the optimism from yesterday is being overshadowed by sellers.",
  },
  three_white_soldiers: {
    name: "Three White Soldiers",
    signal: "bullish",
    description:
      "Three consecutive strong green candles with higher closes. Indicates sustained buying momentum.",
    analogy:
      "Like three soldiers marching forward in formation — a disciplined, powerful uptrend is underway.",
  },
  three_black_crows: {
    name: "Three Black Crows",
    signal: "bearish",
    description:
      "Three consecutive strong red candles with lower closes. Indicates sustained selling pressure.",
    analogy:
      "Like three crows signaling bad news — sellers are in control and the downtrend is gaining strength.",
  },
  spinning_top: {
    name: "Spinning Top",
    signal: "neutral",
    description:
      "Small body with upper and lower wicks of similar length. Shows indecision and potential trend exhaustion.",
    analogy:
      "Like a spinning top slowing down — momentum is fading and the market may be about to change direction.",
  },
  harami_bullish: {
    name: "Bullish Harami",
    signal: "bullish",
    description:
      "A small green candle contained within the prior large red candle's body. Suggests selling pressure is easing.",
    analogy:
      "Like a seed inside a pod — new life (buying interest) forming inside the previous selling move.",
  },
  harami_bearish: {
    name: "Bearish Harami",
    signal: "bearish",
    description:
      "A small red candle contained within the prior large green candle's body. Suggests buying momentum is fading.",
    analogy:
      "Like a storm cloud inside clear skies — trouble brewing within what looked like a strong rally.",
  },
};
