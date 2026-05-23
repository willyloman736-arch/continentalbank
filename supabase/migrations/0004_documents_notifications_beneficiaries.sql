-- =============================================================================
-- Continental Bank — Generated documents, notifications, beneficiaries
-- =============================================================================
-- Adds a real receipt/document engine behind the client vault, event
-- notifications, and persisted beneficiary review workflow.
-- =============================================================================

create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (
    type in (
      'statement',
      'account_letter',
      'kyc',
      'withdrawal_receipt',
      'refund_evidence',
      'beneficiary_receipt',
      'security_receipt',
      'support_receipt',
      'tax'
    )
  ),
  title text not null,
  description text not null,
  size_label text not null default '72 KB',
  currency public.currency_code,
  reference text,
  source_type text,
  source_id text,
  body jsonb not null default '{}'::jsonb,
  issued_by_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists generated_documents_user_idx
  on public.generated_documents(user_id, created_at desc);
create index if not exists generated_documents_type_idx
  on public.generated_documents(type, created_at desc);
create index if not exists generated_documents_source_idx
  on public.generated_documents(source_type, source_id);

alter table public.generated_documents enable row level security;

drop policy if exists "generated_documents_select_self_or_admin" on public.generated_documents;
create policy "generated_documents_select_self_or_admin" on public.generated_documents
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "generated_documents_insert_admin" on public.generated_documents;
create policy "generated_documents_insert_admin" on public.generated_documents
  for insert with check (public.is_admin(auth.uid()));

drop policy if exists "generated_documents_admin_all" on public.generated_documents;
create policy "generated_documents_admin_all" on public.generated_documents
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (
    kind in ('account', 'withdrawal', 'refund', 'message', 'security', 'document')
  ),
  severity text not null default 'info' check (
    severity in ('info', 'success', 'warning', 'danger')
  ),
  title text not null,
  body text not null,
  href text,
  currency public.currency_code,
  amount_label text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications(user_id, created_at desc);
create index if not exists notifications_unread_idx
  on public.notifications(user_id, read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_self_or_admin" on public.notifications;
create policy "notifications_select_self_or_admin" on public.notifications
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "notifications_update_self_read" on public.notifications;
create policy "notifications_update_self_read" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notifications_insert_admin" on public.notifications;
create policy "notifications_insert_admin" on public.notifications
  for insert with check (public.is_admin(auth.uid()));

drop policy if exists "notifications_admin_all" on public.notifications;
create policy "notifications_admin_all" on public.notifications
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create table if not exists public.beneficiaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nickname text not null,
  account_holder text not null,
  rail text not null check (
    rail in ('bank_wire', 'sepa', 'uk_faster', 'paypal', 'wise', 'revolut', 'zelle', 'cashapp')
  ),
  currency public.currency_code not null,
  country text not null,
  destination_masked text not null,
  bank text,
  notes text,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'expired')
  ),
  is_default boolean not null default false,
  submitted_by_full_name text not null,
  reviewed_by_admin_id uuid references public.profiles(id) on delete set null,
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists beneficiaries_user_idx
  on public.beneficiaries(user_id, created_at desc);
create index if not exists beneficiaries_status_idx
  on public.beneficiaries(status, created_at desc);

drop trigger if exists beneficiaries_updated_at on public.beneficiaries;
create trigger beneficiaries_updated_at
  before update on public.beneficiaries
  for each row execute function public.set_updated_at();

alter table public.beneficiaries enable row level security;

drop policy if exists "beneficiaries_select_self_or_admin" on public.beneficiaries;
create policy "beneficiaries_select_self_or_admin" on public.beneficiaries
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "beneficiaries_insert_self" on public.beneficiaries;
create policy "beneficiaries_insert_self" on public.beneficiaries
  for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "beneficiaries_admin_update" on public.beneficiaries;
create policy "beneficiaries_admin_update" on public.beneficiaries
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "beneficiaries_admin_all" on public.beneficiaries;
create policy "beneficiaries_admin_all" on public.beneficiaries
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
