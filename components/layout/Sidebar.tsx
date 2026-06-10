"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Compass,
  LayoutDashboard,
  Library,
  Menu,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { isMarketOpen } from "@/lib/utils/formatters";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stocks", label: "Explore Stocks", icon: Compass },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Library },
];

function MarketStatusBadge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isMarketOpen());
    const interval = setInterval(() => setOpen(isMarketOpen()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
        open
          ? "border-stock-up/30 bg-stock-up/10 text-stock-up"
          : "border-muted/30 bg-surface2 text-muted"
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          open ? "animate-pulse bg-stock-up" : "bg-muted"
        )}
      />
      {open ? "Market Open" : "Market Closed"}
      <span className="text-muted">· IST 9:15–15:30</span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand/10 text-brand"
                : "text-muted hover:bg-surface2 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-display text-lg font-bold text-background">
        S$
      </div>
      <div>
        <p className="font-display text-base font-semibold text-foreground">
          StockSense
        </p>
        <p className="text-xs text-muted">AI Stock Platform</p>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-surface2 bg-surface lg:flex">
        <div className="flex flex-col gap-6 p-5">
          <SidebarBrand />
          <MarketStatusBadge />
          <NavLinks />
        </div>
        <div className="mt-auto border-t border-surface2 p-5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <BarChart3 className="h-3.5 w-3.5" />
            NSE · BSE Markets
          </div>
        </div>
      </aside>

      <div className="fixed left-4 top-4 z-40 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-surface p-0">
            <SheetHeader className="border-b border-surface2 p-5 text-left">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBrand />
            </SheetHeader>
            <div className="flex flex-col gap-6 p-5">
              <MarketStatusBadge />
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
