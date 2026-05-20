import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { RefundDisputeForm } from "@/components/dashboard/refund-dispute-form";
import { requireApprovedClient } from "@/lib/auth";
import { clientRefundClaims } from "@/lib/demo/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { REFUND_REASONS, type Currency } from "@/lib/constants";
import type { RefundClaim } from "@/lib/types/database";

export const metadata = { title: "Refunds & Disputes" };

const REASON_LABEL = Object.fromEntries(REFUND_REASONS.map((r) => [r.id, r.label]));

export default async function RefundsPage() {
  const user = await requireApprovedClient();
  const claims = (await clientRefundClaims(user.id)) as RefundClaim[];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Refunds &amp; disputes"
        title="File a dispute, recover what is owed."
        description="For disputed charges, failed settlements, or any restitution required against your portfolio. Each dispute is reviewed personally by your banker."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass-card p-6 lg:p-8 h-fit">
          <RefundDisputeForm
            defaultCurrency={user.profile.preferred_currency as Currency}
          />
        </div>

        <div className="glass-card">
          <div className="border-b border-foreground/[0.06] px-6 py-4">
            <div className="eyebrow text-champagne-700 dark:text-champagne-400">History</div>
            <h3 className="mt-1 font-display text-lg font-semibold">Your claims</h3>
          </div>
          {claims.length === 0 ? (
            <div className="px-6 py-16 text-center text-[13px] text-muted-foreground">
              You have not filed any disputes yet.
            </div>
          ) : (
            <ul className="divide-y divide-foreground/[0.05] max-h-[640px] overflow-y-auto">
              {claims.map((r) => (
                <li key={r.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="tabular-figures text-[15px] font-medium text-foreground">
                        {r.currency
                          ? formatCurrency(r.amount, r.currency)
                          : `${r.amount.toLocaleString()}`}
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-0.5">
                        {REASON_LABEL[
                          (r.supporting_info as { reason?: string } | null)?.reason ?? "other"
                        ] ?? "Other"}
                        {" · "}
                        {formatDateTime(r.created_at)}
                      </div>
                      {r.transaction_reference && (
                        <div className="text-[11.5px] tabular-figures text-muted-foreground mt-1">
                          Ref · {r.transaction_reference}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        r.status === "completed"
                          ? "success"
                          : r.status === "approved"
                            ? "gold"
                            : r.status === "under_review"
                              ? "gold"
                              : r.status === "rejected"
                                ? "destructive"
                                : "warning"
                      }
                      className="capitalize shrink-0"
                    >
                      {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-3 text-[12.5px] text-muted-foreground leading-relaxed">
                    {r.description}
                  </p>
                  {r.admin_note && (
                    <div className="mt-3 rounded-sm border border-champagne-500/20 bg-champagne-500/5 px-3.5 py-2.5">
                      <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-1">
                        Officer note
                      </div>
                      <p className="text-[12.5px] text-foreground leading-relaxed">
                        {r.admin_note}
                      </p>
                    </div>
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
