import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock3,
  Globe2,
  LineChart,
  LockKeyhole,
  PieChart,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { TrustBadgeRail } from "@/components/shared/trust-badges";
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

const BASE_CURRENCY: Currency = "USD";
const BASE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
};

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
  const totalAvailable = ws.reduce((sum, w) => sum + toBase(w.available_balance, w.currency), 0);
  const totalPending = ws.reduce((sum, w) => sum + toBase(w.pending_balance, w.currency), 0);
  const totalWithdrawn = ws.reduce((sum, w) => sum + toBase(w.total_withdrawn, w.currency), 0);
  const totalPortfolio = totalAvailable + totalPending;
  const allocations = ws.map((w) => ({
    currency: w.currency,
    available: w.available_balance,
    pending: w.pending_balance,
    baseValue: toBase(w.available_balance + w.pending_balance, w.currency),
    percent: totalPortfolio > 0 ? (toBase(w.available_balance + w.pending_balance, w.currency) / totalPortfolio) * 100 : 0,
  }));

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={`Private office · ${user.profile.full_name.split(" ")[0]}`}
        title="Portfolio overview."
        description="A calm view of liquidity, custody exposure, pending instructions, and account activity across your Continental relationship."
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

      <TrustBadgeRail preset="dashboard" tone="dark" compact />

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        <MotionCard
          index={0}
          intensity="strong"
          className="overflow-hidden border border-champagne-200/[0.10]"
        >
          <div className="border-b border-champagne-200/[0.10] px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="eyebrow text-champagne-300">Consolidated relationship</div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold text-ivory-100">
                    {user.profile.full_name}
                  </h2>
                  <Badge variant="gold" className="border-champagne-400/30 bg-champagne-500/10 text-champagne-200">
                    {ACCOUNT_STATUS[user.profile.account_status]}
                  </Badge>
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ivory-100/55 tabular-figures">
                  {formatAccountNumber(user.profile.account_number)}
                </div>
              </div>
              <div className="rounded-md border border-ivory-100/[0.08] bg-ivory-100/[0.055] px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-ivory-100/50">Mandate</div>
                <div className="mt-1 text-[13px] font-medium text-ivory-100">Global treasury reserve</div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ivory-100/55">
                Total portfolio value · {BASE_CURRENCY}
              </div>
              <div className="mt-2 font-display text-[clamp(2.5rem,5vw,4.75rem)] leading-none text-ivory-100 tabular-figures">
                {formatCurrency(totalPortfolio, BASE_CURRENCY, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <HeroMetric label="Available liquidity" value={formatBase(totalAvailable)} tone="positive" />
                <HeroMetric label="Pending settlement" value={formatBase(totalPending)} />
                <HeroMetric label="Lifetime outflow" value={formatBase(totalWithdrawn)} />
              </div>
            </div>

            <div className="rounded-md border border-ivory-100/[0.08] bg-ivory-100/[0.055] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="eyebrow text-champagne-300">Currency allocation</div>
                  <p className="mt-2 text-[12px] text-ivory-100/55">
                    Base converted for consolidated reporting.
                  </p>
                </div>
                <PieChart className="h-4 w-4 text-champagne-300" />
              </div>
              <div className="mt-5 space-y-4">
                {allocations.map((item) => (
                  <AllocationRow
                    key={item.currency}
                    label={`${item.currency} reserve`}
                    value={formatBase(item.baseValue)}
                    percent={item.percent}
                  />
                ))}
              </div>
            </div>
          </div>
        </MotionCard>

        <MotionCard index={1} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="eyebrow text-champagne-700 dark:text-champagne-400">Private office</div>
              <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                Relationship coverage
              </h2>
            </div>
            <Building2 className="h-5 w-5 text-champagne-600" strokeWidth={1.5} />
          </div>
          <div className="mt-6 space-y-4">
            <OfficeRow icon={ShieldCheck} label="Account tier" value="Private Office · Active" />
            <OfficeRow icon={Globe2} label="Jurisdiction desk" value="Geneva / New York" />
            <OfficeRow icon={Clock3} label="Review cadence" value="Quarterly treasury review" />
            <OfficeRow icon={LockKeyhole} label="Controls" value="Dual approval on outbound funds" />
          </div>
        </MotionCard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          index={2}
          icon={LineChart}
          label="Primary liquidity"
          value={formatCurrency(primaryWallet?.available_balance ?? 0, preferredCurrency, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          note={`${preferredCurrency} operating reserve`}
        />
        <MetricCard
          index={3}
          icon={Scale}
          label="Settlement exposure"
          value={formatBase(totalPending)}
          note="Awaiting officer review"
        />
        <MetricCard
          index={4}
          icon={ShieldCheck}
          label="Custody posture"
          value="Reconciled"
          note="Ledger immutable and officer-audited"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <MotionCard index={5} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow text-champagne-700 dark:text-champagne-400">
                Currency accounts
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                Treasury buckets
              </h3>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/wallets">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {allocations.map((w) => (
              <Link key={w.currency} href="/dashboard/wallets" className="block rounded-md border border-foreground/[0.07] bg-foreground/[0.03] p-4 transition-colors hover:border-champagne-500/20 hover:bg-foreground/[0.045]">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {w.currency} portfolio
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold tabular-figures text-foreground">
                      {formatCurrency(w.available, w.currency, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                  <div className="text-right text-[12px] text-muted-foreground tabular-figures">
                    {formatPercent(w.percent)}
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/[0.09]">
                  <div
                    className="h-full rounded-full bg-champagne-500"
                    style={{ width: `${Math.max(4, Math.min(100, w.percent))}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </MotionCard>

        <MotionCard index={6} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-foreground/[0.06] px-6 py-4">
            <div>
              <div className="eyebrow text-champagne-700 dark:text-champagne-400">Recent activity</div>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                Latest ledger movements
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
                    <Badge
                      variant={
                        t.status === "completed"
                          ? "success"
                          : t.status === "rejected"
                            ? "destructive"
                            : "warning"
                      }
                      className="mt-1"
                    >
                      {t.status}
                    </Badge>
                  </div>
                </MotionRow>
              ))}
            </MotionList>
          )}
        </MotionCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <MotionCard index={7} className="p-6">
          <div className="eyebrow text-champagne-700 dark:text-champagne-400">
            Pending instructions
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
            Officer review queue
          </h3>
          {wds.length === 0 ? (
            <div className="mt-6 rounded-md border border-foreground/[0.06] bg-foreground/[0.025] p-6 text-center text-[13px] text-muted-foreground">
              <ShieldCheck className="mx-auto mb-3 h-5 w-5 text-champagne-600" />
              No pending withdrawals.
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {wds.slice(0, 3).map((w) => (
                <li key={w.id} className="rounded-md border border-foreground/[0.06] bg-foreground/[0.025] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium tabular-figures text-foreground">
                        {formatCurrency(w.amount, w.currency)}
                      </div>
                      <div className="mt-0.5 truncate text-[12px] capitalize text-muted-foreground">
                        {w.method.replace(/_/g, " ")} · {formatDate(w.created_at)}
                      </div>
                    </div>
                    <Badge variant={w.status === "approved" ? "gold" : "warning"} className="capitalize shrink-0">
                      {w.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </MotionCard>

        <MotionCard index={8} className="p-6">
          <div className="eyebrow text-champagne-700 dark:text-champagne-400">Governance</div>
          <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
            Portfolio controls
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Control label="Outbound settlement" value="Manual officer approval" />
            <Control label="Ledger policy" value="Immutable entries" />
            <Control label="Reporting currency" value={preferredCurrency} />
            <Control label="Risk posture" value="Capital preservation" />
          </div>
        </MotionCard>
      </section>
    </div>
  );
}

function HeroMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive";
}) {
  return (
    <div className="rounded-md border border-ivory-100/[0.08] bg-ivory-100/[0.05] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ivory-100/45">{label}</div>
      <div className={tone === "positive" ? "mt-1.5 text-[14px] font-semibold tabular-figures text-champagne-100" : "mt-1.5 text-[14px] font-semibold tabular-figures text-ivory-100"}>
        {value}
      </div>
    </div>
  );
}

function AllocationRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-[12px]">
        <span className="text-ivory-100/70">{label}</span>
        <span className="font-medium tabular-figures text-ivory-100">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory-100/10">
        <div
          className="h-full rounded-full bg-champagne-400"
          style={{ width: `${Math.max(4, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}

function OfficeRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-sm border border-foreground/[0.08] bg-foreground/[0.035]">
        <Icon className="h-4 w-4 text-champagne-600" strokeWidth={1.6} />
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-[13px] font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  index,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  note: string;
  index: number;
}) {
  return (
    <MotionCard index={index} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-2xl font-semibold text-foreground tabular-figures">
            {value}
          </div>
          <div className="mt-2 text-[12px] text-muted-foreground">{note}</div>
        </div>
        <Icon className="h-5 w-5 text-champagne-600" strokeWidth={1.5} />
      </div>
    </MotionCard>
  );
}

function Control({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-foreground/[0.06] bg-foreground/[0.025] p-4">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-[13px] font-medium text-foreground">{value}</div>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center text-[13px] text-muted-foreground">{message}</div>
  );
}

function toBase(amount: number, currency: string) {
  return amount * (BASE_RATES[currency as Currency] ?? 1);
}

function formatBase(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: BASE_CURRENCY,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value) + "%";
}
