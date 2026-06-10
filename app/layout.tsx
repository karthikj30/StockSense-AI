import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StockSense AI",
    template: "%s | StockSense AI",
  },
  description:
    "AI-powered Indian stock market platform for NSE/BSE insights, watchlists, portfolio tracking, and beginner-friendly learning.",
  keywords: [
    "Indian stocks",
    "NSE",
    "BSE",
    "stock analysis",
    "AI investing",
    "StockSense",
  ],
  authors: [{ name: "StockSense AI" }],
  openGraph: {
    title: "StockSense AI — Smart Indian Stock Insights",
    description:
      "Track NSE/BSE markets, build watchlists, and learn investing with AI-powered analysis.",
    type: "website",
    locale: "en_IN",
    siteName: "StockSense AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster theme="dark" position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
