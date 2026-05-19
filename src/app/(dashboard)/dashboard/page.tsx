import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionList, MotionRow } from "@/components/motion/motion-list";
import { requireApprovedClient } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatAccountNumber, formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { ACCOUNT_STATUS, type Currency } from "@/lib/constants";
import type { Wallet, Transaction, WithdrawalRequest } from "@/lib/types/database";

export default async function DashboardOverviewPage() {
  const user = await requireApprovedClient();
  const supabase = await createClient();

  const [{ data: wallets }, { data: transactions }, { data: pendingWithdrawals }] =
    await Promise.all([
      supabase.from("wallets").select("*").eq("user_id", user.id).order("currency"),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const ws = (wallets ?? []) as Wallet[];
  const txs = (transactions ?? []) as Transaction[];
  const wds = (pendingWithdrawals ?? []) as WithdrawalRequest[];

  const preferredCurrency = user.profile.preferred_currency as Currency;
  const primaryWallet = ws.find((w) => w.currency === preferredCurrency) ?? ws[0];

  return (
    <div className="space-y-12">
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

      {/* Primary statement card */}
      <section className="grid gap-6 lg:grid-cols-3">
        <MotionCard
          index={0}
          className="lg:col-span-2 relative overflow-hidden rounded-md border border-border bg-navy-900 text-ivory-100 p-8 lg:p-10 shadow-soft-lg"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 25%, #C8A96A 0%, transparent 38%), radial-gradient(circle at 80% 80%, #C8A96A 0%, transparent 42%)",
            }}
          />
          <div className="relative flex flex-col gap-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow text-champagne-300 mb-2">Primary statement</div>
                <div className="font-display text-lg font-medium">{user.profile.full_name}</div>
                <div className="text-[12px] uppercase tracking-[0.18em] text-ivory-100/55 mt-1 tabular-figures">
                  {formatAccountNumber(user.profile.account_number)}
                </div>
              </div>
              <Badge variant="gold" className="border-champagne-400/30 bg-champagne-500/10 text-champagne-200">
                {ACCOUNT_STATUS[user.profile.account_status]}
              </Badge>
            </div>

            <div className="flex items-end gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-ivory-100/55">
                  Available · {preferredCurrency}
                </div>
                <div className="mt-2 font-display text-display-lg tabular-figures text-ivory-100">
                  {formatCurrency(primaryWallet?.available_balance ?? 0, preferredCurrency)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-ivory-100/10 bg-ivory-100/5">
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

        <MotionCard index={1} className="rounded-md border border-border bg-card p-6 lg:p-7 flex flex-col">
          <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-3">
            All currency accounts
          </div>
          <div className="space-y-4 flex-1">
            {ws.map((w) => (
              <Link
                key={w.id}
                href="/dashboard/wallets"
                className="block group"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {w.currency} Portfolio
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-1.5 font-display text-2xl font-semibold tabular-figures text-foreground">
                  {formatCurrency(w.available_balance, w.currency)}
                </div>
                <div className="mt-0.5 text-[12px] text-muted-foreground tabular-figures">
                  Pending {formatCurrency(w.pending_balance, w.currency)}
                </div>
              </Link>
            ))}
          </div>
          <div className="hairline mt-6 mb-4" />
          <div className="text-[12px] text-muted-foreground">
            Multi-currency reporting · figures unconverted
          </div>
        </MotionCard>
      </section>

      {/* Recent activity + pending */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <MotionCard index={2} className="rounded-md border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
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
            <MotionList className="divide-y divide-border">
              {txs.map((t) => (
                <MotionRow
                  key={t.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-muted/40"
                >
                  <span
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-sm border " +
                      (t.amount >= 0
                        ? "border-success/20 bg-success/10 text-success"
                        : "border-border bg-muted text-muted-foreground")
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

        <MotionCard index={3} className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400">Pending instructions</div>
            <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
              Withdrawals in review
            </h3>
          </div>
          {wds.length === 0 ? (
            <EmptyRow message="No pending withdrawal requests." />
          ) : (
            <MotionList className="divide-y divide-border">
              {wds.map((w) => (
                <MotionRow
                  key={w.id}
                  className="px-6 py-4 flex items-start justify-between gap-3 transition-colors duration-200 hover:bg-muted/40"
                >
                  <div>
                    <div className="text-[14px] font-medium tabular-figures text-foreground">
                      {formatCurrency(w.amount, w.currency)}
                    </div>
                    <div className="text-[12px] text-muted-foreground capitalize">
                      {w.method.replace(/_/g, " ")} · {formatDate(w.created_at)}
                    </div>
                  </div>
                  <Badge variant={w.status === "approved" ? "gold" : "warning"} className="capitalize">
                    {w.status}
                  </Badge>
                </MotionRow>
              ))}
            </MotionList>
          )}
          <div className="border-t border-border px-6 py-4 flex items-center gap-2 text-[12px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-champagne-600" />
            All withdrawals are reviewed by a relationship manager.
          </div>
        </MotionCard>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy-900 p-4">
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
