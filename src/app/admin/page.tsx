import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LifeBuoy,
  ScrollText,
  ShieldCheck,
  Undo2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActivityTicker } from "@/components/shared/activity-ticker";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionList, MotionRow } from "@/components/motion/motion-list";
import { requireAdmin } from "@/lib/auth";
import {
  adminCounts,
  adminPendingRefundCount,
  adminRecentActivity,
  adminRecentWithdrawals,
} from "@/lib/demo/queries";
import { formatCurrency, formatDateTime, maskAccountNumber } from "@/lib/utils";

export const metadata = { title: "Operations" };

type WithdrawalRow = {
  id: string;
  amount: number | string;
  currency: string;
  method: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name?: string | null;
    account_number?: string | null;
  } | null;
};

type ActivityRow = {
  id: string;
  action_type: string;
  created_at: string;
  profiles?: {
    full_name?: string | null;
  } | null;
};

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const [counts, refundCount, recentRequests, recentActivity] = await Promise.all([
    adminCounts(),
    adminPendingRefundCount(),
    adminRecentWithdrawals(),
    adminRecentActivity(),
  ]);

  const reviewTotal =
    counts.pendingClients + counts.pendingWithdrawals + refundCount + counts.openTickets;

  const stats = [
    {
      icon: Users,
      label: "Pending applications",
      value: String(counts.pendingClients),
      detail: "Client onboarding",
      href: "/admin/users?status=pending",
      active: counts.pendingClients > 0,
    },
    {
      icon: ArrowDownLeft,
      label: "Withdrawals review",
      value: String(counts.pendingWithdrawals),
      detail: "Payment approvals",
      href: "/admin/withdrawals?status=pending",
      active: counts.pendingWithdrawals > 0,
    },
    {
      icon: Undo2,
      label: "Refund claims",
      value: String(refundCount),
      detail: "Dispute desk",
      href: "/admin/refunds?status=pending",
      active: refundCount > 0,
    },
    {
      icon: LifeBuoy,
      label: "Open tickets",
      value: String(counts.openTickets),
      detail: "Concierge queue",
      href: "/admin/support",
      active: counts.openTickets > 0,
    },
    {
      icon: BarChart3,
      label: "Total clients",
      value: String(counts.totalClients),
      detail: "Private accounts",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <MotionCard
          surface="none"
          className="relative overflow-hidden rounded-md border border-white/[0.09] bg-white/[0.045] p-6 shadow-[0_26px_70px_-42px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-400/55 to-transparent" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-champagne-300">
                Welcome, {admin.profile.full_name.split(" ")[0]}
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-normal text-ivory-100 sm:text-4xl">
                Operations control room
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-ivory-100/62 sm:text-[15px]">
                Monitor client onboarding, approvals, payment instructions, and officer activity
                from a single command surface.
              </p>
            </div>

            <div className="grid min-w-[260px] grid-cols-2 gap-3">
              <HeroMetric label="Review queue" value={reviewTotal} />
              <HeroMetric label="SLA status" value="Live" />
              <HeroMetric label="Risk mode" value="Guarded" />
              <HeroMetric label="Desk" value="Admin" />
            </div>
          </div>
        </MotionCard>

        <MotionCard
          surface="none"
          className="rounded-md border border-white/[0.09] bg-navy-950/62 p-5 shadow-[0_26px_70px_-48px_rgba(0,0,0,0.95)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne-300">
                Command health
              </div>
              <h2 className="mt-2 text-[16px] font-semibold text-ivory-100">Today&apos;s desk</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-sm border border-champagne-500/24 bg-champagne-500/[0.09] text-champagne-300">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.7} />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <HealthRow icon={CheckCircle2} label="Admin access" value="Restricted" />
            <HealthRow icon={Clock3} label="Queue velocity" value="Priority" />
            <HealthRow icon={FileCheck2} label="Audit trail" value="Recording" />
          </div>
          <Button asChild variant="outline" className="mt-5 w-full border-white/[0.1] bg-white/[0.045]">
            <Link href="/admin/audit-logs">
              Open audit log
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </MotionCard>
      </section>

      <ActivityTicker preset="admin" tone="dark" label="Live approvals" compact />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <MotionCard
          index={4}
          surface="none"
          className="overflow-hidden rounded-md border border-white/[0.09] bg-white/[0.045] shadow-[0_24px_70px_-46px_rgba(0,0,0,0.95)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne-300">
                Payment queue
              </div>
              <h2 className="mt-1 text-[17px] font-semibold text-ivory-100">
                Pending withdrawals
              </h2>
            </div>
            <Button variant="ghost" size="sm" asChild className="self-start text-ivory-100/82">
              <Link href="/admin/withdrawals">
                Open queue
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {(recentRequests as WithdrawalRow[]).length === 0 ? (
            <EmptyState message="No payment instructions are awaiting review." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-white/[0.07] bg-navy-950/42 text-[10px] uppercase tracking-[0.18em] text-ivory-100/40">
                  <tr>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {(recentRequests as WithdrawalRow[]).map((request) => (
                    <tr key={request.id} className="transition-colors hover:bg-white/[0.035]">
                      <td className="px-5 py-4">
                        <div className="text-[13.5px] font-medium text-ivory-100">
                          {request.profiles?.full_name ?? "Unassigned client"}
                        </div>
                        <div className="mt-1 text-[12px] tabular-figures text-ivory-100/42">
                          {maskAccountNumber(request.profiles?.account_number)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] capitalize text-ivory-100/66">
                        {formatMethod(request.method)}
                      </td>
                      <td className="px-5 py-4 text-right text-[13.5px] font-semibold tabular-figures text-ivory-100">
                        {formatCurrency(request.amount, request.currency)}
                      </td>
                      <td className="px-5 py-4 text-[12px] tabular-figures text-ivory-100/50">
                        {formatDateTime(request.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="warning">{request.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </MotionCard>

        <MotionCard
          index={5}
          surface="none"
          className="overflow-hidden rounded-md border border-white/[0.09] bg-navy-950/62 shadow-[0_24px_70px_-46px_rgba(0,0,0,0.95)] backdrop-blur-xl"
        >
          <div className="border-b border-white/[0.08] px-5 py-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne-300">
              Officer activity
            </div>
            <h2 className="mt-1 text-[17px] font-semibold text-ivory-100">Live audit stream</h2>
          </div>
          {(recentActivity as ActivityRow[]).length === 0 ? (
            <EmptyState message="No officer actions have been recorded yet." />
          ) : (
            <MotionList className="divide-y divide-white/[0.06]">
              {(recentActivity as ActivityRow[]).map((activity) => (
                <MotionRow key={activity.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-white/[0.08] bg-white/[0.045] text-champagne-300">
                    <ScrollText className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium capitalize text-ivory-100">
                      {formatMethod(activity.action_type)}
                    </div>
                    <div className="mt-1 text-[12px] leading-5 text-ivory-100/46">
                      {activity.profiles?.full_name ?? "Officer"} -{" "}
                      {formatDateTime(activity.created_at)}
                    </div>
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

function HeroMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-navy-950/42 p-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ivory-100/38">
        {label}
      </div>
      <div className="mt-2 text-[18px] font-semibold tabular-figures text-ivory-100">{value}</div>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-white/[0.07] bg-white/[0.035] px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-champagne-300" strokeWidth={1.6} />
        <span className="truncate text-[12.5px] text-ivory-100/66">{label}</span>
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-100/48">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  href,
  active,
  index = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  href: string;
  active?: boolean;
  index?: number;
}) {
  return (
    <MotionCard
      index={index}
      hover
      surface="none"
      className="group rounded-md border border-white/[0.09] bg-white/[0.045] shadow-[0_20px_55px_-42px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-colors hover:bg-white/[0.065]"
    >
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-ivory-100/42">
              {label}
            </div>
            <div className="mt-3 font-display text-3xl font-semibold tabular-figures text-ivory-100">
              {value}
            </div>
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-white/[0.08] bg-navy-950/45 text-champagne-300">
            <Icon className="h-4 w-4" strokeWidth={1.6} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-ivory-100/50">
          <span className="truncate">{detail}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
        {active && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-sm border border-champagne-500/20 bg-champagne-500/[0.08] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-champagne-300">
            <span className="h-1.5 w-1.5 rounded-full bg-champagne-400" />
            Attention
          </div>
        )}
      </Link>
    </MotionCard>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-[220px] place-items-center px-6 py-12 text-center">
      <div>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-sm border border-white/[0.08] bg-white/[0.04] text-champagne-300">
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.6} />
        </div>
        <div className="mt-3 text-[13px] text-ivory-100/56">{message}</div>
      </div>
    </div>
  );
}

function formatMethod(value: string) {
  return value.replace(/_/g, " ");
}
