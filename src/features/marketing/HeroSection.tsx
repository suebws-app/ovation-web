"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { HeroShowpiece } from "./HeroShowpiece";
import { HeroAvatarCircle } from "./HeroAvatarCircle";

const AVATARS = [
  { initials: "L", bg: "bg-primary" },
  { initials: "M", bg: "bg-destructive" },
  { initials: "J", bg: "bg-accent" },
  { initials: "A", bg: "bg-secondary" },
];

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="bg-primary/20 pointer-events-none absolute -top-40 -left-40 h-150 w-150 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-destructive/15 pointer-events-none absolute -right-20 -bottom-40 h-125 w-125 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-310 grid-cols-1 items-center gap-15 px-6 lg:grid-cols-[1.15fr_1fr] lg:px-20">
        <div className="flex flex-col gap-8">
          <div className="border-border bg-background inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 shadow-sm">
            <span
              className="bg-secondary h-2 w-2 rounded-full"
              aria-hidden="true"
            />
            <span className="text-foreground text-sm font-medium">
              {t("marketing__hero__badge", { count: "2,840", countries: "34" })}
            </span>
          </div>

          <h1 className="lg:type-display font-serif text-7xl leading-none font-semibold tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__hero__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__hero__title_line2")}
            </span>
          </h1>

          <p className="text-muted-foreground type-body-large max-w-130 leading-relaxed">
            {t("marketing__hero__description")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.signUp}>
                {t("marketing__hero__cta_primary")}
                <ArrowRight width={18} height={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={appRoutes.marketing.sample}>
                {t("marketing__hero__cta_secondary")}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex">
              {AVATARS.map((a, i) => (
                <HeroAvatarCircle
                  key={a.initials}
                  initials={a.initials}
                  bg={a.bg}
                  overlap={i > 0}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              {t("marketing__hero__social_proof", { rating: "4.9" })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <HeroShowpiece />
        </div>
      </div>
    </section>
  );
};
