"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  LayoutDashboard,
  LifeBuoy,
  ShieldCheck,
  UserRound,
  Wallet,
  Users,
  ScrollText,
  LineChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const clientItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/wallets", label: "Accounts", icon: Wallet },
  { href: "/dashboard/transactions", label: "Ledger", icon: ArrowLeftRight },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
];

const adminItems = [
  { href: "/admin", label: "Operations", icon: LayoutDashboard },
  { href: "/admin/users", label: "Clients", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownLeft },
  { href: "/admin/transactions", label: "Ledger", icon: ArrowLeftRight },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/audit-logs", label: "Audit", icon: ScrollText },
  { href: "/admin/analytics", label: "Analytics", icon: LineChart },
];

/**
 * Floating glass pill at the bottom — primary page switcher.
 * Mirrors the example's "Living room / Bathroom / Bedroom" pattern,
 * but for the Continental portal it's "Overview / Accounts / Ledger …".
 */
export function BottomPill({ variant = "client" }: { variant?: "client" | "admin" }) {
  const pathname = usePathname();
  const items = variant === "admin" ? adminItems : clientItems;

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-30 px-3">
      <div className="pointer-events-auto mx-auto w-fit max-w-[calc(100vw-1.5rem)] overflow-x-auto glass-pill flex items-center gap-0.5 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon as LucideIcon;
          const active =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href === "/admin" && pathname === "/admin") ||
            (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full px-2.5 sm:px-3.5 py-2 text-[12.5px] font-medium shrink-0",
                "transition-colors duration-200",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`pill-${variant}`}
                  className="absolute inset-0 rounded-full bg-foreground/[0.08] border border-champagne-500/30"
                  transition={{ type: "tween", duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-3.5 w-3.5",
                  active && "text-champagne-700 dark:text-champagne-400",
                )}
                strokeWidth={1.6}
              />
              <span className="relative hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
