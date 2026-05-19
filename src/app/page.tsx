import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { TrustSection } from "@/components/marketing/trust-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { GlobalSection } from "@/components/marketing/global-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <TrustSection />
        <FeaturesSection />
        <GlobalSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
