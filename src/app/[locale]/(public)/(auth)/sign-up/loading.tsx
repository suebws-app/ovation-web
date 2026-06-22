import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { SignUpFormBodySkeleton } from "@/features/sign-up/skeletons/SignUpFormSkeleton";

export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="tablet:p-10 flex w-full max-w-110 flex-1 flex-col justify-center p-4">
      <AuthHeading
        eyebrow={t("auth__signup__create_account__label")}
        title={t("auth__signup__create_account__title")}
        titleEmphasis={t("auth__signup__create_account__title_emphasis")}
      />
      <SignUpFormBodySkeleton />
    </div>
  );
}
