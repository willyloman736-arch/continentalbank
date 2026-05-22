import type { Metadata } from "next";
import { requireApprovedClient } from "@/lib/auth";
import { detectLocale } from "@/lib/i18n/detect";
import { AmbientBackdrop } from "@/components/shared/ambient-backdrop";
import { TopPill } from "@/components/dashboard/top-pill";
import { BottomPill } from "@/components/dashboard/bottom-pill";
import { DemoBanner } from "@/components/shared/demo-banner";
import { FrozenOverlay } from "@/components/dashboard/frozen-overlay";
import { PageTransition } from "@/components/motion/page-transition";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Client Dashboard",
    template: "%s · Client Dashboard",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireApprovedClient();
  const locale = await detectLocale();
  const isFrozen = user.profile.account_status === "suspended";

  return (
    <div
      className="relative min-h-screen text-foreground dark"
      data-frozen={isFrozen ? "true" : undefined}
    >
      <AmbientBackdrop variant="navy" />
      <DemoBanner />

      {isFrozen && (
        <FrozenOverlay
          frozenAt={user.profile.updated_at}
          reason={
            "Outbound activity, profile changes, and new instructions are paused pending compliance review."
          }
        />
      )}

      <TopPill
        fullName={user.profile.full_name}
        email={user.email ?? ""}
        accountNumber={user.profile.account_number}
        locale={locale}
        variant="client"
      />
      <main className="px-3 sm:px-6 lg:px-10 pt-6 sm:pt-8 lg:pt-12 pb-28 sm:pb-32 lg:pb-36">
        <div className="mx-auto max-w-7xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <BottomPill variant="client" />
    </div>
  );
}
