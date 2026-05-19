"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { openTicket } from "@/app/actions/support";

export function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || message.trim().length < 10) {
      toast.error("Please add a subject and a meaningful message.");
      return;
    }
    startTransition(async () => {
      const res = await openTicket({ subject, message });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Sent.");
      setSubject("");
      setMessage("");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-2">New message</div>
        <h3 className="font-display text-xl font-semibold text-foreground">
          Reach the private office
        </h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          For sensitive matters, please use a written instruction.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Statement request for Q3 — EUR portfolio"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Detail your request. Please do not include passwords, OTPs, or full payment credentials."
          required
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Sending…" : "Send to private office"}
        {!pending && <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
}
