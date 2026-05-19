import Link from "next/link";
import { ArrowUpRight, Lock, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/i18n/dictionaries";
import { detectLocale } from "@/lib/i18n/detect";
import { SITE } from "@/lib/constants";
import { Vault } from "./vault";
import { MarketingBackdrop } from "./marketing-backdrop";
import { Stagger, StaggerItem } from "@/components/motion/primitives";

export async function Hero() {
  const t = getT(await detectLocale());

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden />
      <MarketingBackdrop />

      <div className="container relative pt-20 pb-20 lg:pt-28 lg:pb-28">
        {/* ---- Two-column layout: text left, vault right (stacks on mobile) ---- */}
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* ---- LEFT: text + CTAs ---- */}
          <Stagger className="max-w-2xl" variant="hero" step={0.07}>
            <StaggerItem>
              <div className="eyebrow inline-flex items-center gap-3 mb-6">
                <span className="inline-block h-px w-8 bg-champagne-500/70" />
                <span>{t("hero.eyebrow")}</span>
              </div>
            </StaggerItem>

            <StaggerItem
              as="h1"
              className="font-display text-display-2xl text-foreground text-balance"
            >
              A private bank for a few <br className="hidden md:block" />
              who require <span className="gold-underline">precision</span>.
            </StaggerItem>

            <StaggerItem
              as="p"
              className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty"
            >
              {t("hero.subtitle")}
            </StaggerItem>

            <StaggerItem className="mt-9 flex flex-col sm:flex-row gap-3">
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

            <StaggerItem className="mt-7 flex flex-wrap items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Pill icon={<ShieldCheck className="h-3 w-3" />}>Encrypted at rest</Pill>
              <Pill icon={<Scale className="h-3 w-3" />}>Audited ledger</Pill>
              <Pill icon={<Lock className="h-3 w-3" />}>Approved access only</Pill>
            </StaggerItem>
          </Stagger>

          {/* ---- RIGHT: the vault ---- */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="w-[min(460px,86vw)] lg:w-[min(520px,100%)] aspect-square">
              <Vault />
            </div>
          </div>
        </div>

        {/* ---- Stats strip (full-width, below both columns) ---- */}
        <div className="mx-auto mt-16 lg:mt-20 max-w-3xl">
          <div className="glass-light grid grid-cols-3">
            <Stat label="Established" value={String(SITE.estd)} />
            <Stat label="Jurisdictions" value="38" hasDivider />
            <Stat label="Currencies" value="USD · EUR · GBP" small hasDivider />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  small,
  hasDivider,
}: {
  label: string;
  value: string;
  small?: boolean;
  hasDivider?: boolean;
}) {
  return (
    <div
      className={
        "relative p-6 text-center " +
        (hasDivider ? "before:absolute before:left-0 before:top-3 before:bottom-3 before:w-px before:bg-foreground/10" : "")
      }
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div
        className={
          "mt-1.5 font-display text-foreground tabular-figures " +
          (small ? "text-base font-medium" : "text-2xl font-semibold")
        }
      >
        {value}
      </div>
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
