import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { appRoutes } from "@/lib/routes";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { WizardContainer } from "@/features/create/components/WizardContainer";
import { RoleCard } from "./components/RoleCard";

const ROLES = [
  {
    id: 1,
    title: "signup__role__host_card__title",
    description: "signup__role__host_card__desc",
    href: `${appRoutes.create.details}?as=host`,
  },
  {
    id: 2,
    title: "signup__role__pro_card__title",
    description: "signup__role__pro_card__desc",
    href: `${appRoutes.create.details}?as=pro`,
  },
];

/**
 * Step 2 of the create wizard: who's setting this up. Worded generically for
 * any event type ("Planning my own event" / "I'm an event professional").
 */
export const RolePage = () => {
  const t = useTranslations();

  return (
    <WizardContainer>
      <Kicker className="text-primary">
        {t("auth__signup__eyebrow_step", {
          step: 2,
          label: t("signup__role__step_label"),
        })}
      </Kicker>
      <AuthHeading
        eyebrow={t("signup__role__eyebrow")}
        title={t("signup__role__title")}
      />

      <div className="tablet:grid-cols-2 tablet:gap-5 grid grid-cols-1 gap-3">
        {ROLES.map((role) => (
          <RoleCard key={role.id} {...role} />
        ))}
      </div>
    </WizardContainer>
  );
};
