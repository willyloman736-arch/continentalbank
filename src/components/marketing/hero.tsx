import Link from "next/link";
import { ArrowUpRight, Lock, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/i18n/dictionaries";
import { detectLocale } from "@/lib/i18n/detect";
import { SITE } from "@/lib/constants";
import { HeroBackdrop } from "./hero-backdrop";
import { Stagger, StaggerItem } from "@/components/motion/primitives";

export async function Hero() {
  const t = getT(await detectLocale());

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden />
      <div className="container relative pt-24 pb-28 lg:pt-32 lg:pb-36">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Stagger className="max-w-2xl" variant="hero" step={0.07}>
            <StaggerItem>
              <div className="eyebrow flex items-center gap-3 mb-7">
                <span className="inline-block h-px w-8 bg-champagne-500/70" />
                <span>{t("hero.eyebrow")}</span>
              </div>
            </StaggerItem>

            <StaggerItem as="h1" className="font-display text-display-2xl text-foreground text-balance">
              A private bank for a few <br className="hidden md:block" />
              who require <span className="gold-underline">precision</span>.
            </StaggerItem>

            <StaggerItem as="p" className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {t("hero.subtitle")}
            </StaggerItem>

            <StaggerItem className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" variant="default" asChild>
                <Link href="/register">
                  {t("hero.cta_primary")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">{t("hero.cta_secondary")}</Link>
              </Button>
            </StaggerItem>

            <StaggerItem className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border/50">
              <Stat label="Est." value={String(SITE.estd)} />
              <Stat label="Jurisdictions" value="38" />
              <Stat label="Currencies" value="USD · EUR · GBP" small />
            </StaggerItem>
          </Stagger>

          <Stagger className="relative" step={0.08} amount={0.15}>
            <StaggerItem className="relative aspect-[4/5] w-full max-w-md ml-auto rounded-md border border-border bg-card shadow-soft-xl overflow-hidden">
              <HeroBackdrop />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-ivory-100">
                <div>
                  <div className="eyebrow text-champagne-400 mb-3">Statement · Private Client</div>
                  <div className="font-display text-2xl font-medium leading-tight">
                    Madame H. Bertrand
                  </div>
                  <div className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ivory-100/60">
                    CB · 4910 · 7282 · 0314
                  </div>
                </div>

                <div className="space-y-5">
                  <FigureLine label="USD Portfolio" value="$2,418,902.41" />
                  <FigureLine label="EUR Portfolio" value="€1,107,433.12" />
                  <FigureLine label="GBP Portfolio" value="£   864,720.55" />
                  <div className="hairline bg-ivory-100/10" />
                  <FigureLine
                    label="Total · Consolidated (USD eq.)"
                    value="$4,627,510.88"
                    accent
                  />
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-ivory-100/55">
                      Relationship
                    </div>
                    <div className="text-[13px] text-ivory-100/90">É. Dupont, Private Banker</div>
                  </div>
                  <svg viewBox="0 0 40 40" className="h-9 w-9 text-champagne-400" aria-hidden>
                    <path
                      d="M20 2 L37 7 V21 C37 30 30 35 20 37 C10 35 3 30 3 21 V7 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <text
                      x="20"
                      y="24"
                      textAnchor="middle"
                      fontFamily="Georgia, serif"
                      fontSize="11"
                      fill="currentColor"
                    >
                      CB
                    </text>
                  </svg>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="mt-6 flex flex-wrap justify-end gap-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Pill icon={<ShieldCheck className="h-3 w-3" />}>Encrypted at rest</Pill>
              <Pill icon={<Scale className="h-3 w-3" />}>Audited ledger</Pill>
              <Pill icon={<Lock className="h-3 w-3" />}>Approved access only</Pill>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-background p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1.5 font-display text-foreground tabular-figures " +
          (small ? "text-sm font-medium" : "text-2xl font-semibold")
        }
      >
        {value}
      </div>
    </div>
  );
}

function FigureLine({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ivory-100/55">{label}</span>
      <span
        className={
          "tabular-figures " +
          (accent ? "text-champagne-300 text-lg font-medium" : "text-ivory-100 text-base")
        }
      >
        {value}
      </span>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-border bg-card/50 px-2.5 py-1 rounded-full">
      <span className="text-champagne-700 dark:text-champagne-400">{icon}</span>
      {children}
    </span>
  );
}
