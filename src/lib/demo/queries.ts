/**
 * Demo-aware data fetchers used by dashboard/admin pages.
 *
 * Each function returns the same shape Supabase would return so the page
 * code is identical regardless of the data source.
 */

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isDemoMode, supabaseConfigured } from "./index";
import {
  demoAdminRecentLedger,
  demoAdminTicketQueue,
  demoAdminWithdrawalQueue,
  demoAnalytics,
  demoAuditLog,
  demoClientLoginHistory,
  demoClientProfile,
  demoClientRoster,
  demoClientTickets,
  demoClientTransactions,
  demoClientWallets,
  demoClientWithdrawals,
  demoLedgerForClient,
} from "./data";

/* ---- Client-side fetchers --------------------------------------- */

export async function clientWallets(userId: string) {
  if (await isDemoMode()) return demoClientWallets;
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .order("currency");
  return data ?? [];
}

export async function clientTransactions(userId: string, limit = 200) {
  if (await isDemoMode()) return demoClientTransactions.slice(0, limit);
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function clientWithdrawals(userId: string, limit = 50) {
  if (await isDemoMode()) return demoClientWithdrawals.slice(0, limit);
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function clientPendingWithdrawals(userId: string) {
  if (await isDemoMode()) {
    return demoClientWithdrawals.filter(
      (w) => w.status === "pending" || w.status === "approved",
    );
  }
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("withdrawal_requests")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: false })
    .limit(4);
  return data ?? [];
}

export async function clientTickets(userId: string) {
  if (await isDemoMode()) return demoClientTickets;
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

export async function clientLoginHistory(userId: string) {
  if (await isDemoMode()) return demoClientLoginHistory;
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("login_history")
    .select("*")
    .eq("user_id", userId)
    .order("login_time", { ascending: false })
    .limit(15);
  return data ?? [];
}

/* ---- Admin-side fetchers ---------------------------------------- */

export async function adminCounts() {
  if (await isDemoMode()) {
    return {
      pendingClients: demoAnalytics.pendingClients,
      pendingWithdrawals: demoAnalytics.pendingWithdrawals,
      openTickets: demoAnalytics.openTickets,
      totalClients: demoAnalytics.totalClients,
    };
  }
  if (!supabaseConfigured()) {
    return { pendingClients: 0, pendingWithdrawals: 0, openTickets: 0, totalClients: 0 };
  }
  const s = createServiceClient();
  const [a, b, c, d] = await Promise.all([
    s.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    s.from("withdrawal_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    s.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
    s.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
  ]);
  return {
    pendingClients: a.count ?? 0,
    pendingWithdrawals: b.count ?? 0,
    openTickets: c.count ?? 0,
    totalClients: d.count ?? 0,
  };
}

export async function adminWithdrawalQueue(statusFilter?: string) {
  if (await isDemoMode()) {
    if (statusFilter && statusFilter !== "all") {
      return demoAdminWithdrawalQueue.filter((w) => w.status === statusFilter);
    }
    return demoAdminWithdrawalQueue;
  }
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  let q = s
    .from("withdrawal_requests")
    .select(
      "*, profiles:profiles!withdrawal_requests_user_id_fkey(id, full_name, email, account_number, country)",
    )
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") q = q.eq("status", statusFilter);
  const { data } = await q.limit(200);
  return data ?? [];
}

export async function adminClientRoster(statusFilter?: string, q?: string) {
  if (await isDemoMode()) {
    let list = demoClientRoster;
    if (statusFilter && statusFilter !== "all") {
      list = list.filter((p) => p.account_status === statusFilter);
    }
    if (q) {
      const lc = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(lc) ||
          p.email.toLowerCase().includes(lc) ||
          (p.account_number ?? "").toLowerCase().includes(lc),
      );
    }
    return list;
  }
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  let query = s.from("profiles").select("*").order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") query = query.eq("account_status", statusFilter);
  if (q && q.trim()) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,account_number.ilike.%${q}%`);
  }
  const { data } = await query.limit(200);
  return data ?? [];
}

export async function adminClientDetail(userId: string) {
  if (await isDemoMode()) {
    const profile =
      demoClientRoster.find((p) => p.id === userId) ?? demoClientProfile;
    return {
      profile,
      wallets: demoClientWallets,
      ledger: demoLedgerForClient,
      withdrawals: demoClientWithdrawals,
    };
  }
  if (!supabaseConfigured()) {
    return { profile: null, wallets: [], ledger: [], withdrawals: [] };
  }
  const s = createServiceClient();
  const [{ data: profile }, { data: wallets }, { data: ledger }, { data: withdrawals }] =
    await Promise.all([
      s.from("profiles").select("*").eq("id", userId).maybeSingle(),
      s.from("wallets").select("*").eq("user_id", userId).order("currency"),
      s.from("ledger_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
      s.from("withdrawal_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    ]);
  return {
    profile: profile ?? null,
    wallets: wallets ?? [],
    ledger: ledger ?? [],
    withdrawals: withdrawals ?? [],
  };
}

export async function adminAllTransactions() {
  if (await isDemoMode()) {
    return demoAdminRecentLedger.map((t) => ({
      ...t,
      profiles: (() => {
        const p = demoClientRoster.find((x) => x.id === t.user_id) ?? demoClientProfile;
        return { id: p.id, full_name: p.full_name, account_number: p.account_number };
      })(),
    }));
  }
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  const { data } = await s
    .from("transactions")
    .select("*, profiles:profiles!transactions_user_id_fkey(id, full_name, account_number)")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}

export async function adminTickets(statusFilter?: string) {
  if (await isDemoMode()) {
    if (statusFilter && statusFilter !== "all") {
      return demoAdminTicketQueue.filter((t) => t.status === statusFilter);
    }
    return demoAdminTicketQueue;
  }
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  let q = s
    .from("support_tickets")
    .select(
      "*, profiles:profiles!support_tickets_user_id_fkey(id, full_name, account_number, email)",
    )
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") q = q.eq("status", statusFilter);
  const { data } = await q.limit(100);
  return data ?? [];
}

export async function adminAuditLogs() {
  if (await isDemoMode()) return demoAuditLog;
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  const { data } = await s
    .from("audit_logs")
    .select(
      "*, admin:profiles!audit_logs_admin_id_fkey(full_name), client:profiles!audit_logs_user_id_fkey(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(300);
  return data ?? [];
}

export async function adminAnalytics() {
  if (await isDemoMode()) {
    return demoAnalytics;
  }
  if (!supabaseConfigured()) {
    return demoAnalytics; // fall back to seeded numbers so the page renders
  }

  const s = createServiceClient();
  const [
    { count: totalClients },
    { count: approvedClients },
    { count: pendingClients },
    { data: wallets },
    { data: withdrawalsByStatus },
  ] = await Promise.all([
    s.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client"),
    s.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "approved"),
    s.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "pending"),
    s.from("wallets").select("currency, available_balance, pending_balance, total_withdrawn"),
    s.from("withdrawal_requests").select("status, amount, currency"),
  ]);

  const custody: Record<string, number> = { USD: 0, EUR: 0, GBP: 0 };
  const pending: Record<string, number> = { USD: 0, EUR: 0, GBP: 0 };
  const withdrawn: Record<string, number> = { USD: 0, EUR: 0, GBP: 0 };
  (wallets ?? []).forEach((w: any) => {
    custody[w.currency] = (custody[w.currency] ?? 0) + Number(w.available_balance);
    pending[w.currency] = (pending[w.currency] ?? 0) + Number(w.pending_balance);
    withdrawn[w.currency] = (withdrawn[w.currency] ?? 0) + Number(w.total_withdrawn);
  });

  const wStatus: Record<string, number> = {
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  };
  (withdrawalsByStatus ?? []).forEach((w: any) => {
    wStatus[w.status] = (wStatus[w.status] ?? 0) + 1;
  });

  return {
    totalClients: totalClients ?? 0,
    approvedClients: approvedClients ?? 0,
    pendingClients: pendingClients ?? 0,
    openTickets: 0,
    pendingWithdrawals: wStatus.pending ?? 0,
    custody,
    pending,
    withdrawnLifetime: withdrawn,
    withdrawalsByStatus: wStatus,
  };
}

export async function adminRecentWithdrawals() {
  if (await isDemoMode()) return demoAdminWithdrawalQueue.slice(0, 5);
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  const { data } = await s
    .from("withdrawal_requests")
    .select(
      "id, amount, currency, method, status, created_at, user_id, profiles:profiles!withdrawal_requests_user_id_fkey(full_name, account_number)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

export async function adminRecentActivity() {
  if (await isDemoMode()) {
    return demoAuditLog.map((a) => ({
      id: a.id,
      action_type: a.action_type,
      created_at: a.created_at,
      profiles: { full_name: a.admin.full_name },
    }));
  }
  if (!supabaseConfigured()) return [];
  const s = createServiceClient();
  const { data } = await s
    .from("audit_logs")
    .select("id, action_type, created_at, admin_id, profiles:profiles!audit_logs_admin_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(8);
  return data ?? [];
}
