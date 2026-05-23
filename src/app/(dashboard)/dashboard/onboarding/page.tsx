import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, MessageSquare, ShieldCheck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { MotionCard } from "@/components/motion/motion-card";
import { requireApprovedClient } from "@/lib/auth";
import { formatAccountNumber } from "@/lib/utils";
import { KYC_STATUS, type KycStatus } from "@/lib/constants";

export const metadata = { title: "Client Onboarding" };

export default async function OnboardingPage() {
  const user = await requireApprovedClient();
  const kycStatus = (user.profile.kyc_status ?? "not_submitted") as KycStatus;

  const steps = [
    {
      icon: CheckCircle2,
      label: "Account created",
      value: "Private client profile opened.",
      done: true,
    },
    {
      icon: FileCheck2,
      label: "KYC verification",
      value: KYC_STATUS[kycStatus],
      done: kycStatus === "approved",
    },
    {
      icon: Wallet,
      label: "Portfolio review",
      value: "Confirm currency accounts and mandate.",
      done: false,
    },
    {
      icon: MessageSquare,
      label: "Secure channel",
      value: "Use Messages for officer instructions.",
      done: false,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Welcome to Continental"
        title="Your private office is open."
        description="Start with verification, then review your currency accounts, documents, and secure messaging channel."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to portfolio</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/profile">
                Complete KYC
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <MotionCard index={0} intensity="strong" className="overflow-hidden">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge variant="gold" className="mb-4">
              <ShieldCheck className="mr-1.5 h-3 w-3" /> Activation checklist
            </Badge>
            <h2 className="font-display text-3xl font-semibold text-ivory-100">
              {user.profile.full_name}
            </h2>
            <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-ivory-100/55 tabular-figures">
              {formatAccountNumber(user.profile.account_number)}
            </div>
            <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-ivory-100/62">
              Your account reference is active for the build environment. The next important step is KYC submission so an admin can approve your profile from the dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step) => (
              <StepCard
                key={step.label}
                icon={step.icon}
                label={step.label}
                value={step.value}
                done={step.done}
              />
            ))}
          </div>
        </div>
      </MotionCard>

      <section className="grid gap-4 md:grid-cols-3">
        <MotionCard index={1} className="p-5">
          <SmallStep label="1. Verify identity" value="Upload passport, ID, proof of address, or funds-source evidence in Profile." />
        </MotionCard>
        <MotionCard index={2} className="p-5">
          <SmallStep label="2. Review account registry" value="Confirm USD, EUR, and GBP account buckets before withdrawals." />
        </MotionCard>
        <MotionCard index={3} className="p-5">
          <SmallStep label="3. Keep receipts" value="Statements, KYC confirmations, refund evidence, and withdrawal receipts live in Document Vault." />
        </MotionCard>
      </section>
    </div>
  );
}

function StepCard({
  icon: Icon,
  label,
  value,
  done,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  done: boolean;
}) {
  return (
    <div className="rounded-md border border-ivory-100/[0.08] bg-ivory-100/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <Icon className={done ? "h-4 w-4 text-success" : "h-4 w-4 text-champagne-300"} />
        <span className={done ? "h-2 w-2 rounded-full bg-success" : "h-2 w-2 rounded-full bg-champagne-400/70"} />
      </div>
      <div className="mt-4 text-[10.5px] uppercase tracking-[0.18em] text-ivory-100/45">
        {label}
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-ivory-100">{value}</div>
    </div>
  );
}

function SmallStep({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.16em] text-champagne-700 dark:text-champagne-400">
        {label}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{value}</p>
    </div>
  );
}
