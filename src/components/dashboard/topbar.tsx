"use client";

import Link from "next/link";
import { Bell, LogOut, MessageSquare, Search, Settings, UserRound } from "lucide-react";
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
import { formatAccountNumber, initials } from "@/lib/utils";

type Props = {
  fullName: string;
  email: string;
  accountNumber: string | null;
  locale: Locale;
};

export function DashboardTopbar({ fullName, email, accountNumber, locale }: Props) {
  return (
    <header className="sticky top-[65px] z-30 border-b border-white/[0.08] bg-[#111A22]/88 shadow-[0_16px_40px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:top-0">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="hidden min-w-[220px] md:block">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-champagne-300">
            Private portal
          </div>
          <div className="mt-1 text-[12px] tabular-figures text-ivory-100/52">
            {formatAccountNumber(accountNumber)}
          </div>
        </div>

        <label className="relative hidden h-10 max-w-xl flex-1 items-center rounded-sm border border-white/[0.08] bg-white/[0.045] px-3 text-ivory-100/76 transition focus-within:ring-2 focus-within:ring-ring/60 md:flex">
          <Search className="mr-2 h-4 w-4 text-ivory-100/42" strokeWidth={1.6} />
          <input
            type="search"
            placeholder="Search accounts, documents, messages"
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ivory-100/34"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="gold" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard/messages">
              <MessageSquare className="h-3.5 w-3.5" />
              Message banker
            </Link>
          </Button>

          <div className="hidden sm:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          <Button
            asChild
            variant="outline"
            size="icon"
            aria-label="Notifications"
            className="border-white/[0.08] bg-white/[0.045] text-ivory-100/82 hover:bg-white/[0.08]"
          >
            <Link href="/dashboard/notifications">
              <Bell className="h-4 w-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus-ring flex items-center gap-3 rounded-sm border border-white/[0.08] bg-white/[0.045] py-1 pl-1 pr-3 transition-colors hover:bg-white/[0.08]">
                <Avatar>
                  <AvatarFallback>{initials(fullName)}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:block">
                  <div className="text-[13px] font-medium leading-tight text-ivory-100">
                    {fullName}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase leading-tight tracking-[0.14em] text-ivory-100/46">
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
      </div>
    </header>
  );
}
