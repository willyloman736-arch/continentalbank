"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ArrowDownLeft,
  LifeBuoy,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { NavItem } from "@/components/motion/nav-item";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wallets", label: "Currency Accounts", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex h-screen sticky top-0 w-[252px] shrink-0 flex-col border-r border-border bg-card">
      <div className="px-6 py-7 border-b border-border">
        <Link href="/" className="focus-ring rounded-sm inline-block">
          <BrandMark />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <div className="px-3 pb-2 eyebrow text-muted-foreground">Private Portal</div>
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <NavItem
              key={item.href}
              groupId="client-nav"
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={active}
            />
          );
        })}
      </nav>

      <div className="m-3 rounded-md border border-border bg-background/60 p-4">
        <div className="eyebrow text-champagne-700 dark:text-champagne-400">Relationship</div>
        <div className="mt-2 text-[13px] font-medium text-foreground">É. Dupont</div>
        <div className="text-[12px] text-muted-foreground">Private Banker · Geneva</div>
        <a
          href="mailto:e.dupont@continental.example"
          className="mt-3 inline-block text-[12px] uppercase tracking-[0.14em] text-foreground hover:text-champagne-700 dark:hover:text-champagne-400 underline underline-offset-4"
        >
          Direct line
        </a>
      </div>
    </aside>
  );
}
