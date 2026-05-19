-- =============================================================================
-- Continental Bank — Initial schema
-- =============================================================================
-- All tables, types, indexes, functions, triggers, and RLS policies for the MVP.
-- Run on a fresh Supabase project (psql or supabase db push).
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('super_admin', 'finance_admin', 'support_admin', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_status as enum ('pending', 'approved', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.currency_code as enum ('USD', 'EUR', 'GBP');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_type as enum (
    'deposit', 'withdrawal', 'adjustment', 'fee', 'transfer', 'interest'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_status as enum ('pending', 'completed', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.withdrawal_status as enum ('pending', 'approved', 'rejected', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Profiles (one row per auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email citext not null unique,
  phone text,
  country text,
  preferred_language text not null default 'en',
  preferred_currency public.currency_code not null default 'USD',
  role public.user_role not null default 'client',
  account_status public.account_status not null default 'pending',
  account_number text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_status_idx on public.profiles(account_status);

-- -----------------------------------------------------------------------------
-- Wallets (one per currency per user)
-- -----------------------------------------------------------------------------
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  currency public.currency_code not null,
  available_balance numeric(18, 2) not null default 0 check (available_balance >= 0),
  pending_balance numeric(18, 2) not null default 0 check (pending_balance >= 0),
  total_withdrawn numeric(18, 2) not null default 0 check (total_withdrawn >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, currency)
);

create index if not exists wallets_user_idx on public.wallets(user_id);

-- -----------------------------------------------------------------------------
-- Ledger (immutable double-entry-style record of every balance change)
-- -----------------------------------------------------------------------------
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  admin_id uuid references public.profiles(id) on delete set null,
  currency public.currency_code not null,
  action_type text not null,
  amount numeric(18, 2) not null,
  balance_before numeric(18, 2) not null,
  balance_after numeric(18, 2) not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists ledger_user_idx on public.ledger_entries(user_id, created_at desc);
create index if not exists ledger_wallet_idx on public.ledger_entries(wallet_id, created_at desc);

-- Ledger entries are immutable
create or replace function public.prevent_ledger_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'Ledger entries are immutable';
end $$;

drop trigger if exists ledger_immutable_update on public.ledger_entries;
create trigger ledger_immutable_update
  before update or delete on public.ledger_entries
  for each row execute function public.prevent_ledger_mutation();

-- -----------------------------------------------------------------------------
-- Transactions (client-visible feed)
-- -----------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  currency public.currency_code not null,
  type public.transaction_type not null,
  amount numeric(18, 2) not null,
  status public.transaction_status not null default 'completed',
  description text,
  created_by_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists tx_user_idx on public.transactions(user_id, created_at desc);
create index if not exists tx_status_idx on public.transactions(status);

-- -----------------------------------------------------------------------------
-- Withdrawal requests
-- -----------------------------------------------------------------------------
create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  currency public.currency_code not null,
  amount numeric(18, 2) not null check (amount > 0),
  method text not null,
  payment_details jsonb not null default '{}'::jsonb,
  notes text,
  status public.withdrawal_status not null default 'pending',
  admin_note text,
  processed_by_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wd_user_idx on public.withdrawal_requests(user_id, created_at desc);
create index if not exists wd_status_idx on public.withdrawal_requests(status);

-- -----------------------------------------------------------------------------
-- Support tickets
-- -----------------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status public.ticket_status not null default 'open',
  admin_reply text,
  assigned_to_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_user_idx on public.support_tickets(user_id, created_at desc);
create index if not exists tickets_status_idx on public.support_tickets(status);

-- -----------------------------------------------------------------------------
-- Audit log
-- -----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  currency public.currency_code,
  old_value jsonb,
  new_value jsonb,
  note text,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists audit_admin_idx on public.audit_logs(admin_id, created_at desc);
create index if not exists audit_user_idx on public.audit_logs(user_id, created_at desc);
create index if not exists audit_action_idx on public.audit_logs(action_type);

drop trigger if exists audit_immutable_update on public.audit_logs;
create trigger audit_immutable_update
  before update or delete on public.audit_logs
  for each row execute function public.prevent_ledger_mutation();

-- -----------------------------------------------------------------------------
-- Admin notes (internal account notes)
-- -----------------------------------------------------------------------------
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_notes_user_idx on public.admin_notes(user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Login history
-- -----------------------------------------------------------------------------
create table if not exists public.login_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ip_address text,
  device text,
  browser text,
  location text,
  login_time timestamptz not null default now()
);

create index if not exists login_user_idx on public.login_history(user_id, login_time desc);

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists wallets_updated_at on public.wallets;
create trigger wallets_updated_at
  before update on public.wallets
  for each row execute function public.set_updated_at();

drop trigger if exists withdrawals_updated_at on public.withdrawal_requests;
create trigger withdrawals_updated_at
  before update on public.withdrawal_requests
  for each row execute function public.set_updated_at();

drop trigger if exists tickets_updated_at on public.support_tickets;
create trigger tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

-- Role check
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.profiles
    where id = uid
      and role in ('super_admin', 'finance_admin', 'support_admin')
  );
$$;

create or replace function public.has_role(uid uuid, target_role public.user_role)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(select 1 from public.profiles where id = uid and role = target_role);
$$;

-- Auto-create an empty profile + wallets when an auth user is inserted
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_account_no text;
begin
  -- Account number: "CB" + 12 random digits, retry on rare collision
  loop
    new_account_no := 'CB' || lpad((floor(random() * 1e12))::bigint::text, 12, '0');
    exit when not exists (select 1 from public.profiles where account_number = new_account_no);
  end loop;

  insert into public.profiles (
    id, full_name, email, phone, country,
    preferred_language, preferred_currency, account_number, role, account_status
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'country',
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en'),
    coalesce((new.raw_user_meta_data ->> 'preferred_currency')::public.currency_code, 'USD'),
    new_account_no,
    'client',
    'pending'
  );

  insert into public.wallets (user_id, currency) values
    (new.id, 'USD'),
    (new.id, 'EUR'),
    (new.id, 'GBP');

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.transactions enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_notes enable row level security;
alter table public.login_history enable row level security;

-- ---- profiles --------------------------------------------------------------
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_self_limited" on public.profiles;
create policy "profiles_update_self_limited" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---- wallets ---------------------------------------------------------------
drop policy if exists "wallets_select_self_or_admin" on public.wallets;
create policy "wallets_select_self_or_admin" on public.wallets
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "wallets_admin_modify" on public.wallets;
create policy "wallets_admin_modify" on public.wallets
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---- ledger ----------------------------------------------------------------
drop policy if exists "ledger_select_self_or_admin" on public.ledger_entries;
create policy "ledger_select_self_or_admin" on public.ledger_entries
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "ledger_insert_admin_only" on public.ledger_entries;
create policy "ledger_insert_admin_only" on public.ledger_entries
  for insert with check (public.is_admin(auth.uid()));

-- ---- transactions ----------------------------------------------------------
drop policy if exists "tx_select_self_or_admin" on public.transactions;
create policy "tx_select_self_or_admin" on public.transactions
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "tx_admin_modify" on public.transactions;
create policy "tx_admin_modify" on public.transactions
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---- withdrawal_requests ---------------------------------------------------
drop policy if exists "wd_select_self_or_admin" on public.withdrawal_requests;
create policy "wd_select_self_or_admin" on public.withdrawal_requests
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "wd_insert_self" on public.withdrawal_requests;
create policy "wd_insert_self" on public.withdrawal_requests
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'
  );

drop policy if exists "wd_admin_update" on public.withdrawal_requests;
create policy "wd_admin_update" on public.withdrawal_requests
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---- support_tickets ------------------------------------------------------
drop policy if exists "tickets_select_self_or_admin" on public.support_tickets;
create policy "tickets_select_self_or_admin" on public.support_tickets
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "tickets_insert_self" on public.support_tickets;
create policy "tickets_insert_self" on public.support_tickets
  for insert with check (auth.uid() = user_id);

drop policy if exists "tickets_update_self_or_admin" on public.support_tickets;
create policy "tickets_update_self_or_admin" on public.support_tickets
  for update using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- ---- audit_logs -----------------------------------------------------------
drop policy if exists "audit_select_admin" on public.audit_logs;
create policy "audit_select_admin" on public.audit_logs
  for select using (public.is_admin(auth.uid()));

drop policy if exists "audit_insert_admin" on public.audit_logs;
create policy "audit_insert_admin" on public.audit_logs
  for insert with check (public.is_admin(auth.uid()) and auth.uid() = admin_id);

-- ---- admin_notes ----------------------------------------------------------
drop policy if exists "admin_notes_admin_all" on public.admin_notes;
create policy "admin_notes_admin_all" on public.admin_notes
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---- login_history --------------------------------------------------------
drop policy if exists "login_select_self_or_admin" on public.login_history;
create policy "login_select_self_or_admin" on public.login_history
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "login_insert_self" on public.login_history;
create policy "login_insert_self" on public.login_history
  for insert with check (auth.uid() = user_id);
