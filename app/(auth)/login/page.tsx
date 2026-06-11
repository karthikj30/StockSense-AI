"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-surface2 bg-surface">
        <CardHeader className="text-center">
          <Link href="/" className="font-display text-2xl font-bold text-brand">
            S$ StockSense
          </Link>
          <CardTitle className="mt-2 text-foreground">Welcome back</CardTitle>
          <p className="text-sm text-muted">
            Sign in with GitHub to sync your watchlist and portfolio
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            Continue with GitHub
          </Button>

          <p className="text-center text-xs text-muted">
            Free forever · No credit card required
          </p>

          <p className="text-center text-sm text-muted">
            <Link href="/" className="text-brand hover:underline">
              Continue without signing in →
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
