import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Continental Bank private client portal.",
};

export default function LoginPage() {
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
