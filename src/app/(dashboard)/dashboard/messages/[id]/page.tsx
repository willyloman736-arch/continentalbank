import { notFound } from "next/navigation";
import { MessageThreadView } from "@/components/dashboard/message-thread-view";
import { requireApprovedClient } from "@/lib/auth";
import { demoClientThreads } from "@/lib/demo/messages";

export const metadata = { title: "Conversation" };

export default async function ClientThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireApprovedClient();
  const { id } = await params;
  const thread = demoClientThreads.find((t) => t.id === id && t.user_id === user.id);
  if (!thread) return notFound();

  return (
    <MessageThreadView
      thread={thread}
      audience="client"
      selfName={user.profile.full_name}
      backHref="/dashboard/messages"
    />
  );
}
