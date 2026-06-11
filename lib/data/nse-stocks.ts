export interface NseStock {
  symbol: string;
  name: string;
  sector: string;
}

export const NSE_TOP_STOCKS: NseStock[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { symbol: "INFY.NS", name: "Infosys", sector: "IT" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC.NS", name: "ITC Limited", sector: "FMCG" },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "Finance" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "LT.NS", name: "Larsen & Toubro", sector: "Construction" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", sector: "IT" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints", sector: "Consumer" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", sector: "Banking" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceuticals", sector: "Pharma" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Cement" },
  { symbol: "WIPRO.NS", name: "Wipro", sector: "IT" },
  { symbol: "NTPC.NS", name: "NTPC Limited", sector: "Power" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "POWERGRID.NS", name: "Power Grid", sector: "Power" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "ONGC.NS", name: "ONGC", sector: "Oil & Gas" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv", sector: "Finance" },
  { symbol: "TECHM.NS", name: "Tech Mahindra", sector: "IT" },
  { symbol: "TITAN.NS", name: "Titan Company", sector: "Consumer" },
  { symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Diversified" },
  { symbol: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DRREDDY.NS", name: "Dr Reddy's Lab", sector: "Pharma" },
  { symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors", sector: "Auto" },
  { symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "BPCL.NS", name: "BPCL", sector: "Oil & Gas" },
  { symbol: "COALINDIA.NS", name: "Coal India", sector: "Mining" },
  { symbol: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "ZOMATO.NS", name: "Zomato", sector: "Consumer Tech" },
  { symbol: "NYKAA.NS", name: "Nykaa (FSN E-Commerce)", sector: "Consumer Tech" },
  { symbol: "PAYTM.NS", name: "Paytm (One97 Comm)", sector: "Fintech" },
  { symbol: "IRCTC.NS", name: "IRCTC", sector: "Travel" },
  { symbol: "HAL.NS", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "BEL.NS", name: "Bharat Electronics", sector: "Defence" },
  { symbol: "MAZDOCK.NS", name: "Mazagon Dock", sector: "Defence" },
  { symbol: "TATAPOWER.NS", name: "Tata Power", sector: "Power" },
  { symbol: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "FMCG" },
  { symbol: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Chemical" },
];

export const NSE_STOCKS = NSE_TOP_STOCKS;

export const MARKET_INDICES = [
  { symbol: "^NSEI", name: "Nifty 50" },
  { symbol: "^BSESN", name: "Sensex" },
  { symbol: "^NSEBANK", name: "Bank Nifty" },
  { symbol: "^CNXIT", name: "Nifty IT" },
  { symbol: "^CNXAUTO", name: "Nifty Auto" },
];
