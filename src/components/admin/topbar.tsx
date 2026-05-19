"use client";

import { Bell, LogOut, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";
import { ROLE_LABELS, type Role } from "@/lib/constants";
import { initials } from "@/lib/utils";

export function AdminTopbar({
  fullName,
  email,
  role,
}: {
  fullName: string;
  email: string;
  role: Role;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/85 backdrop-blur-md px-4 lg:px-8">
      <div className="hidden md:flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-champagne-600" />
        Officer console · Geneva
      </div>

      <div className="flex items-center gap-2 ml-auto">
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
                  {ROLE_LABELS[role]}
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
