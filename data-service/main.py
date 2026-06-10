from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import stocks, market, indicators

app = FastAPI(title="StockSense Data Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router, prefix="/stocks")
app.include_router(market.router, prefix="/market")
app.include_router(indicators.router, prefix="/indicators")


@app.get("/health")
async def health():
    return {"status": "ok"}
