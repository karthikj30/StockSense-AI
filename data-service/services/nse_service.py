import requests


class NSEService:
    BASE_URL = "https://www.nseindia.com/api"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com",
        "Connection": "keep-alive",
    }

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        self._init_session()

    def _init_session(self):
        try:
            self.session.get("https://www.nseindia.com", timeout=10)
        except Exception:
            pass

    def get_nifty50_constituents(self) -> list:
        try:
            r = self.session.get(
                f"{self.BASE_URL}/equity-stockIndices?index=NIFTY%2050",
                timeout=10,
            )
            data = r.json()
            return data.get("data", [])
        except Exception:
            return []

    def _normalize_mover(self, item: dict) -> dict:
        symbol = item.get("symbol", "")
        if symbol and not symbol.endswith(".NS"):
            symbol = f"{symbol}.NS"

        change = (
            item.get("changePercent")
            or item.get("pChange")
            or item.get("perChange")
            or 0
        )
        price = (
            item.get("currentPrice")
            or item.get("ltp")
            or item.get("lastPrice")
            or 0
        )
        name = item.get("name") or item.get("companyName") or symbol.replace(".NS", "")

        return {
            "symbol": symbol,
            "name": name,
            "currentPrice": float(price),
            "changePercent": float(change),
            "sector": item.get("sector", ""),
        }

    def get_top_gainers(self) -> list:
        try:
            r = self.session.get(
                f"{self.BASE_URL}/live-analysis-variations?index=gainers",
                timeout=10,
            )
            raw = r.json().get("NIFTY", {}).get("data", [])[:10]
            return [self._normalize_mover(item) for item in raw]
        except Exception:
            return []

    def get_top_losers(self) -> list:
        try:
            r = self.session.get(
                f"{self.BASE_URL}/live-analysis-variations?index=loosers",
                timeout=10,
            )
            raw = r.json().get("NIFTY", {}).get("data", [])[:10]
            return [self._normalize_mover(item) for item in raw]
        except Exception:
            return []
