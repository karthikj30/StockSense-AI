from fastapi import APIRouter, Query, HTTPException
import yfinance as yf
import ta

from services.yfinance_service import get_stock_info, get_candle_data, get_multiple_stocks
from services.nse_service import NSEService

router = APIRouter()
nse = NSEService()


@router.get("/batch/list")
async def batch_stocks(symbols: str = Query(...)):
    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    return get_multiple_stocks(symbol_list)


@router.get("/{symbol}/chart")
async def stock_chart(
    symbol: str,
    period: str = Query("3mo"),
    interval: str = Query("1d"),
):
    try:
        return get_candle_data(symbol, period, interval)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{symbol}/technical")
async def technical_data(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="6mo", interval="1d")

        if len(hist) < 50:
            raise HTTPException(status_code=400, detail="Not enough data")

        close = hist["Close"]
        high = hist["High"]
        low = hist["Low"]

        rsi = ta.momentum.RSIIndicator(close, window=14).rsi()
        macd_obj = ta.trend.MACD(close)
        macd = macd_obj.macd()
        macd_signal = macd_obj.macd_signal()
        bb = ta.volatility.BollingerBands(close, window=20)
        ema_20 = ta.trend.EMAIndicator(close, window=20).ema_indicator()
        ema_50 = ta.trend.EMAIndicator(close, window=50).ema_indicator()
        ema_200 = ta.trend.EMAIndicator(close, window=200).ema_indicator()
        sma_20 = ta.trend.SMAIndicator(close, window=20).sma_indicator()
        adx = ta.trend.ADXIndicator(high, low, close).adx()

        current_price = float(close.iloc[-1])
        last_candles = hist.tail(5).reset_index().to_dict("records")

        return {
            "symbol": symbol,
            "currentPrice": current_price,
            "rsi": round(float(rsi.iloc[-1]), 2),
            "macd": round(float(macd.iloc[-1]), 4),
            "macdSignal": round(float(macd_signal.iloc[-1]), 4),
            "macdHistogram": round(float((macd - macd_signal).iloc[-1]), 4),
            "bbHigh": round(float(bb.bollinger_hband().iloc[-1]), 2),
            "bbLow": round(float(bb.bollinger_lband().iloc[-1]), 2),
            "bbMid": round(float(bb.bollinger_mavg().iloc[-1]), 2),
            "ema20": round(float(ema_20.iloc[-1]), 2),
            "ema50": round(float(ema_50.iloc[-1]), 2),
            "ema200": round(float(ema_200.iloc[-1]), 2),
            "sma20": round(float(sma_20.iloc[-1]), 2),
            "adx": round(float(adx.iloc[-1]), 2),
            "trend": "UPTREND" if current_price > float(ema_50.iloc[-1]) else "DOWNTREND",
            "lastCandles": [
                {
                    "date": str(c.get("Date", "")),
                    "open": round(float(c["Open"]), 2),
                    "high": round(float(c["High"]), 2),
                    "low": round(float(c["Low"]), 2),
                    "close": round(float(c["Close"]), 2),
                    "volume": int(c["Volume"]),
                    "bodySize": abs(float(c["Close"]) - float(c["Open"])),
                    "isGreen": float(c["Close"]) > float(c["Open"]),
                }
                for c in last_candles
            ],
            "priceVs52High": round((current_price / hist["High"].max()) * 100, 1),
            "priceVs52Low": round((current_price / hist["Low"].min()) * 100, 1),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{symbol}")
async def stock_detail(symbol: str):
    try:
        return get_stock_info(symbol)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
