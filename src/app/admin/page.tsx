import Link from "next/link";
import { ArrowRight, Users, ArrowDownLeft, LifeBuoy, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionList, MotionRow } from "@/components/motion/motion-list";
import { requireAdmin } from "@/lib/auth";
import { adminCounts, adminRecentActivity, adminRecentWithdrawals } from "@/lib/demo/queries";
import { formatCurrency, formatDateTime, maskAccountNumber } from "@/lib/utils";

export const metadata = { title: "Operations" };

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const [counts, recentRequests, recentActivity] = await Promise.all([
    adminCounts(),
    adminRecentWithdrawals(),
    adminRecentActivity(),
  ]);

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={`Welcome, ${admin.profile.full_name.split(" ")[0]}`}
        title="Operations dashboard."
        description="A summary of items requiring your attention this morning."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          icon={Users}
          label="Pending applications"
          value={String(counts.pendingClients)}
          href="/admin/users?status=pending"
          accent={counts.pendingClients > 0}
        />
        <StatCard
          index={1}
          icon={ArrowDownLeft}
          label="Withdrawals to review"
          value={String(counts.pendingWithdrawals)}
          href="/admin/withdrawals?status=pending"
          accent={counts.pendingWithdrawals > 0}
        />
        <StatCard
          index={2}
          icon={LifeBuoy}
          label="Open tickets"
          value={String(counts.openTickets)}
          href="/admin/support"
          accent={counts.openTickets > 0}
        />
        <StatCard
          index={3}
          icon={Users}
          label="Total clients"
          value={String(counts.totalClients)}
          href="/admin/users"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <MotionCard index={4} className="glass-card">
          <div className="flex items-center justify-between border-b border-foreground/[0.06] px-6 py-4">
            <div>
              <div className="eyebrow text-champagne-700 dark:text-champagne-400">Queue</div>
              <h3 className="mt-1 font-display text-lg font-semibold">Pending withdrawals</h3>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/withdrawals">
                Open queue <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          {(recentRequests ?? []).length === 0 ? (
            <div className="px-6 py-12 text-center text-[13px] text-muted-foreground">
              No requests awaiting review.
            </div>
          ) : (
            <MotionList className="divide-y divide-foreground/[0.05]">
              {(recentRequests ?? []).map((r: any) => (
                <MotionRow
                  key={r.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-foreground truncate">
                      {r.profiles?.full_name ?? "—"}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground tabular-figures mt-0.5">
                      {maskAccountNumber(r.profiles?.account_number)} ·{" "}
                      {String(r.method).replace(/_/g, " ")} · {formatDateTime(r.created_at)}
                    </div>
                  </div>
                  <div className="tabular-figures text-[14px] font-medium text-foreground">
                    {formatCurrency(r.amount, r.currency)}
                  </div>
                  <Badge variant="warning">pending</Badge>
                </MotionRow>
              ))}
            </MotionList>
          )}
        </MotionCard>

        <MotionCard index={5} className="glass-card">
          <div className="border-b border-foreground/[0.06] px-6 py-4">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400">Audit</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Recent officer activity</h3>
          </div>
          {(recentActivity ?? []).length === 0 ? (
            <div className="px-6 py-12 text-center text-[13px] text-muted-foreground">
              No officer activity yet.
            </div>
          ) : (
            <MotionList className="divide-y divide-foreground/[0.05] max-h-[420px] overflow-y-auto">
              {(recentActivity ?? []).map((a: any) => (
                <MotionRow key={a.id} className="px-6 py-3.5 flex items-start gap-3 transition-colors duration-200 hover:bg-muted/40">
                  <ScrollText className="h-4 w-4 mt-0.5 text-champagne-600" strokeWidth={1.6} />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-foreground capitalize truncate">
                      {a.action_type.replace(/_/g, " ")}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground mt-0.5">
                      {a.profiles?.full_name ?? "Officer"} · {formatDateTime(a.created_at)}
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

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
  index = 0,
}: {
  icon: any;
  label: string;
  value: string;
  href: string;
  accent?: boolean;
  index?: number;
}) {
  return (
    <MotionCard
      index={index}
      hover
      className="group glass-card transition-colors hover:bg-muted/30"
    >
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between">
          <div className="eyebrow text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4 text-champagne-600" strokeWidth={1.5} />
        </div>
        <div className="mt-3 font-display text-3xl font-semibold text-foreground tabular-figures">
          {value}
        </div>
        <div className="mt-3 text-[12px] uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1">
          <span>Review</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
        {accent && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-champagne-700 dark:text-champagne-400">
            <span className="h-1.5 w-1.5 rounded-full bg-champagne-500" />
            Requires attention
          </div>
        )}
      </Link>
    </MotionCard>
  );
}
