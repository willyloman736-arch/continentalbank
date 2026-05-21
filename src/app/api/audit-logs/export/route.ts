import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { demoAuditLog } from "@/lib/demo/data";

/**
 * Officer-only: exports the audit log as CSV. The browser triggers a
 * download via Content-Disposition: attachment.
 *
 * Demo mode returns the seeded audit log. When Supabase is wired, swap
 * in a service-client query.
 */
export async function GET() {
  await requireAdmin();

  const rows = demoAuditLog;

  const header = [
    "id",
    "created_at",
    "admin",
    "client",
    "action_type",
    "currency",
    "ip_address",
    "old_value",
    "new_value",
    "note",
  ];

  const csv = [
    header.join(","),
    ...rows.map((a) =>
      [
        a.id,
        a.created_at,
        a.admin?.full_name ?? "",
        a.client?.full_name ?? "",
        a.action_type,
        a.currency ?? "",
        a.ip_address ?? "",
        a.old_value ? JSON.stringify(a.old_value) : "",
        a.new_value ? JSON.stringify(a.new_value) : "",
        (a.note ?? "").replace(/"/g, '""'),
      ]
        .map(csvEscape)
        .join(","),
    ),
  ].join("\n");

  const filename = `continental-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvEscape(v: unknown) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
