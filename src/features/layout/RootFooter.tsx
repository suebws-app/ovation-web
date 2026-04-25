"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { cn } from "@ovation/ui/utils/cn";

const SocialIcon = ({ label }: { label: string }) => (
  <div className="border-border text-muted-foreground flex size-9 items-center justify-center rounded-full border text-xs font-bold">
    {label}
  </div>
);

const FooterLink = ({ link }: { link: string }) => (
  <a
    key={link}
    className="text-foreground hover:text-primary cursor-pointer text-sm"
  >
    {link}
  </a>
);

const FooterColumn = ({ col }: { col: { title: string; links: string[] } }) => (
  <div key={col.title}>
    <div className="text-muted-foreground mb-3.5 text-[11px] font-bold tracking-widest uppercase">
      {col.title}
    </div>
    <div className="flex flex-col gap-2.5">
      {col.links.map((link) => (
        <FooterLink key={link} link={link} />
      ))}
    </div>
  </div>
);

export const RootFooter = ({ className }: { className?: string }) => {
  const t = useTranslations();

  const columns = [
    {
      title: t("common__footer__product"),
      linkKeys: [
        "common__footer__product_links__how_it_works",
        "common__footer__product_links__gold_book",
        "common__footer__product_links__keepsakes_store",
        "common__footer__product_links__pricing",
        "common__footer__product_links__for_planners",
        "common__footer__product_links__changelog",
      ],
    },
    {
      title: t("common__footer__love_notes"),
      linkKeys: [
        "common__footer__love_notes_links__sample_book",
        "common__footer__love_notes_links__couple_stories",
        "common__footer__love_notes_links__write_a_review",
        "common__footer__love_notes_links__press",
        "common__footer__love_notes_links__podcast",
      ],
    },
    {
      title: t("common__footer__company"),
      linkKeys: [
        "common__footer__company_links__about",
        "common__footer__company_links__careers",
        "common__footer__company_links__sustainability",
        "common__footer__company_links__press_kit",
        "common__footer__company_links__contact",
      ],
    },
    {
      title: t("common__footer__legal"),
      linkKeys: [
        "common__footer__legal_links__privacy",
        "common__footer__legal_links__terms",
        "common__footer__legal_links__cookies",
        "common__footer__legal_links__gdpr",
        "common__footer__legal_links__dpa_for_planners",
      ],
    },
  ];

  return (
    <footer className={cn("border-border bg-card border-t", className)}>
      <div className="mx-auto max-w-[1240px] px-6 pt-16 pb-10 lg:px-20">
        <div className="grid grid-cols-2 gap-10 pb-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-muted-foreground max-w-[280px] text-sm leading-relaxed">
              {t("common__footer__tagline")}
            </p>
            <div className="mt-5 flex gap-2.5">
              {["IG", "TT", "YT", "PN"].map((label) => (
                <SocialIcon key={label} label={label} />
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <FooterColumn
              key={col.title}
              col={{
                title: col.title,
                links: col.linkKeys.map((key) => t(key)),
              }}
            />
          ))}
        </div>

        <div className="border-border text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs md:flex-row">
          <div>{t("common__footer__copyright")}</div>
          <div className="flex gap-5">
            <span>{t("common__footer__language")}</span>
            <span>{t("common__footer__currency")}</span>
            <span>{t("common__footer__status")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
