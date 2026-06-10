import yfinance as yf
from datetime import datetime

from services.cache import get_cached, set_cached


def get_stock_info(symbol: str) -> dict:
    cache_key = f"info:{symbol}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    ticker = yf.Ticker(symbol)
    info = ticker.info or {}
    result = {
        "symbol": symbol,
        "name": info.get("longName", info.get("shortName", symbol)),
        "currentPrice": info.get("currentPrice", info.get("regularMarketPrice", 0)) or 0,
        "previousClose": info.get("regularMarketPreviousClose", 0) or 0,
        "change": info.get("regularMarketChange", 0) or 0,
        "changePercent": info.get("regularMarketChangePercent", 0) or 0,
        "volume": info.get("regularMarketVolume", 0) or 0,
        "avgVolume": info.get("averageVolume", 0) or 0,
        "marketCap": info.get("marketCap", 0) or 0,
        "peRatio": info.get("trailingPE", 0) or 0,
        "pbRatio": info.get("priceToBook", 0) or 0,
        "eps": info.get("trailingEps", 0) or 0,
        "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", 0) or 0,
        "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", 0) or 0,
        "sector": info.get("sector", ""),
        "industry": info.get("industry", ""),
        "dividendYield": info.get("dividendYield", 0) or 0,
        "exchange": "NSE" if ".NS" in symbol else "BSE" if ".BO" in symbol else "INDEX",
    }
    set_cached(cache_key, result)
    return result


def get_candle_data(symbol: str, period: str = "3mo", interval: str = "1d") -> list:
    cache_key = f"candle:{symbol}:{period}:{interval}"
    cached = get_cached(cache_key, ttl=120)
    if cached:
        return cached

    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=period, interval=interval)

    candles = []
    for index, row in hist.iterrows():
        ts = int(index.timestamp())
        candles.append({
            "time": ts,
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
        })
    set_cached(cache_key, candles)
    return candles


def get_multiple_stocks(symbols: list[str]) -> list[dict]:
    results = []
    for symbol in symbols:
        try:
            data = get_stock_info(symbol)
            if data.get("currentPrice"):
                results.append(data)
        except Exception:
            pass
    return results


def get_index_data(index_symbol: str) -> dict:
    cache_key = f"index:{index_symbol}"
    cached = get_cached(cache_key, ttl=60)
    if cached:
        return cached

    ticker = yf.Ticker(index_symbol)
    hist = ticker.history(period="5d", interval="1d")

    today = float(hist["Close"].iloc[-1]) if len(hist) > 0 else 0
    yesterday = float(hist["Close"].iloc[-2]) if len(hist) > 1 else today
    change = today - yesterday
    change_pct = (change / yesterday * 100) if yesterday != 0 else 0

    names = {
        "^NSEI": "Nifty 50",
        "^BSESN": "Sensex",
        "^NSEBANK": "Bank Nifty",
        "^CNXIT": "Nifty IT",
        "^CNXAUTO": "Nifty Auto",
        "^CNXFMCG": "Nifty FMCG",
    }

    result = {
        "symbol": index_symbol,
        "name": names.get(index_symbol, index_symbol),
        "value": round(today, 2),
        "change": round(change, 2),
        "changePercent": round(change_pct, 2),
    }
    set_cached(cache_key, result)
    return result
