"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
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
import { signUpAction } from "@/app/actions/auth";
import { COUNTRIES, CURRENCIES, LANGUAGES } from "@/lib/constants";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signUpAction(fd);
      if (!res.ok) {
        setError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        toast.error(res.error);
        return;
      }
      toast.success("Account created. Welcome to Continental.");
      router.replace(res.redirectTo ?? "/pending");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full legal name</Label>
        <Input id="fullName" name="fullName" autoComplete="name" required />
        <FieldError msg={errors.fullName} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
          <FieldError msg={errors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground hover:text-foreground transition"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError msg={errors.password} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select name="country" required>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select" />
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
          <Label htmlFor="preferredLanguage">Language</Label>
          <Select name="preferredLanguage" defaultValue="en">
            <SelectTrigger id="preferredLanguage">
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
          <Label htmlFor="preferredCurrency">Reporting currency</Label>
          <Select name="preferredCurrency" defaultValue="USD">
            <SelectTrigger id="preferredCurrency">
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

      {error && (
        <div className="rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive">
          {error}
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Submitting…" : "Submit application"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>

      <p className="text-center text-[12px] text-muted-foreground">
        By submitting you agree to Continental's{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">
          Confidentiality Charter
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">
          Terms of Engagement
        </Link>
        .
      </p>

      <p className="text-center text-[13px] text-muted-foreground">
        Already a client?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[12px] text-destructive">{msg}</p>;
}
