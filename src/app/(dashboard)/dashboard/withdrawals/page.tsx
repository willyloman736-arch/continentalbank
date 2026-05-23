import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { WithdrawalForm } from "@/components/dashboard/withdrawal-form";
import { TrustBadgeRail } from "@/components/shared/trust-badges";
import { requireApprovedClient } from "@/lib/auth";
import { clientWallets, clientWithdrawals } from "@/lib/demo/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Wallet, WithdrawalRequest } from "@/lib/types/database";

export const metadata = { title: "Withdrawals" };

export default async function WithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<{ currency?: string }>;
}) {
  const user = await requireApprovedClient();
  const params = await searchParams;

  const [wallets, requests] = await Promise.all([
    clientWallets(user.id),
    clientWithdrawals(user.id),
  ]);
  const ws = wallets as Wallet[];
  const reqs = requests as WithdrawalRequest[];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Withdrawals"
        title="Discreet outbound instructions."
        description="Submit a withdrawal request. Your banker will review and confirm settlement personally."
      />

      <TrustBadgeRail preset="withdrawals" tone="dark" compact className="xl:grid-cols-3" />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6 lg:p-8">
          <WithdrawalForm
            country={user.profile.country ?? "US"}
            wallets={ws.map((w) => ({
              currency: w.currency,
              available: Number(w.available_balance),
            }))}
            defaultCurrency={(params.currency as "USD" | "EUR" | "GBP") ?? user.profile.preferred_currency as "USD" | "EUR" | "GBP"}
          />
        </div>

        <div className="glass-card">
          <div className="border-b border-foreground/[0.06] px-6 py-4">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400">History</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Recent instructions</h3>
          </div>
          {reqs.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-muted-foreground">
              No withdrawal requests yet.
            </div>
          ) : (
            <ul className="divide-y divide-foreground/[0.05] max-h-[640px] overflow-y-auto">
              {reqs.map((r) => (
                <li key={r.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="tabular-figures text-[15px] font-medium text-foreground">
                        {formatCurrency(r.amount, r.currency)}
                      </div>
                      <div className="text-[12px] text-muted-foreground capitalize mt-0.5">
                        {r.method.replace(/_/g, " ")} · {formatDateTime(r.created_at)}
                      </div>
                    </div>
                    <Badge
                      variant={
                        r.status === "completed"
                          ? "success"
                          : r.status === "approved"
                            ? "gold"
                            : r.status === "rejected"
                              ? "destructive"
                              : "warning"
                      }
                    >
                      {r.status}
                    </Badge>
                  </div>
                  {r.admin_note && (
                    <p className="mt-3 text-[12.5px] text-muted-foreground italic border-l-2 border-champagne-500/30 pl-3">
                      &quot;{r.admin_note}&quot;
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
