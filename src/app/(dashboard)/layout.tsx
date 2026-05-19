import { requireApprovedClient } from "@/lib/auth";
import { detectLocale } from "@/lib/i18n/detect";
import { AmbientBackdrop } from "@/components/shared/ambient-backdrop";
import { TopPill } from "@/components/dashboard/top-pill";
import { BottomPill } from "@/components/dashboard/bottom-pill";
import { DemoBanner } from "@/components/shared/demo-banner";
import { PageTransition } from "@/components/motion/page-transition";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireApprovedClient();
  const locale = await detectLocale();

  return (
    <div className="relative min-h-screen text-foreground dark">
      <AmbientBackdrop variant="navy" />
      <DemoBanner />
      <TopPill
        fullName={user.profile.full_name}
        email={user.email ?? ""}
        accountNumber={user.profile.account_number}
        locale={locale}
        variant="client"
      />
      <main className="px-4 lg:px-10 pt-8 lg:pt-12 pb-36">
        <div className="mx-auto max-w-7xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <BottomPill variant="client" />
    </div>
  );
}
