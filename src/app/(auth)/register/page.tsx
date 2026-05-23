import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { TrustBadgeRail } from "@/components/shared/trust-badges";

export const metadata: Metadata = {
  title: "Open a private account",
  description: "Submit a private client application to Continental Bank.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-4">
          Private Client Office
        </div>
        <h1 className="font-display text-display-md text-foreground text-balance">
          Open a private account.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Submit your details. A relationship manager will review your application and contact you
          discreetly.
        </p>
      </header>

      <RegisterForm />

      <TrustBadgeRail
        preset="auth"
        tone="dark"
        compact
        className="sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1"
      />
    </div>
  );
}
