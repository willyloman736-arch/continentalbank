import { notFound } from "next/navigation";
import { MessageThreadView } from "@/components/dashboard/message-thread-view";
import { requireAdmin } from "@/lib/auth";
import { demoAdminThreads, threadClient } from "@/lib/demo/messages";

export const metadata = { title: "Conversation — Admin" };

export default async function AdminThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const thread = demoAdminThreads.find((t) => t.id === id);
  if (!thread) return notFound();

  const client = threadClient(thread);

  return (
    <div className="space-y-6">
      {/* Mini client header — context the officer needs */}
      <div className="glass-card p-4 sm:p-5">
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-2">
          Client of record
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="text-[15px] font-medium text-foreground">{client.full_name}</div>
          <div className="text-[12px] text-muted-foreground tabular-figures">
            {client.account_number ?? "—"} · {client.email ?? ""}
          </div>
        </div>
      </div>

      <MessageThreadView
        thread={thread}
        audience="officer"
        selfName={admin.profile.full_name}
        backHref="/admin/messages"
      />
    </div>
  );
}
