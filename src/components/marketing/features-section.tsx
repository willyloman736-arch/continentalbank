import { Globe2, ArrowDownLeft, KeyRound, Layers } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { MarketingBackdrop } from "./marketing-backdrop";

const features = [
  {
    icon: Globe2,
    eyebrow: "Multi-Currency",
    title: "Three sovereign portfolios",
    body: "Hold USD, EUR, and GBP positions independently — each with its own statement, ledger, and reconciliation log. Optional consolidated reporting for the principal's view.",
  },
  {
    icon: ArrowDownLeft,
    eyebrow: "Secure Withdrawals",
    title: "Reviewed by a banker, not a script",
    body: "Withdrawal instructions are received, validated, and authorised by your private banker before settlement — across SEPA, IBAN, Wise, Revolut, UK Faster Payments, PayPal, and domestic rails.",
  },
  {
    icon: KeyRound,
    eyebrow: "Approved Access",
    title: "Vetted, never anonymous",
    body: "Every relationship begins with a sponsored introduction and a formal review. Access is granted by a partner — never automated, never silent.",
  },
  {
    icon: Layers,
    eyebrow: "Audited Ledger",
    title: "Every figure has a witness",
    body: "Each balance change writes an immutable ledger entry — with the responsible officer, the prior state, the new state, and the note that justified it. Reconcilable on demand.",
  },
];

export function FeaturesSection() {
  return (
    <section id="services" className="relative bg-background overflow-hidden">
      <MarketingBackdrop />
      <div className="container relative py-24 lg:py-32">
        <Reveal className="mb-16 max-w-2xl">
          <div className="eyebrow flex items-center gap-3 mb-6">
            <span className="inline-block h-px w-8 bg-champagne-500/70" />
            <span>The Portfolio</span>
          </div>
          <h2 className="font-display text-display-lg text-foreground text-balance">
            Tools your bankers use, made available to you.
          </h2>
        </Reveal>

        <Stagger as="ul" className="grid gap-4 md:grid-cols-2" step={0.07}>
          {features.map((f) => (
            <StaggerItem as="li" key={f.title} className="glass-light p-8 lg:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="eyebrow text-champagne-700 dark:text-champagne-400">
                    {f.eyebrow}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground text-balance">
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground text-pretty">
                    {f.body}
                  </p>
                </div>
                <f.icon className="h-6 w-6 shrink-0 text-champagne-600/80" strokeWidth={1.4} />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
