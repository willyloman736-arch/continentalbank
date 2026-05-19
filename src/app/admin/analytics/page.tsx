import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  await requireAdmin();
  const service = createServiceClient();

  const [
    { count: totalClients },
    { count: approvedClients },
    { count: pendingClients },
    { data: wallets },
    { data: withdrawalsByStatus },
  ] = await Promise.all([
    service.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    service.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "approved"),
    service.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    service.from("wallets").select("currency, available_balance, pending_balance, total_withdrawn"),
    service.from("withdrawal_requests").select("status, amount, currency"),
  ]);

  // Tally totals per currency
  const totals = { USD: 0, EUR: 0, GBP: 0 } as Record<string, number>;
  const pending = { USD: 0, EUR: 0, GBP: 0 } as Record<string, number>;
  const withdrawn = { USD: 0, EUR: 0, GBP: 0 } as Record<string, number>;
  (wallets ?? []).forEach((w: any) => {
    totals[w.currency] = (totals[w.currency] ?? 0) + Number(w.available_balance);
    pending[w.currency] = (pending[w.currency] ?? 0) + Number(w.pending_balance);
    withdrawn[w.currency] = (withdrawn[w.currency] ?? 0) + Number(w.total_withdrawn);
  });

  const wStatus = { pending: 0, approved: 0, completed: 0, rejected: 0 } as Record<string, number>;
  (withdrawalsByStatus ?? []).forEach((w: any) => {
    wStatus[w.status] = (wStatus[w.status] ?? 0) + 1;
  });

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Analytics"
        title="Institutional metrics."
        description="A consolidated read of platform-level metrics. Figures are reported per currency — not converted."
      />

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Metric label="Total clients" value={String(totalClients ?? 0)} />
        <Metric label="Approved" value={String(approvedClients ?? 0)} />
        <Metric label="Pending" value={String(pendingClients ?? 0)} />
        <Metric label="Withdrawals open" value={String((wStatus.pending ?? 0) + (wStatus.approved ?? 0))} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {(["USD", "EUR", "GBP"] as const).map((c) => (
          <article key={c} className="rounded-md border border-border bg-card p-6">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-2">
              {c} Custody
            </div>
            <div className="font-display text-3xl font-semibold tabular-figures text-foreground">
              {formatCurrency(totals[c], c)}
            </div>
            <div className="hairline my-5" />
            <Row label="Pending" value={formatCurrency(pending[c], c)} />
            <Row label="Withdrawn (lifetime)" value={formatCurrency(withdrawn[c], c)} />
          </article>
        ))}
      </section>

      <section className="rounded-md border border-border bg-card p-6">
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-3">Withdrawals by status</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(wStatus).map(([s, count]) => (
            <div key={s} className="rounded-sm border border-border bg-background p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground capitalize">
                {s}
              </div>
              <div className="mt-2 font-display text-2xl font-semibold tabular-figures text-foreground">
                {count}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-md border border-border bg-card p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-3 font-display text-3xl font-semibold text-foreground tabular-figures">
        {value}
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className="tabular-figures text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}
