"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDownLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitWithdrawal } from "@/app/actions/withdrawals";
import { WITHDRAWAL_METHODS, type Currency } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type Props = {
  country: string;
  defaultCurrency?: Currency;
  wallets: { currency: Currency; available: number }[];
};

// Region resolution: simple — US is its own region; rest fall back to EU/UK list.
function regionFor(country: string): "US" | "EU_UK" {
  return country === "US" ? "US" : "EU_UK";
}

export function WithdrawalForm({ country, defaultCurrency = "USD", wallets }: Props) {
  const region = regionFor(country);
  const methods = WITHDRAWAL_METHODS[region];

  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [method, setMethod] = useState<string>(methods[0]?.id ?? "");
  const [amount, setAmount] = useState<string>("");
  const [paymentField, setPaymentField] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const currentWallet = useMemo(
    () => wallets.find((w) => w.currency === currency),
    [wallets, currency],
  );

  const placeholder = useMemo(() => methodPlaceholder(method), [method]);

  function reset() {
    setAmount("");
    setPaymentField("");
    setNotes("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (!currentWallet || amt > currentWallet.available) {
      toast.error("Amount exceeds available balance.");
      return;
    }
    startTransition(async () => {
      const res = await submitWithdrawal({
        currency,
        amount: amt,
        method,
        paymentDetails: { destination: paymentField },
        notes,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Submitted.");
      reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-2">
          New instruction
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground">
          Withdrawal request
        </h3>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          All withdrawals are reviewed and settled by your relationship manager.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((w) => (
                <SelectItem key={w.currency} value={w.currency}>
                  {w.currency} — {formatCurrency(w.available, w.currency)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentWallet && (
            <p className="text-[11.5px] text-muted-foreground tabular-figures">
              Available: {formatCurrency(currentWallet.available, currency)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="tabular-figures"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment">{placeholder.label}</Label>
        <Input
          id="payment"
          placeholder={placeholder.placeholder}
          value={paymentField}
          onChange={(e) => setPaymentField(e.target.value)}
        />
        <p className="text-[11.5px] text-muted-foreground">{placeholder.helper}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Instructions (optional)</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="e.g. ‘Please confirm before settlement.’"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex items-start gap-3 rounded-sm border border-champagne-500/20 bg-champagne-500/5 px-4 py-3 text-[12.5px] text-foreground">
        <ShieldCheck className="h-4 w-4 mt-0.5 text-champagne-700 dark:text-champagne-400" />
        <p>
          Continental never auto-settles outbound funds. A banker will review your instructions and
          execute manually. Funds are escrowed to <em>pending balance</em> until settlement.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Submitting…" : "Submit instruction"}
        {!pending && <ArrowDownLeft className="h-4 w-4" />}
      </Button>
    </form>
  );
}

function methodPlaceholder(method: string) {
  switch (method) {
    case "paypal":
      return {
        label: "PayPal email",
        placeholder: "name@example.com",
        helper: "We will settle to the verified PayPal account at this address.",
      };
    case "cashapp":
      return {
        label: "Cashtag",
        placeholder: "$yourtag",
        helper: "Cash App handle (with the leading $).",
      };
    case "zelle":
      return {
        label: "Zelle email or phone",
        placeholder: "name@example.com",
        helper: "The Zelle-enrolled email or US phone number.",
      };
    case "bank_transfer":
      return {
        label: "Bank account (routing + account)",
        placeholder: "Routing · Account · Beneficiary",
        helper: "We will request full instructions during banker review.",
      };
    case "sepa":
    case "iban":
      return {
        label: "IBAN",
        placeholder: "DE89 3704 0044 0532 0130 00",
        helper: "Full IBAN of the receiving account.",
      };
    case "wise":
      return {
        label: "Wise account email",
        placeholder: "name@example.com",
        helper: "We will settle to your Wise multi-currency balance.",
      };
    case "revolut":
      return {
        label: "Revolut tag",
        placeholder: "@yourtag",
        helper: "Revolut user tag or registered phone.",
      };
    case "uk_faster":
      return {
        label: "Sort code & account",
        placeholder: "12-34-56 · 12345678",
        helper: "UK Faster Payments — sort code and account number.",
      };
    default:
      return {
        label: "Destination",
        placeholder: "",
        helper: "Identifier or account for settlement.",
      };
  }
}
