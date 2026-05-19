"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/actions/profile";

export function PasswordChangeForm() {
  const [state, setState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.newPassword !== state.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    startTransition(async () => {
      const res = await changePassword(state);
      if (!res.ok) toast.error(res.error);
      else {
        toast.success(res.message ?? "Updated.");
        setState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={state.currentPassword}
          onChange={(e) => setState({ ...state, currentPassword: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={state.newPassword}
          onChange={(e) => setState({ ...state, newPassword: e.target.value })}
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={state.confirmPassword}
          onChange={(e) => setState({ ...state, confirmPassword: e.target.value })}
          required
          minLength={8}
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
