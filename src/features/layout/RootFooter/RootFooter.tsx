"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { cn } from "@ovation/ui/utils/cn";
import { appRoutes } from "@/lib/routes";
import { FooterColumn } from "./FooterColumn";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

type RootFooterProps = {
  className?: string;
};

export const RootFooter = ({ className }: RootFooterProps) => {
  const t = useTranslations();

  const columns = [
    {
      title: t("common__footer__product"),
      links: [
        {
          label: t("common__footer__product_links__how_it_works"),
          href: appRoutes.marketing.howItWorks,
        },
        {
          label: t("common__footer__product_links__gold_book"),
          href: appRoutes.marketing.goldBook,
        },
        {
          label: t("common__footer__product_links__keepsakes_store"),
          href: appRoutes.marketing.keepsakes,
        },
        {
          label: t("common__footer__product_links__pricing"),
          href: appRoutes.marketing.pricing,
        },
        {
          label: t("common__footer__product_links__for_planners"),
          href: appRoutes.marketing.forPlanners,
        },
        {
          label: t("common__footer__product_links__changelog"),
          href: appRoutes.marketing.changelog,
        },
        {
          label: t("common__footer__product_links__sample_book"),
          href: appRoutes.marketing.sample,
        },
      ],
    },
    {
      title: t("common__footer__company"),
      links: [
        {
          label: t("common__footer__company_links__about"),
          href: appRoutes.marketing.about,
        },
        {
          label: t("common__footer__company_links__careers"),
          href: appRoutes.marketing.careers,
        },
        {
          label: t("common__footer__company_links__sustainability"),
          href: appRoutes.marketing.sustainability,
        },
        {
          label: t("common__footer__company_links__contact"),
          href: appRoutes.marketing.contact,
        },
      ],
    },
    {
      title: t("common__footer__legal"),
      links: [
        {
          label: t("common__footer__legal_links__terms"),
          href: appRoutes.legal.terms,
        },
        {
          label: t("common__footer__legal_links__refunds"),
          href: appRoutes.legal.refunds,
        },
        {
          label: t("common__footer__legal_links__privacy"),
          href: appRoutes.legal.privacy,
        },
        {
          label: t("common__footer__legal_links__cookies"),
          href: appRoutes.legal.cookies,
        },
      ],
    },
  ];

  return (
    <footer className={cn("border-border bg-card border-t", className)}>
      <div className="mx-auto max-w-310 px-6 pt-16 pb-10 lg:px-20">
        <div className="grid grid-cols-2 gap-10 pb-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href={appRoutes.home}>
              <Logo />
            </Link>
            <p className="text-muted-foreground max-w-70 text-sm leading-relaxed">
              {t("common__footer__tagline")}
            </p>
          </div>

          {columns.map((col) => (
            <FooterColumn key={col.title} col={col} />
          ))}
        </div>

        <div className="border-border text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs md:flex-row">
          <div className="flex flex-col gap-1.5">
            <div>{t("common__footer__seller_disclosure")}</div>
            <div>{t("common__footer__copyright")}</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};
