import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

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

      <LoginForm />
    </div>
  );
}
