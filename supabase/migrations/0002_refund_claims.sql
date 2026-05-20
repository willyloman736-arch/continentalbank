-- =============================================================================
-- Continental Bank — Refund claims
-- =============================================================================
-- Adds the refund-claims subsystem:
--   * `public_claim`        — anyone can file (anonymous)
--   * `transaction_dispute` — signed-in client disputes a past transaction
--
-- Status flow: pending → under_review → (approved | rejected) → completed
-- Approval does NOT move money. An officer settles manually, then marks
-- the claim "completed". Every decision writes to audit_logs.
-- =============================================================================

do $$ begin
  create type public.refund_claim_status as enum (
    'pending', 'under_review', 'approved', 'rejected', 'completed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.refund_claim_type as enum (
    'transaction_dispute', 'public_claim'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.refund_claims (
  id uuid primary key default gen_random_uuid(),
  -- Nullable: public claims may not be from an existing client.
  user_id uuid references public.profiles(id) on delete set null,
  claim_type public.refund_claim_type not null,
  -- Captured at submission time so the record stands alone.
  claimant_name text not null,
  claimant_email citext not null,
  claimant_phone text,
  -- The reference the claimant gives us (their account number, their
  -- guess, or blank for public claims).
  account_reference text,
  transaction_reference text,
  related_transaction_id uuid references public.transactions(id) on delete set null,
  currency public.currency_code,
  amount numeric(18, 2) not null check (amount > 0),
  description text not null,
  supporting_info jsonb not null default '{}'::jsonb,
  status public.refund_claim_status not null default 'pending',
  admin_note text,
  processed_by_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists refund_claims_user_idx on public.refund_claims(user_id, created_at desc);
create index if not exists refund_claims_status_idx on public.refund_claims(status);
create index if not exists refund_claims_email_idx on public.refund_claims(claimant_email);

drop trigger if exists refund_claims_updated_at on public.refund_claims;
create trigger refund_claims_updated_at
  before update on public.refund_claims
  for each row execute function public.set_updated_at();

alter table public.refund_claims enable row level security;

-- ---- SELECT ---------------------------------------------------------------
-- Owners see their own. Admins see all. Public/anonymous see nothing.
drop policy if exists "refund_select_self_or_admin" on public.refund_claims;
create policy "refund_select_self_or_admin" on public.refund_claims
  for select using (
    (user_id is not null and auth.uid() = user_id)
    or public.is_admin(auth.uid())
  );

-- ---- INSERT ---------------------------------------------------------------
-- Three valid insert shapes:
--   1. Signed-in client filing a dispute against their own account
--   2. Signed-in client filing a public claim (links to themselves)
--   3. Anonymous public claim (user_id must be null)
drop policy if exists "refund_insert_self_or_public" on public.refund_claims;
create policy "refund_insert_self_or_public" on public.refund_claims
  for insert with check (
    -- Authenticated user — must be filing for themselves OR an anonymous
    -- public claim with no user_id.
    (auth.uid() is not null and (user_id = auth.uid() or user_id is null))
    -- Anonymous — must be a public claim with no user_id.
    or (auth.uid() is null and user_id is null and claim_type = 'public_claim')
  );

-- ---- UPDATE ---------------------------------------------------------------
-- Only admins can change a claim once it's filed.
drop policy if exists "refund_admin_update" on public.refund_claims;
create policy "refund_admin_update" on public.refund_claims
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
