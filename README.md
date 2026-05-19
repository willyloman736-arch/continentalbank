# Continental Bank — Private Client Portal

A premium institutional private-banking client portal MVP. Built with
**Next.js 15 (App Router)**, **TypeScript**, **Supabase**, **Tailwind CSS**,
and **shadcn/ui** — designed for a Swiss-private-bank aesthetic, not a SaaS
startup.

> This is a private client portal and wealth-management-style dashboard.
> It is **not** a real banking core. All balances, deposits, withdrawals,
> and wallet updates are manually controlled by administrators. No real ACH,
> SWIFT, card-issuing, or settlement rails are implemented.

---

## Table of contents

1. [Stack](#stack)
2. [Local setup](#local-setup)
3. [Supabase setup](#supabase-setup)
4. [Bootstrap a super admin](#bootstrap-a-super-admin)
5. [Project structure](#project-structure)
6. [Architecture notes](#architecture-notes)
7. [Deploy to Vercel](#deploy-to-vercel)
8. [Environment variables](#environment-variables)

---

## Stack

| Layer             | Choice                                                                  |
|-------------------|-------------------------------------------------------------------------|
| Framework         | Next.js 15 (App Router, RSC, Server Actions)                            |
| Language          | TypeScript (strict)                                                     |
| UI                | Tailwind CSS + shadcn/ui (Radix primitives)                             |
| Auth & DB         | Supabase (Postgres, Auth, RLS)                                          |
| Hosting           | Vercel                                                                  |
| i18n              | Custom dictionary architecture w/ locale detection                       |
| Toasts            | Sonner                                                                  |
| Forms             | React Hook Form-friendly (lightweight client components used here)      |
| Validation        | Zod                                                                     |

---

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in Supabase credentials
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Then open <http://localhost:3000>.

---

## Supabase setup

**👉 [Full step-by-step walkthrough: SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Quick version:

1. Create a project on [supabase.com](https://supabase.com), copy URL + anon + service_role keys.
2. Paste them into `.env.local` (local) and Vercel env vars (production).
3. Run [`supabase/migrations/0001_initial_schema.sql`](supabase/migrations/0001_initial_schema.sql) in the Supabase SQL editor.
4. Add `https://your-domain/auth/callback` to Supabase → Authentication → URL Configuration.

The migration installs:

- **9 tables**: `profiles`, `wallets`, `ledger_entries`, `transactions`,
  `withdrawal_requests`, `support_tickets`, `audit_logs`, `admin_notes`,
  `login_history`.
- **Enums** for role, account status, currency, transaction type,
  withdrawal status, ticket status.
- **Triggers**: auto-create profile + three currency wallets when a user signs up.
- **Immutable ledger / audit log triggers** (rows cannot be updated or deleted).
- **Full Row Level Security** policies for every table.

---

## Bootstrap a super admin

After running the migration:

1. Register a normal user from the UI at `/register`.
2. In Supabase SQL editor, run:

   ```sql
   update public.profiles
   set role = 'super_admin', account_status = 'approved'
   where email = 'you@example.com';
   ```

3. Sign in at `/login`. You will be routed to `/admin`.

> The admin can subsequently create other users (clients or other admins)
> directly from `/admin/users` without going through the public registration flow.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/              ← Login, Register, Pending — share an editorial layout
│   ├── (dashboard)/         ← Approved-client portal
│   ├── admin/               ← Officer console (super_admin, finance_admin, support_admin)
│   ├── actions/             ← Server actions (auth, withdrawals, admin, support, profile, locale)
│   ├── api/health           ← Health probe
│   ├── auth/callback/       ← Supabase OAuth/Email callback
│   ├── layout.tsx           ← Root layout (fonts, providers, toaster)
│   ├── page.tsx             ← Marketing landing
│   ├── globals.css          ← Design tokens + utility classes
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── marketing/           ← Public site sections (hero, trust, features, footer)
│   ├── auth/                ← Login & register forms
│   ├── dashboard/           ← Client sidebar, topbar, page-header, forms
│   ├── admin/               ← Admin sidebar, topbar, dialogs, decision actions
│   ├── shared/              ← Providers, brand mark, language switcher
│   └── ui/                  ← shadcn/ui primitives
├── lib/
│   ├── auth.ts              ← requireUser / requireAdmin / requireApprovedClient
│   ├── constants.ts         ← Currencies, countries, languages, statuses
│   ├── utils.ts             ← cn, formatCurrency, formatDate, account number helpers
│   ├── validation.ts        ← Zod schemas for every server action
│   ├── email/               ← Premium transactional templates + provider stub
│   ├── i18n/                ← Dictionaries + locale detection
│   ├── supabase/            ← Browser client, server client, service client, middleware
│   └── types/database.ts    ← Typed Database interface
├── middleware.ts            ← Cookie refresh + protected-route routing
└── supabase/
    ├── migrations/0001_initial_schema.sql
    └── seed.sql
```

---

## Architecture notes

### The accounting rule

Balances are **never** mutated without an immutable ledger entry. Every wallet
update writes one row to `ledger_entries` with:

- `balance_before` and `balance_after` snapshots,
- the `admin_id` responsible (or `null` for client-initiated requests),
- the `action_type` and a free-text `note`.

The ledger and `audit_logs` tables are protected by a trigger that raises on
any `UPDATE` or `DELETE`. RLS allows reads only to the owning user or any admin;
inserts on the ledger are admin-only.

### Withdrawal lifecycle

1. **Client submits** → funds move from `available_balance` → `pending_balance`.
   A ledger entry, a `withdrawal_requests` row, and a client-visible
   `transactions` row (status: `pending`) are created.
2. **Officer approves** → no balance change. The request awaits manual
   settlement by a banker.
3. **Officer marks completed** → `pending_balance` decreases, `total_withdrawn`
   increases. The matching transaction is updated to `completed`.
4. **Officer rejects** → `pending_balance` returns to `available_balance`.
   The transaction is updated to `rejected`.

All four state changes write to the ledger and the audit log.

### Roles

| Role            | What they can do                                                          |
|-----------------|---------------------------------------------------------------------------|
| `super_admin`   | Everything, including creating other users (admins or clients).           |
| `finance_admin` | Approve/reject withdrawals, post balance adjustments, reply to tickets.   |
| `support_admin` | Reply to tickets, review accounts. **Cannot** touch balances/withdrawals. |
| `client`        | Own accounts, own withdrawals, own tickets, own profile.                  |

### Currency system

Each user has three **independent** wallets — USD, EUR, GBP — each with its own
available, pending, and withdrawn balance. The `preferred_currency` on the
profile is purely a **reporting** preference. The UI never converts between
currencies; balances are reported at face value.

### Internationalisation

- Locale detection order: `cookie → Accept-Language → country-header → default`.
- IP-only detection is intentionally avoided per spec.
- `setLocale` server action persists the preference in both a cookie and the
  user profile.
- English dictionary is complete; other languages provide partial overrides
  and fall back gracefully.

### Security

- Cookie-based Supabase sessions, refreshed in `middleware.ts`.
- Row Level Security enforced on every table.
- All admin writes go through server actions that call `requireAdmin()` first.
- The service-role client is only ever created server-side
  (`createServiceClient()`), and the env var is **never** exposed to the browser.
- Strict security headers in `next.config.ts` and `vercel.json`.
- Login attempts recorded to `login_history` with IP, browser, and location.

---

## Deploy to Vercel

```bash
vercel
# or push to a GitHub repo connected to Vercel.
```

Set the following environment variables in Vercel project settings:

| Variable                          | Where                       |
|-----------------------------------|-----------------------------|
| `NEXT_PUBLIC_SITE_URL`            | All environments            |
| `NEXT_PUBLIC_SUPABASE_URL`        | All environments            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | All environments            |
| `SUPABASE_SERVICE_ROLE_KEY`       | Production & Preview only   |

Then add your deployed URL to **Supabase → Authentication → URL Configuration → Redirect URLs**:

```
https://your-domain.com/auth/callback
http://localhost:3000/auth/callback
```

---

## Environment variables

See [`.env.example`](.env.example).

---

## Notes & conventions

- **Tabular numerals** are used on every figure to align decimal places.
- **`bg-paper`, `bg-noise`, `gold-underline`** utilities in `globals.css` give
  marketing pages a print-feel without screaming "AI gradient".
- The brand mark is built in inline SVG (`components/shared/brand-mark.tsx`)
  so it never depends on an external asset.
- Animations are restrained: a slow fade-in on page-load and gold underlines.
  No bouncing icons or spring physics — by design.
