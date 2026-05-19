"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowDownLeft,
  ArrowLeftRight,
  LifeBuoy,
  ScrollText,
  LineChart,
} from "lucide-react";
import { BrandMark } from "@/components/shared/brand-mark";
import { NavItem } from "@/components/motion/nav-item";

const items = [
  { href: "/admin", label: "Operations", icon: LayoutDashboard },
  { href: "/admin/users", label: "Clients", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
  { href: "/admin/transactions", label: "Ledger", icon: ArrowLeftRight },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex h-screen sticky top-0 w-[252px] shrink-0 flex-col border-r border-border bg-card">
      <div className="px-6 py-7 border-b border-border">
        <Link href="/" className="focus-ring rounded-sm inline-block">
          <BrandMark />
        </Link>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-champagne-500/30 bg-champagne-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-champagne-700 dark:text-champagne-300">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-500" />
          Officers' Console
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <div className="px-3 pb-2 eyebrow text-muted-foreground">Administration</div>
        {items.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <NavItem
              key={item.href}
              groupId="admin-nav"
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={active}
            />
          );
        })}
      </nav>

      <div className="m-3 rounded-md border border-border bg-background/60 p-4">
        <div className="eyebrow text-muted-foreground">Audit</div>
        <p className="mt-2 text-[12px] text-foreground leading-relaxed">
          Every action is signed by your officer credentials and recorded against the immutable
          audit log.
        </p>
      </div>
    </aside>
  );
}
