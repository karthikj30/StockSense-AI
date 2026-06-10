from fastapi import APIRouter
from services.yfinance_service import get_index_data, get_multiple_stocks
from services.nse_service import NSEService

router = APIRouter()
nse = NSEService()


@router.get("/indices")
async def market_indices():
    indices = ["^NSEI", "^BSESN", "^NSEBANK", "^CNXIT", "^CNXAUTO"]
    return [get_index_data(idx) for idx in indices]


@router.get("/gainers")
async def top_gainers():
    gainers = nse.get_top_gainers()
    if gainers:
        return gainers
    symbols = ["TATAMOTORS.NS", "ADANIENT.NS", "BAJFINANCE.NS", "MARUTI.NS", "SUNPHARMA.NS"]
    stocks = get_multiple_stocks(symbols)
    return sorted(stocks, key=lambda x: x.get("changePercent", 0), reverse=True)[:5]


@router.get("/losers")
async def top_losers():
    losers = nse.get_top_losers()
    if losers:
        return losers
    symbols = ["ZOMATO.NS", "PAYTM.NS", "NYKAA.NS", "WIPRO.NS", "INFY.NS"]
    stocks = get_multiple_stocks(symbols)
    return sorted(stocks, key=lambda x: x.get("changePercent", 0))[:5]


@router.get("/trending")
async def trending_stocks():
    symbols = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS",
        "ICICIBANK.NS", "WIPRO.NS", "TATAMOTORS.NS", "BAJFINANCE.NS",
        "SUNPHARMA.NS", "ADANIENT.NS", "SBIN.NS", "MARUTI.NS",
    ]
    return get_multiple_stocks(symbols)


@router.get("/heatmap")
async def sector_heatmap():
    sectors = {
        "Banking": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "KOTAKBANK.NS"],
        "IT": ["TCS.NS", "INFY.NS", "WIPRO.NS", "HCLTECH.NS"],
        "Auto": ["TATAMOTORS.NS", "MARUTI.NS", "M&M.NS", "EICHERMOT.NS"],
        "Pharma": ["SUNPHARMA.NS", "CIPLA.NS", "DRREDDY.NS", "DIVISLAB.NS"],
        "Energy": ["RELIANCE.NS", "ONGC.NS", "BPCL.NS", "TATAPOWER.NS"],
        "FMCG": ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "GODREJCP.NS"],
    }
    result = []
    for sector, symbols in sectors.items():
        stocks = get_multiple_stocks(symbols)
        if stocks:
            avg_change = sum(s.get("changePercent", 0) for s in stocks) / len(stocks)
            result.append({"sector": sector, "changePercent": round(avg_change, 2), "stocks": len(stocks)})
    return result
