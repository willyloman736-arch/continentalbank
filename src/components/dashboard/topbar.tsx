"use client";

import Link from "next/link";
import { Bell, LogOut, Menu, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { signOutAction } from "@/app/actions/auth";
import type { Locale } from "@/lib/i18n/dictionaries";
import { initials } from "@/lib/utils";

type Props = {
  fullName: string;
  email: string;
  accountNumber: string | null;
  locale: Locale;
  onOpenMobileNav?: () => void;
};

export function DashboardTopbar({
  fullName,
  email,
  accountNumber,
  locale,
  onOpenMobileNav,
}: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="hidden md:block">
          <div className="eyebrow text-muted-foreground">Account</div>
          <div className="mt-0.5 text-[13px] tabular-figures font-medium text-foreground">
            {accountNumber ?? "—"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={locale} />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-sm pl-2 pr-3 py-1 hover:bg-muted/60 focus-ring transition-colors">
              <Avatar>
                <AvatarFallback>{initials(fullName)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <div className="text-[13px] font-medium leading-tight">{fullName}</div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground leading-tight mt-0.5">
                  Private Client
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="px-2 py-2 normal-case tracking-normal">
              <div className="text-[13px] font-medium text-foreground">{fullName}</div>
              <div className="text-[12px] text-muted-foreground">{email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
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
    </header>
  );
}
