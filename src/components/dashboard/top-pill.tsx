"use client";

import Link from "next/link";
import { Bell, Calendar, LayoutGrid, LogOut, Search, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { signOutAction } from "@/app/actions/auth";
import { cn, initials } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/dictionaries";

type Props = {
  fullName: string;
  email: string;
  accountNumber: string | null;
  locale: Locale;
  variant?: "client" | "admin";
};

/**
 * Floating glass pill that lives at the top of the protected area.
 * Mirrors the example screenshot — search, view, calendar, notifications,
 * language. Sits on top of the ambient backdrop so the glass reads.
 */
export function TopPill({ fullName, email, accountNumber, locale, variant = "client" }: Props) {
  return (
    <div className="px-3 lg:px-10 pt-3 lg:pt-6 z-30 sticky top-0">
      <div className="mx-auto max-w-7xl flex items-center gap-2 sm:gap-3">
        {/* Tools pill (left) */}
        <div className="glass-pill flex items-center gap-1 px-1.5 py-1 shrink-0">
          <PillButton aria-label="Search">
            <Search className="h-4 w-4" />
          </PillButton>
          <PillButton aria-label="Views" data-active>
            <LayoutGrid className="h-4 w-4" />
          </PillButton>
          <PillButton aria-label="Calendar" className="hidden sm:inline-flex">
            <Calendar className="h-4 w-4" />
          </PillButton>
          <PillButton aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-champagne-500" />
          </PillButton>
          <div className="mx-1 h-5 w-px bg-foreground/10 hidden sm:block" />
          <div className="px-1 hidden sm:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>

        {/* Account chip — pushed to right */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="glass-pill flex items-center gap-2 sm:gap-3 pl-1.5 pr-2 sm:pr-3.5 py-1.5 focus-ring hover:bg-card/70 transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{initials(fullName)}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <div className="text-[12.5px] font-medium leading-tight">{fullName}</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground leading-tight mt-0.5 tabular-figures">
                    {variant === "admin" ? "Officer" : accountNumber ?? "—"}
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 glass-strong">
              <DropdownMenuLabel className="px-2 py-2 normal-case tracking-normal">
                <div className="text-[13px] font-medium text-foreground">{fullName}</div>
                <div className="text-[12px] text-muted-foreground">{email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {variant === "client" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <UserRound className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/security">
                      <Settings className="h-4 w-4" /> Security
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function PillButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full",
        "text-muted-foreground transition-colors duration-200",
        "hover:text-foreground hover:bg-foreground/[0.06]",
        "data-[active]:bg-foreground/[0.08] data-[active]:text-foreground",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-champagne-500",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
