import Link from "next/link";
import { ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { MotionCard } from "@/components/motion/motion-card";
import { requireApprovedClient } from "@/lib/auth";
import { clientWallets } from "@/lib/demo/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Wallet } from "@/lib/types/database";

export const metadata = { title: "Currency Accounts" };

export default async function WalletsPage() {
  const user = await requireApprovedClient();
  const wallets = (await clientWallets(user.id)) as Wallet[];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Currency Accounts"
        title="Three sovereign portfolios."
        description="Continental holds your USD, EUR, and GBP positions independently. Each ledger is reconciled separately."
        actions={
          <Button asChild>
            <Link href="/dashboard/withdrawals">
              New withdrawal <ArrowDownLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {wallets.map((w, i) => (
          <MotionCard
            index={i}
            hover
            key={w.id}
            className="rounded-md border border-border bg-card p-6 shadow-soft-sm flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="eyebrow text-champagne-700 dark:text-champagne-400">
                  {w.currency} Portfolio
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                  Account · {w.currency}
                </h3>
              </div>
              <Badge variant="outline" className="bg-background">{w.currency}</Badge>
            </div>

            <div className="mt-7 space-y-4">
              <Row label="Available" value={formatCurrency(w.available_balance, w.currency)} accent />
              <Row label="Pending" value={formatCurrency(w.pending_balance, w.currency)} />
              <Row label="Total withdrawn" value={formatCurrency(w.total_withdrawn, w.currency)} />
            </div>

            <div className="hairline my-6" />

            <div className="flex items-center justify-between text-[12px] text-muted-foreground">
              <span>Updated {formatDate(w.updated_at)}</span>
              <Link
                href={`/dashboard/withdrawals?currency=${w.currency}`}
                className="text-foreground hover:text-champagne-700 dark:hover:text-champagne-400 underline-offset-4 hover:underline transition-colors duration-200"
              >
                Withdraw
              </Link>
            </div>
          </MotionCard>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span
        className={
          "tabular-figures " +
          (accent
            ? "font-display text-2xl font-semibold text-foreground"
            : "text-[14px] font-medium text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}
