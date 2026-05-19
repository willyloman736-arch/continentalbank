"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from "@/app/actions/profile";
import { COUNTRIES, CURRENCIES, LANGUAGES } from "@/lib/constants";

type Initial = {
  fullName: string;
  phone: string;
  country: string;
  preferredLanguage: string;
  preferredCurrency: string;
  email: string;
};

export function ProfileForm({ initial }: { initial: Initial }) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState(initial);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateProfile(state);
      if (!res.ok) toast.error(res.error);
      else toast.success(res.message ?? "Updated.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full legal name</Label>
        <Input
          id="fullName"
          value={state.fullName}
          onChange={(e) => setState({ ...state, fullName: e.target.value })}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email (read only)</Label>
          <Input id="email" value={state.email} disabled />
          <p className="text-[11.5px] text-muted-foreground">
            Contact your relationship manager to change your email of record.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={state.phone}
            onChange={(e) => setState({ ...state, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={state.country}
            onValueChange={(v) => setState({ ...state, country: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Select
            value={state.preferredLanguage}
            onValueChange={(v) => setState({ ...state, preferredLanguage: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Reporting currency</Label>
          <Select
            value={state.preferredCurrency}
            onValueChange={(v) => setState({ ...state, preferredCurrency: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
