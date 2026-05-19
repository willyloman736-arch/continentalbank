import { requireApprovedClient } from "@/lib/auth";
import { detectLocale } from "@/lib/i18n/detect";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { DemoBanner } from "@/components/shared/demo-banner";
import { PageTransition } from "@/components/motion/page-transition";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireApprovedClient();
  const locale = await detectLocale();

  return (
    <div className="min-h-screen bg-background lg:flex">
      <DashboardSidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <DemoBanner />
        <DashboardTopbar
          fullName={user.profile.full_name}
          email={user.email ?? ""}
          accountNumber={user.profile.account_number}
          locale={locale}
        />
        <main className="flex-1 px-4 py-8 lg:px-10 lg:py-12">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
