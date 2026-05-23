import type { Metadata } from "next";
import { Suspense } from "react";
import { Landmark, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityTicker } from "@/components/shared/activity-ticker";
import { TrustBadgeRail } from "@/components/shared/trust-badges";
import { enterDemoAction } from "@/app/actions/auth";
import { localAuthEnabled } from "@/lib/auth-mode";
import { LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD } from "@/lib/local-auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Continental Bank private client portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  const showDemoEntry = localAuthEnabled();

  return (
    <div className="space-y-9">
      <header>
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-4">
          Private Client Portal
        </div>
        <h1 className="font-display text-display-md text-foreground text-balance">
          Welcome back.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Sign in to your private client portal. All sessions are encrypted and recorded.
        </p>
      </header>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      <TrustBadgeRail
        preset="auth"
        tone="dark"
        compact
        className="sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
      />

      <ActivityTicker preset="auth" tone="dark" label="Portal activity" compact />

      {showDemoEntry && (
        <section className="rounded-md border border-champagne-400/20 bg-champagne-500/[0.06] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-champagne-300" />
            <div>
              <h2 className="text-[13px] font-medium text-foreground">Explore the demo portal</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                Supabase Auth is not connected in this environment. Any email can sign in as a
                build-mode client. Admin access uses{" "}
                <span className="font-mono text-foreground">{LOCAL_ADMIN_EMAIL}</span> /{" "}
                <span className="font-mono text-foreground">{LOCAL_ADMIN_PASSWORD}</span>.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <form action={enterDemoAction.bind(null, "client")}>
              <Button type="submit" variant="outline" className="w-full">
                <ShieldCheck className="h-4 w-4" />
                Client demo
              </Button>
            </form>
            <form action={enterDemoAction.bind(null, "officer")}>
              <Button type="submit" variant="outline" className="w-full">
                <Landmark className="h-4 w-4" />
                Officer demo
              </Button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
