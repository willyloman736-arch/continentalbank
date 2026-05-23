import { PageHeader } from "@/components/dashboard/page-header";
import { KycVerificationForm } from "@/components/dashboard/kyc-verification-form";
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-6 lg:p-8">
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

        <div className="glass-card p-6 lg:p-8">
          <KycVerificationForm
            initial={{
              kyc_status: user.profile.kyc_status ?? "not_submitted",
              kyc_method: user.profile.kyc_method ?? null,
              kyc_document_name: user.profile.kyc_document_name ?? null,
              kyc_submitted_at: user.profile.kyc_submitted_at ?? null,
              kyc_reviewed_at: user.profile.kyc_reviewed_at ?? null,
              kyc_review_note: user.profile.kyc_review_note ?? null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
