"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "@ovation/icons/ChevronDown";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";

export const KioskConfigLeft = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title={t("kiosk__config__what_section__title")}
        description={t("kiosk__config__what_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__what__audio__title")}
          description={t("kiosk__config__what__audio__desc")}
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__what__photo__title")}
          description={t("kiosk__config__what__photo__desc")}
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__what__video__title")}
          description={t("kiosk__config__what__video__desc")}
          last
        >
          <KioskToggle on={false} />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__time_section__title")}
        description={t("kiosk__config__time_section__desc")}
      >
        <div className="py-5">
          <div className="flex items-baseline justify-between">
            <span className="type-body-small font-semibold">
              {t("kiosk__config__time__max_label")}
            </span>
            <span className="type-body-small text-muted-foreground">
              {t.rich("kiosk__config__time__max_value", {
                strong: (chunks) => (
                  <strong className="text-foreground">{chunks}</strong>
                ),
              })}
            </span>
          </div>
          <div className="bg-border relative mt-3.5 h-1.5 rounded-full">
            <div className="bg-primary absolute inset-y-0 left-0 w-[45%] rounded-full" />
            <div
              className="border-primary bg-card absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 shadow-sm"
              style={{ left: "calc(45% - 10px)" }}
            />
          </div>
          <div className="type-caption text-muted-foreground mt-2 flex justify-between">
            <span>15s</span>
            <span>30s</span>
            <span>60s</span>
            <span>90s</span>
            <span>2m</span>
            <span>3m</span>
          </div>
        </div>
        <KioskConfigRow
          title={t("kiosk__config__time__return__title")}
          description={t("kiosk__config__time__return__desc")}
          last
        >
          <span className="border-border bg-card type-body-small inline-flex items-center gap-2 rounded-full border px-3.5 py-2">
            {t("kiosk__config__time__return__value")}
            <ChevronDown
              width={12}
              height={12}
              className="text-muted-foreground"
            />
          </span>
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__lockdown_section__title")}
        description={t("kiosk__config__lockdown_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__lockdown__fullscreen__title")}
          description={t("kiosk__config__lockdown__fullscreen__desc")}
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__guided__title")}
          description={t("kiosk__config__lockdown__guided__desc")}
        >
          <button
            type="button"
            className="border-border bg-card type-caption cursor-pointer rounded-full border px-3 py-2 font-semibold"
          >
            {t("kiosk__config__lockdown__guided__cta")}
          </button>
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__pin__title")}
          description={t("kiosk__config__lockdown__pin__desc")}
        >
          <span className="border-border bg-card type-body-small rounded-full border px-3.5 py-2 font-mono tracking-widest">
            &bull; &bull; &bull; &bull;
          </span>
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__airplane__title")}
          description={t("kiosk__config__lockdown__airplane__desc")}
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
