import { ScrollText, Landmark, Compass, Crown } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { TrustBadgeRail } from "@/components/shared/trust-badges";
import { MarketingBackdrop } from "./marketing-backdrop";

const pillars = [
  {
    icon: Landmark,
    title: "Institutional Reliability",
    body: "Custody and oversight modelled on the protocols established by Continental's founding partners in 1972.",
  },
  {
    icon: Crown,
    title: "Discreet Private Service",
    body: "A single named relationship manager. No call queues, no scripts. Direct line. Always.",
  },
  {
    icon: ScrollText,
    title: "Immutable Oversight",
    body: "Every movement is recorded against an immutable ledger and reconciled by an independent audit committee.",
  },
  {
    icon: Compass,
    title: "Executive Service",
    body: "Cross-jurisdiction coordination for clients with residences, holdings, and obligations on three continents.",
  },
];

export function TrustSection() {
  return (
    <section className="relative border-y border-border bg-background overflow-hidden">
      <MarketingBackdrop />
      <div className="container relative py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <div className="eyebrow flex items-center gap-3 mb-6">
              <span className="inline-block h-px w-8 bg-champagne-500/70" />
              <span>Trusted by principals worldwide</span>
            </div>
            <h2 className="font-display text-display-lg text-foreground text-balance">
              Quiet stewardship, <br />
              measured in decades.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty">
              Continental Bank serves principals, family offices, and institutional clients with a
              tradition of restraint, accuracy, and personal continuity. We do not publish names.
              We do not advertise. We are introduced.
            </p>

            <TrustBadgeRail
              preset="marketing"
              compact
              className="mt-8 max-w-xl lg:grid-cols-2 xl:grid-cols-2"
            />

            <dl className="mt-12 space-y-6 border-l border-border pl-6">
              <Number title="ø 11 years" body="Average client tenure" />
              <Number title="38 jurisdictions" body="Serviced today" />
              <Number title="< 0.02%" body="Annual operational variance" />
            </dl>
          </Reveal>

          <Stagger as="ul" className="grid gap-4 sm:grid-cols-2" step={0.07}>
            {pillars.map((p) => (
              <StaggerItem as="li" key={p.title} className="glass-light p-7 lg:p-9">
                <p.icon className="h-5 w-5 text-champagne-600" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground text-pretty">
                  {p.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Number({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-display text-xl font-medium tabular-figures text-foreground">{title}</dt>
      <dd className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
        {body}
      </dd>
    </div>
  );
}
