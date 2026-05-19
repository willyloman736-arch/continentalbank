import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { requireApprovedClient } from "@/lib/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireApprovedClient();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Profile"
        title="Personal details on file."
        description="Update the information your relationship manager uses to reach you and to format your reporting."
      />

      <div className="glass-card p-6 lg:p-8 max-w-3xl">
        <ProfileForm
          initial={{
            fullName: user.profile.full_name,
            phone: user.profile.phone ?? "",
            country: user.profile.country ?? "US",
            preferredLanguage: user.profile.preferred_language,
            preferredCurrency: user.profile.preferred_currency,
            email: user.email ?? "",
          }}
        />
      </div>
    </div>
  );
}
