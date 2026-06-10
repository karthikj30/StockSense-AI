export function formatIndianCurrency(num: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatIndianNumber(num: number): string {
  if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
  if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function formatPercent(num: number | null | undefined): string {
  const value = num ?? 0;
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(num: number): string {
  if (num >= 1e7) return `${(num / 1e7).toFixed(1)}Cr`;
  if (num >= 1e5) return `${(num / 1e5).toFixed(1)}L`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = ist.getHours() * 60 + ist.getMinutes();
  return minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30;
}

export function normalizeSymbol(symbol: string): string {
  const upper = symbol.toUpperCase().trim();
  if (upper.includes(".")) return upper;
  return `${upper}.NS`;
}

export function symbolToSlug(symbol: string): string {
  return encodeURIComponent(symbol);
}

export function slugToSymbol(slug: string): string {
  return decodeURIComponent(slug);
}
