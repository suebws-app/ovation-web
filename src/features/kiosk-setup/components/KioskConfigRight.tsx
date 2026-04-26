"use client";

import { useTranslations } from "next-intl";
import { Plus } from "@ovation/icons/Plus";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskLanguageChip } from "./KioskLanguageChip";

const WELCOME_MAX = 180;

export const KioskConfigRight = () => {
  const t = useTranslations();
  const placeholder = t("kiosk__config__welcome__note_placeholder");

  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title={t("kiosk__config__welcome_section__title")}
        description={t("kiosk__config__welcome_section__desc")}
      >
        <div className="border-border border-b py-5">
          <div className="type-caption text-muted-foreground mb-2 font-semibold">
            {t("kiosk__config__welcome__note_label")}
          </div>
          <div className="rounded-12 border-border bg-card type-body-small min-h-24 border p-3.5 leading-relaxed">
            {placeholder}
            <span className="type-caption text-muted-foreground float-right">
              {t("kiosk__config__welcome__counter", {
                count: placeholder.length,
                max: WELCOME_MAX,
              })}
            </span>
          </div>
        </div>
        <KioskConfigRow
          title={t("kiosk__config__welcome__photo__title")}
          description={t("kiosk__config__welcome__photo__desc")}
        >
          <KioskToggle on={false} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__welcome__lang_picker__title")}
          description={t("kiosk__config__welcome__lang_picker__desc")}
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__welcome__chime__title")}
          description={t("kiosk__config__welcome__chime__desc")}
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__languages_section__title")}
        description={t("kiosk__config__languages_section__desc")}
      >
        <div className="flex flex-wrap gap-2 py-5">
          <KioskLanguageChip
            flag="\uD83C\uDDF5\uD83C\uDDF9"
            label="Português"
            isMain
          />
          <KioskLanguageChip
            flag="\uD83C\uDDEC\uD83C\uDDE7"
            label={t("language__en")}
          />
          <KioskLanguageChip
            flag="\uD83C\uDDEA\uD83C\uDDF8"
            label={t("language__es")}
          />
          <KioskLanguageChip
            flag="\uD83C\uDDEB\uD83C\uDDF7"
            label={t("language__fr")}
          />
          <button
            type="button"
            className="border-border type-caption text-muted-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed px-3 py-2 font-semibold"
          >
            <Plus width={12} height={12} />
            {t("kiosk__config__languages__add")}
          </button>
        </div>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__offline_section__title")}
        description={t("kiosk__config__offline_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__offline__store__title")}
          description={t("kiosk__config__offline__store__desc")}
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__offline__storage__title")}
          description={t("kiosk__config__offline__storage__desc")}
        >
          <span className="border-border bg-card type-body-small rounded-full border px-3.5 py-2">
            {t("kiosk__config__offline__storage__value")}
          </span>
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__offline__notify__title")}
          description={t("kiosk__config__offline__notify__desc")}
          last
        >
          <KioskToggle on={true} />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
