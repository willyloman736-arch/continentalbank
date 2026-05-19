"use client";

import { useState, useTransition } from "react";
import { Check, XCircle, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { processWithdrawal } from "@/app/actions/withdrawals";

type Decision = "approved" | "rejected" | "completed";

export function WithdrawalDecisionActions({
  id,
  status,
}: {
  id: string;
  status: "pending" | "approved" | "rejected" | "completed";
}) {
  const [open, setOpen] = useState<Decision | null>(null);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function act() {
    if (!open) return;
    startTransition(async () => {
      const res = await processWithdrawal({ id, decision: open, adminNote: note || undefined });
      if (!res.ok) toast.error(res.error);
      else {
        toast.success(res.message ?? "Processed.");
        setOpen(null);
        setNote("");
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {status === "pending" && (
          <>
            <Button size="sm" onClick={() => setOpen("approved")}>
              <Check className="h-4 w-4" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen("rejected")}>
              <XCircle className="h-4 w-4" /> Reject
            </Button>
          </>
        )}
        {status === "approved" && (
          <Button size="sm" variant="gold" onClick={() => setOpen("completed")}>
            <CheckCheck className="h-4 w-4" /> Mark as settled
          </Button>
        )}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {open === "approved"
                ? "Approve withdrawal"
                : open === "rejected"
                  ? "Reject withdrawal"
                  : "Mark as settled"}
            </DialogTitle>
            <DialogDescription>
              {open === "rejected"
                ? "Funds will be returned from pending balance to available balance."
                : open === "completed"
                  ? "Pending balance will be reduced and total withdrawn will increase."
                  : "The client will be notified that their request is approved and awaiting settlement."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="note">
              Officer note {open === "rejected" ? "(reason)" : "(optional)"}
            </Label>
            <Textarea
              id="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Recorded in audit log and shown to client."
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={act} disabled={pending}>
              {pending ? "Working…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
