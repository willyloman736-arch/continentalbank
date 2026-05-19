"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { replyTicket } from "@/app/actions/admin";

type Status = "open" | "in_progress" | "resolved" | "closed";

export function TicketReplyForm({
  id,
  currentStatus,
  existingReply,
}: {
  id: string;
  currentStatus: Status;
  existingReply?: string | null;
}) {
  const [reply, setReply] = useState(existingReply ?? "");
  const [status, setStatus] = useState<Status>(currentStatus);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (reply.trim().length < 1) return;
    startTransition(async () => {
      const res = await replyTicket({ id, reply, status });
      if (!res.ok) toast.error(res.error);
      else toast.success(res.message ?? "Sent.");
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="space-y-2">
        <Label>Officer reply</Label>
        <Textarea
          rows={3}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a discreet, complete response."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
          <SelectTrigger className="min-w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send"}
          {!pending && <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
