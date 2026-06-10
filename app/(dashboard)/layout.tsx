import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6">
          {children}
        </main>
        <footer className="hidden border-t border-surface2 bg-surface px-6 py-3 lg:block">
          <p className="text-center text-xs text-muted">
            ⚠️ Disclaimer: StockSense AI provides educational market analysis
            only, not financial advice. Past performance does not guarantee
            future results. Always consult a SEBI-registered advisor before
            investing.
          </p>
        </footer>
        <MobileNav />
      </div>
    </div>
  );
}
