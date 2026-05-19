import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { WithdrawalForm } from "@/components/dashboard/withdrawal-form";
import { requireApprovedClient } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  const [{ data: wallets }, { data: requests }] = await Promise.all([
    supabase.from("wallets").select("*").eq("user_id", user.id).order("currency"),
    supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const ws = (wallets ?? []) as Wallet[];
  const reqs = (requests ?? []) as WithdrawalRequest[];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Withdrawals"
        title="Discreet outbound instructions."
        description="Submit a withdrawal request. Your banker will review and confirm settlement personally."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-md border border-border bg-card p-6 lg:p-8">
          <WithdrawalForm
            country={user.profile.country ?? "US"}
            wallets={ws.map((w) => ({
              currency: w.currency,
              available: Number(w.available_balance),
            }))}
            defaultCurrency={(params.currency as "USD" | "EUR" | "GBP") ?? user.profile.preferred_currency}
          />
        </div>

        <div className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400">History</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Recent instructions</h3>
          </div>
          {reqs.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-muted-foreground">
              No withdrawal requests yet.
            </div>
          ) : (
            <ul className="divide-y divide-border max-h-[640px] overflow-y-auto">
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
                      "{r.admin_note}"
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
