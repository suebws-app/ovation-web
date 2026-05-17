"use client";

import { useTranslations } from "next-intl";
import { BoxIcon } from "@ovation/icons/BoxIcon";

type ExportHeroCardProps = {
  onDownload: () => void;
  disabled?: boolean;
  loading?: boolean;
  eventLabel: string | null;
};

export const ExportHeroCard = ({
  onDownload,
  disabled,
  loading,
  eventLabel,
}: ExportHeroCardProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-20 from-primary to-primary/80 text-primary-foreground relative mt-8 overflow-hidden bg-gradient-to-br p-8">
      <div className="bg-destructive/30 absolute -top-10 -right-10 size-55 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] relative grid items-center gap-10">
        <div>
          <span className="type-overline text-primary-foreground/85">
            {t("settings__data__hero__eyebrow")}
          </span>
          <h3 className="type-h2 mt-2.5 leading-snug font-semibold">
            {t("settings__data__hero__title_a")}
            <br />
            <span className="italic">{t("settings__data__hero__title_b")}</span>
          </h3>
          <p className="type-body-small mt-3 max-w-md leading-relaxed opacity-85">
            {t("settings__data__hero__body")}
          </p>
          {eventLabel && (
            <p className="type-caption mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-semibold">
              {t("settings__data__hero__scope", { name: eventLabel })}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled || loading}
          className="bg-card type-body-small text-primary inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3.5 font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <BoxIcon width={16} height={16} />
          {loading ? t("common__loading") : t("settings__data__hero__cta")}
        </button>
      </div>
    </div>
  );
};
