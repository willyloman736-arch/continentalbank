import type { Metadata } from "next";
import { requireApprovedClient } from "@/lib/auth";
import { detectLocale } from "@/lib/i18n/detect";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
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
      className="client-comfort relative min-h-screen bg-background text-foreground dark"
      data-frozen={isFrozen ? "true" : undefined}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #1A242E 0%, #151D26 46%, #10161D 100%)",
        }}
      />

      {isFrozen && (
        <FrozenOverlay
          frozenAt={user.profile.updated_at}
          reason={
            "Outbound activity, profile changes, and new instructions are paused pending compliance review."
          }
        />
      )}

      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar
          fullName={user.profile.full_name}
          email={user.email ?? ""}
          accountNumber={user.profile.account_number}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <DemoBanner />
          <DashboardTopbar
            fullName={user.profile.full_name}
            email={user.email ?? ""}
            accountNumber={user.profile.account_number}
            locale={locale}
          />
          <main className="flex-1 px-4 py-6 pb-12 sm:px-6 lg:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1480px]">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
