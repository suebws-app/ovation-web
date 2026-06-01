import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Card } from "@ovation/ui/components/Card";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const ROLES = [
  {
    id: 1,
    title: "signup__role__couple_card__title",
    description: "signup__role__couple_card__desc",
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
    <div className="desktop:min-h-[calc(100vh-89px)] desktop:h-auto desktop:overflow-visible desktop:py-16 flex h-[calc(100svh-89px)] items-center justify-center overflow-hidden px-5 py-6">
      <div className="w-full max-w-130">
        <Kicker className="text-primary tablet:mb-3 mb-2">
          {t("signup__role__eyebrow")}
        </Kicker>
        <h1 className="type-h2 tablet:type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__role__title")}
        </h1>

        <div className="tablet:grid-cols-2 tablet:mt-10 tablet:gap-5 mt-5 grid grid-cols-1 gap-3">
          {ROLES.map((role) => (
            <Link key={role.id} href={role.href} className="group block">
              <Card className="tablet:gap-4 tablet:p-8 flex h-full cursor-pointer flex-col gap-2 rounded-3xl p-5 transition-shadow group-hover:shadow-lg">
                <p className="type-h4 tablet:type-h3 font-semibold">
                  {t(role.title)}
                </p>
                <p className="text-muted-foreground type-body-small leading-relaxed">
                  {t(role.description)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
