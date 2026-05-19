import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageTransition } from "@/components/motion/page-transition";
import type { Role } from "@/lib/constants";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <AdminTopbar
          fullName={user.profile.full_name}
          email={user.email ?? ""}
          role={user.profile.role as Role}
        />
        <main className="flex-1 px-4 py-8 lg:px-10 lg:py-12">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
