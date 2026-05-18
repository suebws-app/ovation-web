"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Card } from "@ovation/ui/components/Card";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const RoleStep = () => {
  const t = useTranslations();

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-130">
        <Kicker className="text-primary mb-3">
          {t("signup__role__eyebrow")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__role__title")}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-5 tablet:grid-cols-2">
          <Link href={`${appRoutes.auth.signUpBook}?as=couple`} className="group block">
            <Card className="flex h-full cursor-pointer flex-col gap-4 rounded-3xl p-8 transition-shadow group-hover:shadow-lg">
              <p className="type-h3 font-semibold">
                {t("signup__role__couple_card__title")}
              </p>
              <p className="text-muted-foreground type-body-small leading-relaxed">
                {t("signup__role__couple_card__desc")}
              </p>
            </Card>
          </Link>

          <Link href={`${appRoutes.auth.signUpBook}?as=pro`} className="group block">
            <Card className="border-primary flex h-full cursor-pointer flex-col gap-4 rounded-3xl border-2 p-8 transition-shadow group-hover:shadow-lg">
              <p className="type-h3 font-semibold">
                {t("signup__role__pro_card__title")}
              </p>
              <p className="text-muted-foreground type-body-small leading-relaxed">
                {t("signup__role__pro_card__desc")}
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
