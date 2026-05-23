"use client";

import { useState, useTransition } from "react";
import { Check, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { decideKycVerification } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/lib/types/database";

type Decision = "under_review" | "approved" | "rejected";

export function KycDecisionActions({
  userId,
  status,
}: {
  userId: string;
  status: Profile["kyc_status"];
}) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function act(decision: Decision) {
    if (decision === "rejected" && !note.trim()) {
      toast.error("Add a reason before rejecting KYC.");
      return;
    }

    startTransition(async () => {
      const res = await decideKycVerification({
        userId,
        decision,
        note: note.trim() || undefined,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "KYC updated.");
      setNote("");
    });
  }

  if (status === "not_submitted") {
    return (
      <p className="text-[12.5px] leading-relaxed text-muted-foreground">
        This client has not submitted a KYC document yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="kyc-note">Review note</Label>
        <Textarea
          id="kyc-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Visible to the client and recorded in audit logs."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {status !== "under_review" && status !== "approved" && (
          <Button variant="outline" size="sm" disabled={pending} onClick={() => act("under_review")}>
            <Eye className="h-4 w-4" /> Under review
          </Button>
        )}
        {status !== "approved" && (
          <Button variant="default" size="sm" disabled={pending} onClick={() => act("approved")}>
            <Check className="h-4 w-4" /> Approve KYC
          </Button>
        )}
        {status !== "rejected" && (
          <Button variant="outline" size="sm" disabled={pending} onClick={() => act("rejected")}>
            <XCircle className="h-4 w-4" /> Reject
          </Button>
        )}
      </div>
    </div>
  );
}
