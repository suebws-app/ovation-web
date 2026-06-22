import { getTranslations } from "next-intl/server";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { RolePageCardsSkeleton } from "@/features/role/skeletons/RolePageSkeleton";

export default async function Loading() {
  const t = await getTranslations();
  return (
    <div className="tablet:p-10 flex w-full max-w-130 flex-1 flex-col justify-center p-4">
      <AuthHeading
        eyebrow={t("signup__role__eyebrow")}
        title={t("signup__role__title")}
      />
      <RolePageCardsSkeleton />
    </div>
  );
}
