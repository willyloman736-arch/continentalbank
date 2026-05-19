"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterDemoAction, signInAction } from "@/app/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [demoPending, startDemo] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signInAction(fd);
      if (!res.ok) {
        setError(res.error);
        toast.error(res.error);
        return;
      }
      const redirectTo = search.get("redirect") || res.redirectTo;
      toast.success("Signed in. Welcome back.");
      router.replace(redirectTo);
      router.refresh();
    });
  }

  function enterDemo(role: "client" | "officer") {
    startDemo(async () => {
      await enterDemoAction(role);
    });
  }

  return (
    <div className="space-y-7">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="name@continental.example"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-[11px] uppercase tracking-[0.14em] text-champagne-700 dark:text-champagne-400 hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground hover:text-foreground transition"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending || demoPending}>
          {pending ? "Signing in…" : "Sign in"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="text-center text-[13px] text-muted-foreground">
          Not yet a client?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            Submit an application
          </Link>
        </p>
      </form>

      {/* ---- Preview / demo entry ----------------------------------- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[10.5px] uppercase tracking-[0.18em]">
          <span className="bg-background px-3 text-muted-foreground">
            Preview · Live demonstration
          </span>
        </div>
      </div>

      <div className="rounded-md border border-champagne-500/20 bg-champagne-500/5 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 mt-0.5 text-champagne-700 dark:text-champagne-400" />
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-foreground">
              Explore the portal as a guest
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
              Continue with a seeded demonstration account. No data is written and
              no email is sent.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || demoPending}
            onClick={() => enterDemo("client")}
          >
            <KeyRound className="h-3.5 w-3.5" />
            As private client
          </Button>
          <Button
            type="button"
            variant="gold"
            size="sm"
            disabled={pending || demoPending}
            onClick={() => enterDemo("officer")}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            As officer (admin)
          </Button>
        </div>
      </div>
    </div>
  );
}
