import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionList, MotionRow } from "@/components/motion/motion-list";
import { requireApprovedClient } from "@/lib/auth";
import { formatAccountNumber, formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { ACCOUNT_STATUS, type Currency } from "@/lib/constants";
import {
  clientPendingWithdrawals,
  clientTransactions,
  clientWallets,
} from "@/lib/demo/queries";
import type { Transaction, Wallet, WithdrawalRequest } from "@/lib/types/database";

export default async function DashboardOverviewPage() {
  const user = await requireApprovedClient();
  const [wallets, transactions, pending] = await Promise.all([
    clientWallets(user.id),
    clientTransactions(user.id, 6),
    clientPendingWithdrawals(user.id),
  ]);

  const ws = wallets as Wallet[];
  const txs = transactions as Transaction[];
  const wds = pending as WithdrawalRequest[];

  const preferredCurrency = user.profile.preferred_currency as Currency;
  const primaryWallet = ws.find((w) => w.currency === preferredCurrency) ?? ws[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Welcome, ${user.profile.full_name.split(" ")[0]}`}
        title="Your portfolio at a glance."
        description="A consolidated view of your active currency accounts, recent movements, and pending instructions."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard/wallets">All accounts</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/withdrawals">
                New withdrawal
                <ArrowDownLeft className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      {/* Bento grid */}
      <section className="grid gap-5 lg:grid-cols-6 lg:auto-rows-[minmax(0,auto)]">
        {/* Primary statement — 4 cols × 2 rows */}
        <MotionCard
          index={0}
          intensity="strong"
          className="lg:col-span-4 lg:row-span-2 p-8 lg:p-10"
        >
          <div className="flex h-full flex-col gap-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow text-champagne-300 mb-2">Primary statement</div>
                <div className="font-display text-lg font-medium text-ivory-100">
                  {user.profile.full_name}
                </div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-ivory-100/55 mt-1 tabular-figures">
                  {formatAccountNumber(user.profile.account_number)}
                </div>
              </div>
              <Badge variant="gold" className="border-champagne-400/30 bg-champagne-500/10 text-champagne-200">
                {ACCOUNT_STATUS[user.profile.account_status]}
              </Badge>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ivory-100/55">
                Available · {preferredCurrency}
              </div>
              <div className="mt-2 font-display text-display-lg tabular-figures text-ivory-100">
                {formatCurrency(primaryWallet?.available_balance ?? 0, preferredCurrency)}
              </div>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-px overflow-hidden rounded-md border border-ivory-100/10 bg-ivory-100/[0.03]">
              <MiniStat
                label="Pending"
                value={formatCurrency(primaryWallet?.pending_balance ?? 0, preferredCurrency)}
              />
              <MiniStat
                label="Total Withdrawn"
                value={formatCurrency(primaryWallet?.total_withdrawn ?? 0, preferredCurrency)}
              />
              <MiniStat
                label="Last Updated"
                value={primaryWallet?.updated_at ? formatDate(primaryWallet.updated_at) : "—"}
              />
            </div>
          </div>
        </MotionCard>

        {/* All currency accounts — 2 cols × 1 row */}
        <MotionCard index={1} className="lg:col-span-2 p-6 flex flex-col">
          <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-3">
            Currency accounts
          </div>
          <div className="space-y-3.5 flex-1">
            {ws.map((w) => (
              <Link key={w.id} href="/dashboard/wallets" className="block group">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {w.currency} Portfolio
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-1 font-display text-lg font-semibold tabular-figures text-foreground">
                  {formatCurrency(w.available_balance, w.currency)}
                </div>
              </Link>
            ))}
          </div>
        </MotionCard>

        {/* Pending withdrawals — 2 cols × 1 row */}
        <MotionCard index={2} className="lg:col-span-2 p-6 flex flex-col">
          <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-3">
            Pending instructions
          </div>
          {wds.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[13px] text-muted-foreground py-4">
              <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.05]">
                <ShieldCheck className="h-3.5 w-3.5 text-champagne-600" />
              </span>
              No pending withdrawals.
            </div>
          ) : (
            <ul className="space-y-3.5 flex-1">
              {wds.slice(0, 3).map((w) => (
                <li key={w.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium tabular-figures text-foreground">
                      {formatCurrency(w.amount, w.currency)}
                    </div>
                    <div className="text-[11px] text-muted-foreground capitalize truncate">
                      {w.method.replace(/_/g, " ")} · {formatDate(w.created_at)}
                    </div>
                  </div>
                  <Badge variant={w.status === "approved" ? "gold" : "warning"} className="capitalize shrink-0">
                    {w.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </MotionCard>

        {/* Recent activity — full width */}
        <MotionCard index={3} className="lg:col-span-6 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/[0.06]">
            <div>
              <div className="eyebrow text-champagne-700 dark:text-champagne-400">Recent activity</div>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                Latest movements
              </h3>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/transactions">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          {txs.length === 0 ? (
            <EmptyRow message="No movements yet on your accounts." />
          ) : (
            <MotionList className="divide-y divide-foreground/[0.05]">
              {txs.map((t) => (
                <MotionRow
                  key={t.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-foreground/[0.03]"
                >
                  <span
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-sm border " +
                      (t.amount >= 0
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-foreground/10 bg-foreground/[0.04] text-muted-foreground")
                    }
                  >
                    {t.amount >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium text-foreground capitalize">
                      {t.description ?? t.type}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {formatDate(t.created_at)} · {maskAccountNumber(user.profile.account_number)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="tabular-figures text-[14px] font-medium text-foreground">
                      {t.amount >= 0 ? "+" : ""}
                      {formatCurrency(t.amount, t.currency)}
                    </div>
                    <Badge variant={t.status === "completed" ? "success" : t.status === "rejected" ? "destructive" : "warning"} className="mt-1">
                      {t.status}
                    </Badge>
                  </div>
                </MotionRow>
              ))}
            </MotionList>
          )}
        </MotionCard>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-foreground/[0.02] p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-ivory-100/55">{label}</div>
      <div className="mt-1.5 text-[13px] tabular-figures font-medium text-ivory-100">{value}</div>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center text-[13px] text-muted-foreground">{message}</div>
  );
}
