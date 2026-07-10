import { useTranslations } from "next-intl";
import { appRoutes } from "@/lib/routes";
import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { RoleCard } from "./components/RoleCard";

const ROLES = [
  {
    id: 1,
    title: "signup__role__couple_card__title",
    description: "signup__role__couple_card__desc_v2",
    href: `${appRoutes.create.root}?as=couple`,
  },
  {
    id: 2,
    title: "signup__role__pro_card__title",
    description: "signup__role__pro_card__desc",
    href: `${appRoutes.create.root}?as=pro`,
  },
];

export const RolePage = () => {
  const t = useTranslations();

  return (
    <AuthScreen className="max-w-130">
      <AuthHeading
        eyebrow={t("signup__role__eyebrow")}
        title={t("signup__role__title")}
      />

      <div className="tablet:grid-cols-2 tablet:mt-10 tablet:gap-5 mt-5 grid grid-cols-1 gap-3">
        {ROLES.map((role) => (
          <RoleCard key={role.id} {...role} />
        ))}
      </div>
    </AuthScreen>
  );
};
