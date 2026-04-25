"use client";

import { useTranslations } from "next-intl";
import { Card } from "@ovation/ui/components/Card";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Lock } from "@ovation/icons/Lock";
import { cn } from "@ovation/ui/utils/cn";

const GOLD_BOOK_PRICE = "€189";

const LANGUAGES = [
  "Español",
  "Français",
  "Nederlands",
  "Deutsch",
  "Italiano",
  "Português",
  "עברית",
  "日本語",
  "中文",
];

const INTEGRATIONS = ["Zola", "WeddingWire", "The Knot", "Joy", "Planners.io"];

const RITUAL_BARS = Array.from({ length: 30 }, (_, i) => i);

const QR_ROTATIONS = [
  "rotate-[-8deg]",
  "rotate-[-4deg]",
  "rotate-[0deg]",
  "rotate-[4deg]",
];

const RitualBar = ({ index }: { index: number }) => (
  <div
    className={cn(
      "w-3.5 rounded-sm",
      index < 12 ? "bg-primary h-[30px]" : "bg-foreground/10 h-[22px]",
    )}
  />
);

const LanguagePill = ({ text }: { text: string }) => (
  <span className="border-border bg-card rounded-full border px-2.5 py-1.5 text-[11px] font-medium">
    {text}
  </span>
);

const QrCard = ({ rotation }: { rotation: string }) => (
  <div
    className={cn(
      "border-border bg-card h-[54px] w-[38px] rounded border",
      rotation,
    )}
  />
);

const IntegrationPill = ({ name }: { name: string }) => (
  <span className="border-border bg-card rounded-xl border px-3 py-2 text-xs font-medium">
    {name}
  </span>
);

export const FeaturesGrid = () => {
  const t = useTranslations();

  return (
    <section className="pt-10 pb-[120px]">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-20">
        <div className="mb-12 flex flex-col items-center">
          <Eyebrow className="text-primary mb-4">
            {t("marketing__features__eyebrow")}
          </Eyebrow>
          <h2 className="mx-auto max-w-[820px] text-center font-serif text-[60px] leading-tight font-semibold tracking-tight">
            {t("marketing__features__title_line1")}{" "}
            <span className="text-primary italic">
              {t("marketing__features__title_line2")}
            </span>
          </h2>
        </div>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-4.5 md:grid-cols-4">
          <Card className="flex flex-col overflow-hidden rounded-[22px] p-6 md:col-span-2">
            <Eyebrow className="text-muted-foreground mb-2">
              {t("marketing__features__ritual_eyebrow")}
            </Eyebrow>
            <p className="font-serif text-[30px] leading-tight font-semibold">
              {t("marketing__features__ritual_title")}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("marketing__features__ritual_body")}
            </p>
            <div className="mt-auto flex items-end gap-0.5">
              {RITUAL_BARS.map((i) => (
                <RitualBar key={i} index={i} />
              ))}
            </div>
          </Card>

          <Card className="bg-destructive/10 flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-destructive mb-2">
              {t("marketing__features__lang_eyebrow")}
            </Eyebrow>
            <p className="font-serif text-[22px] leading-tight font-semibold">
              {t("marketing__features__lang_title")}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <LanguagePill key={lang} text={lang} />
              ))}
            </div>
          </Card>

          <Card className="bg-accent/15 flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-accent mb-2">
              {t("marketing__features__book_eyebrow")}
            </Eyebrow>
            <p className="font-serif text-[22px] leading-tight font-semibold">
              {t("marketing__features__book_title")}
            </p>
            <div className="mt-auto flex items-center gap-3">
              <div className="from-accent to-accent/70 flex h-[80px] w-[60px] items-center justify-center rounded-r-lg bg-gradient-to-br shadow-md">
                <span className="text-primary-foreground font-serif text-2xl font-bold">
                  O
                </span>
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {t("marketing__features__book_price", {
                    price: GOLD_BOOK_PRICE,
                  })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {t("marketing__features__book_shipping")}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary/15 flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-secondary mb-2">
              {t("marketing__features__privacy_eyebrow")}
            </Eyebrow>
            <p className="font-serif text-[22px] leading-tight font-semibold">
              {t("marketing__features__privacy_title")}
            </p>
            <div className="text-muted-foreground mt-auto flex items-center gap-2 text-xs">
              <Lock className="size-3.5 shrink-0" />
              <span>{t("marketing__features__privacy_detail")}</span>
            </div>
          </Card>

          <Card className="flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-muted-foreground mb-2">
              {t("marketing__features__qr_eyebrow")}
            </Eyebrow>
            <p className="font-serif text-[22px] leading-tight font-semibold">
              {t("marketing__features__qr_title")}
            </p>
            <div className="mt-auto flex items-end gap-1">
              {QR_ROTATIONS.map((rotation, i) => (
                <QrCard key={i} rotation={rotation} />
              ))}
            </div>
          </Card>

          <Card className="bg-primary/10 flex flex-col overflow-hidden rounded-[22px] p-6 md:col-span-2">
            <Eyebrow className="text-primary mb-2">
              {t("marketing__features__planner_eyebrow")}
            </Eyebrow>
            <p className="mb-3 font-serif text-[26px] leading-tight font-semibold">
              {t("marketing__features__planner_title")}
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <IntegrationPill key={name} name={name} />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              {t("marketing__features__planner_body")}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
