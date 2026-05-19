"use client";

import { useTransition } from "react";
import { Check, XCircle, PauseCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { decideUser } from "@/app/actions/admin";

export function UserDecisionActions({
  userId,
  status,
}: {
  userId: string;
  status: "pending" | "approved" | "rejected" | "suspended";
}) {
  const [pending, startTransition] = useTransition();

  function act(decision: "approve" | "reject" | "suspend") {
    startTransition(async () => {
      const res = await decideUser({ userId, decision });
      if (!res.ok) toast.error(res.error);
      else toast.success(res.message ?? "Updated.");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "approved" && (
        <Button variant="default" size="sm" disabled={pending} onClick={() => act("approve")}>
          <Check className="h-4 w-4" /> Approve
        </Button>
      )}
      {status !== "rejected" && (
        <Button variant="outline" size="sm" disabled={pending} onClick={() => act("reject")}>
          <XCircle className="h-4 w-4" /> Reject
        </Button>
      )}
      {status === "approved" && (
        <Button variant="outline" size="sm" disabled={pending} onClick={() => act("suspend")}>
          <PauseCircle className="h-4 w-4" /> Suspend
        </Button>
      )}
    </div>
  );
}
