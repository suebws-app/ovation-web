import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { MailIcon } from "@/features/verify/components/MailIcon";
import { VerifyPageBodySkeleton } from "@/features/verify/skeletons/VerifyPageSkeleton";

export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="tablet:p-10 flex w-full max-w-110 flex-1 flex-col items-center justify-center p-4 text-center">
      <MailIcon />
      <AuthHeading
        eyebrow={t("auth__signup__eyebrow_step", {
          step: 2,
          label: t("auth__verify__step_label"),
        })}
        title={t("auth__verify__check_inbox")}
      />
      <VerifyPageBodySkeleton />
    </div>
  );
}
