-- =============================================================================
-- Continental Bank — Client KYC verification workflow
-- =============================================================================
-- Adds profile-level KYC submission fields and a private Storage bucket for
-- client verification documents. Clients submit through the app; admins review
-- and approve/reject from the admin dashboard.
-- =============================================================================

do $$ begin
  create type public.kyc_status as enum (
    'not_submitted', 'submitted', 'under_review', 'approved', 'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.kyc_method as enum (
    'passport',
    'national_id',
    'drivers_license',
    'proof_of_address',
    'source_of_funds',
    'business_registry'
  );
exception when duplicate_object then null; end $$;

alter table public.profiles
  add column if not exists kyc_status public.kyc_status not null default 'not_submitted',
  add column if not exists kyc_method public.kyc_method,
  add column if not exists kyc_document_name text,
  add column if not exists kyc_document_path text,
  add column if not exists kyc_document_mime_type text,
  add column if not exists kyc_submitted_at timestamptz,
  add column if not exists kyc_reviewed_at timestamptz,
  add column if not exists kyc_reviewed_by_admin_id uuid references public.profiles(id) on delete set null,
  add column if not exists kyc_review_note text;

create index if not exists profiles_kyc_status_idx on public.profiles(kyc_status);
create index if not exists profiles_kyc_submitted_idx on public.profiles(kyc_submitted_at desc);

-- Private bucket used by server actions. Documents are not publicly readable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Keep client-side profile edits from changing privileged review fields. The
-- app writes KYC submissions and admin decisions with the service-role client.
create or replace function public.profile_privileged_fields_unchanged(
  target_id uuid,
  next_role public.user_role,
  next_account_status public.account_status,
  next_kyc_status public.kyc_status,
  next_kyc_method public.kyc_method,
  next_kyc_document_name text,
  next_kyc_document_path text,
  next_kyc_document_mime_type text,
  next_kyc_submitted_at timestamptz,
  next_kyc_reviewed_at timestamptz,
  next_kyc_reviewed_by_admin_id uuid,
  next_kyc_review_note text
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_id
      and p.role = next_role
      and p.account_status = next_account_status
      and p.kyc_status = next_kyc_status
      and p.kyc_method is not distinct from next_kyc_method
      and p.kyc_document_name is not distinct from next_kyc_document_name
      and p.kyc_document_path is not distinct from next_kyc_document_path
      and p.kyc_document_mime_type is not distinct from next_kyc_document_mime_type
      and p.kyc_submitted_at is not distinct from next_kyc_submitted_at
      and p.kyc_reviewed_at is not distinct from next_kyc_reviewed_at
      and p.kyc_reviewed_by_admin_id is not distinct from next_kyc_reviewed_by_admin_id
      and p.kyc_review_note is not distinct from next_kyc_review_note
  );
$$;

drop policy if exists "profiles_update_self_limited" on public.profiles;
create policy "profiles_update_self_limited" on public.profiles
  for update using (auth.uid() = id) with check (
    auth.uid() = id
    and public.profile_privileged_fields_unchanged(
      id,
      role,
      account_status,
      kyc_status,
      kyc_method,
      kyc_document_name,
      kyc_document_path,
      kyc_document_mime_type,
      kyc_submitted_at,
      kyc_reviewed_at,
      kyc_reviewed_by_admin_id,
      kyc_review_note
    )
  );
