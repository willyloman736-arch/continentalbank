// Generated-style Database type for Supabase. Keep in sync with /supabase/migrations.

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          country: string | null;
          preferred_language: string;
          preferred_currency: string;
          role: "super_admin" | "finance_admin" | "support_admin" | "client";
          account_status: "pending" | "approved" | "rejected" | "suspended";
          account_number: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        > & { created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          currency: "USD" | "EUR" | "GBP";
          available_balance: number;
          pending_balance: number;
          total_withdrawn: number;
          updated_at: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["wallets"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["wallets"]["Row"]>;
      };
      ledger_entries: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string;
          admin_id: string | null;
          currency: string;
          action_type: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ledger_entries"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never; // immutable
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          type:
            | "deposit"
            | "withdrawal"
            | "adjustment"
            | "fee"
            | "transfer"
            | "interest";
          amount: number;
          status: "pending" | "completed" | "rejected";
          description: string | null;
          created_by_admin_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Row"]>;
      };
      withdrawal_requests: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          amount: number;
          method: string;
          payment_details: Json;
          notes: string | null;
          status: "pending" | "approved" | "rejected" | "completed";
          admin_note: string | null;
          processed_by_admin_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["withdrawal_requests"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["withdrawal_requests"]["Row"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          admin_reply: string | null;
          assigned_to_admin_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["support_tickets"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          user_id: string | null;
          action_type: string;
          currency: string | null;
          old_value: Json | null;
          new_value: Json | null;
          note: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
      admin_notes: {
        Row: {
          id: string;
          admin_id: string;
          user_id: string;
          note: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_notes"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_notes"]["Row"]>;
      };
      login_history: {
        Row: {
          id: string;
          user_id: string;
          ip_address: string | null;
          device: string | null;
          browser: string | null;
          location: string | null;
          login_time: string;
        };
        Insert: Omit<Database["public"]["Tables"]["login_history"]["Row"], "id" | "login_time"> & {
          id?: string;
          login_time?: string;
        };
        Update: never;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Wallet = Database["public"]["Tables"]["wallets"]["Row"];
export type LedgerEntry = Database["public"]["Tables"]["ledger_entries"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type WithdrawalRequest = Database["public"]["Tables"]["withdrawal_requests"]["Row"];
export type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AdminNote = Database["public"]["Tables"]["admin_notes"]["Row"];
export type LoginHistoryEntry = Database["public"]["Tables"]["login_history"]["Row"];
