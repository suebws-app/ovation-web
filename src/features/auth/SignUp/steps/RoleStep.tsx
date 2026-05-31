"use client";

import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Card } from "@ovation/ui/components/Card";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const RoleStep = () => {
  const t = useTranslations();

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-130">
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 1,
            label: t("signup__role__eyebrow"),
          })}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__role__title")}
        </h1>

        <div className="tablet:grid-cols-2 mt-10 grid grid-cols-1 gap-5">
          <Link
            href={`${appRoutes.auth.signUpBook}?as=couple`}
            className="group block"
          >
            <Card className="flex h-full cursor-pointer flex-col gap-4 rounded-3xl p-8 transition-shadow group-hover:shadow-lg">
              <span className="text-4xl">💍</span>
              <p className="type-h3 font-semibold">
                {t("signup__role__couple_card__title")}
              </p>
              <p className="text-muted-foreground type-body-small leading-relaxed">
                {t("signup__role__couple_card__desc")}
              </p>
              <ArrowRightIcon
                width={20}
                height={20}
                className="text-primary mt-auto self-end transition-transform group-hover:translate-x-1"
              />
            </Card>
          </Link>

          <Link
            href={`${appRoutes.auth.signUpBook}?as=pro`}
            className="group block"
          >
            <Card className="flex h-full cursor-pointer flex-col gap-4 rounded-3xl p-8 transition-shadow group-hover:shadow-lg">
              <span className="text-4xl">📸</span>
              <p className="type-h3 font-semibold">
                {t("signup__role__pro_card__title")}
              </p>
              <p className="text-muted-foreground type-body-small leading-relaxed">
                {t("signup__role__pro_card__desc")}
              </p>
              <ArrowRightIcon
                width={20}
                height={20}
                className="text-primary mt-auto self-end transition-transform group-hover:translate-x-1"
              />
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
