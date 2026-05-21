"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Paperclip, Send, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MESSAGE_STATUS_LABEL, type Message, type MessageThread } from "@/lib/demo/messages";
import { formatDateTime, initials } from "@/lib/utils";

type Props = {
  thread: MessageThread;
  audience: "client" | "officer";
  /** Display name shown above the composer */
  selfName: string;
  /** Back link target */
  backHref: "/dashboard/messages" | "/admin/messages";
};

export function MessageThreadView({ thread, audience, selfName, backHref }: Props) {
  const [text, setText] = useState("");
  const [attached, setAttached] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  function send() {
    if (!text.trim()) return;
    startTransition(async () => {
      // Local-only mock — toast and clear. Real backend writes happen
      // when Supabase is wired.
      await new Promise((r) => setTimeout(r, 300));
      toast.success("Sent. The Private Office will respond shortly.");
      setText("");
      setAttached([]);
    });
  }

  function handleAttachClick() {
    // Simulate adding a placeholder attachment chip
    const name = `Attachment-${attached.length + 1}.pdf`;
    setAttached((a) => [...a, name]);
    toast.message("Attachment staged (preview only).");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link href={backHref}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to inbox
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-2">
              Conversation
            </div>
            <h1 className="font-display text-display-md text-foreground tracking-tight">
              {thread.subject}
            </h1>
            <div className="mt-2 text-[12.5px] text-muted-foreground">
              Started {formatDateTime(thread.created_at)} ·{" "}
              {thread.messages.length} messages
            </div>
          </div>
          <Badge
            variant={
              thread.status === "resolved" || thread.status === "closed"
                ? "success"
                : thread.status === "awaiting_client"
                  ? "gold"
                  : "warning"
            }
          >
            {MESSAGE_STATUS_LABEL[thread.status]}
          </Badge>
        </div>
      </div>

      {/* Thread of messages */}
      <ol className="space-y-4">
        {thread.messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            isSelf={
              (audience === "client" && m.sender_role === "client") ||
              (audience === "officer" && m.sender_role === "officer")
            }
            index={i}
          />
        ))}
      </ol>

      {/* Composer */}
      {thread.status !== "closed" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.36,
            delay: 0.1 + thread.messages.length * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="glass-card p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(selfName)}</AvatarFallback>
            </Avatar>
            <div className="text-[12.5px]">
              <div className="font-medium text-foreground">{selfName}</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Reply to this conversation
              </div>
            </div>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="mt-4"
            placeholder="Write a message. Avoid passwords, OTPs, or full payment credentials."
          />

          {attached.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {attached.map((name, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-foreground"
                >
                  <FileText className="h-3 w-3" />
                  {name}
                  <button
                    type="button"
                    aria-label="Remove attachment"
                    onClick={() => setAttached((a) => a.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" type="button" onClick={handleAttachClick}>
              <Paperclip className="h-3.5 w-3.5" />
              Attach
            </Button>
            <Button onClick={send} disabled={pending || !text.trim()}>
              {pending ? "Sending…" : "Send reply"}
              {!pending && <Send className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  isSelf,
  index,
}: {
  message: Message;
  isSelf: boolean;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.36,
        delay: 0.04 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`flex gap-3 ${isSelf ? "flex-row-reverse" : ""}`}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback>{initials(message.sender_name)}</AvatarFallback>
      </Avatar>
      <div className={`min-w-0 max-w-[80%] ${isSelf ? "items-end text-right" : ""} flex flex-col`}>
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {message.sender_name} ·{" "}
          {message.sender_role === "officer" ? "Private Office" : "Client"} ·{" "}
          {formatDateTime(message.created_at)}
        </div>
        <div
          className={
            "mt-1.5 inline-block rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed " +
            (isSelf
              ? "bg-primary text-primary-foreground"
              : "glass-card !rounded-2xl !p-4 text-foreground")
          }
        >
          <p className="whitespace-pre-wrap text-left">{message.body}</p>
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mt-2 flex flex-wrap gap-2 ${isSelf ? "justify-end" : ""}`}>
            {message.attachments.map((a) => (
              <a
                key={a.id}
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1.5 text-[11.5px] text-foreground hover:bg-foreground/[0.06] transition-colors"
              >
                <FileText className="h-3 w-3 text-champagne-700 dark:text-champagne-400" />
                <span>{a.name}</span>
                <span className="text-muted-foreground tabular-figures">· {a.size}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.li>
  );
}
