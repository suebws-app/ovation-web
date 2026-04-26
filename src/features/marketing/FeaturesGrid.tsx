"use client";

import { useTranslations } from "next-intl";
import { Card } from "@ovation/ui/components/Card";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Lock } from "@ovation/icons/Lock";
import { FeaturesRitualBar } from "./FeaturesRitualBar";
import { FeaturesLanguagePill } from "./FeaturesLanguagePill";
import { FeaturesQrCard } from "./FeaturesQrCard";
import { FeaturesIntegrationPill } from "./FeaturesIntegrationPill";

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

export const FeaturesGrid = () => {
  const t = useTranslations();

  return (
    <section className="pt-10 pb-30">
      <div className="mx-auto max-w-310 px-6 lg:px-20">
        <div className="mb-12 flex flex-col items-center">
          <Eyebrow className="text-primary mb-4">
            {t("marketing__features__eyebrow")}
          </Eyebrow>
          <h2 className="type-display mx-auto max-w-205 text-center font-serif leading-tight font-semibold tracking-tight">
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
            <p className="type-h1 font-serif leading-tight font-semibold">
              {t("marketing__features__ritual_title")}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("marketing__features__ritual_body")}
            </p>
            <div className="mt-auto flex items-end gap-0.5">
              {RITUAL_BARS.map((i) => (
                <FeaturesRitualBar key={i} index={i} />
              ))}
            </div>
          </Card>

          <Card className="bg-destructive/10 flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-destructive mb-2">
              {t("marketing__features__lang_eyebrow")}
            </Eyebrow>
            <p className="type-h3 font-serif leading-tight font-semibold">
              {t("marketing__features__lang_title")}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => (
                <FeaturesLanguagePill key={lang} text={lang} />
              ))}
            </div>
          </Card>

          <Card className="bg-accent/15 flex flex-col overflow-hidden rounded-[22px] p-6">
            <Eyebrow className="text-accent mb-2">
              {t("marketing__features__book_eyebrow")}
            </Eyebrow>
            <p className="type-h3 font-serif leading-tight font-semibold">
              {t("marketing__features__book_title")}
            </p>
            <div className="mt-auto flex items-center gap-3">
              <div className="from-accent to-accent/70 flex h-20 w-15 items-center justify-center rounded-r-lg bg-linear-to-br shadow-md">
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
            <p className="type-h3 font-serif leading-tight font-semibold">
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
            <p className="type-h3 font-serif leading-tight font-semibold">
              {t("marketing__features__qr_title")}
            </p>
            <div className="mt-auto flex items-end gap-1">
              {QR_ROTATIONS.map((rotation, i) => (
                <FeaturesQrCard key={i} rotation={rotation} />
              ))}
            </div>
          </Card>

          <Card className="bg-primary/10 flex flex-col overflow-hidden rounded-[22px] p-6 md:col-span-2">
            <Eyebrow className="text-primary mb-2">
              {t("marketing__features__planner_eyebrow")}
            </Eyebrow>
            <p className="type-h2 mb-3 font-serif leading-tight font-semibold">
              {t("marketing__features__planner_title")}
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <FeaturesIntegrationPill key={name} name={name} />
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
