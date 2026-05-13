"use client";

import { useTranslations } from "next-intl";
import { KioskConfigCard } from "@/features/kiosk-setup/components/KioskConfigCard";
import { KioskStepSlider } from "@/features/kiosk-setup/components/KioskStepSlider";
import {
  LINK_MAX_DURATION_OPTIONS,
  type LinkMaxDurationSeconds,
  type LinkSettings,
  type UpdateLinkSettingsInput,
} from "@/lib/api/types";

const MAX_DURATION_LABELS = ["15s", "30s", "60s", "90s", "2m", "3m"] as const;

const readoutFor = (seconds: number): string => {
  const index = LINK_MAX_DURATION_OPTIONS.indexOf(
    seconds as LinkMaxDurationSeconds,
  );
  if (index >= 0) return MAX_DURATION_LABELS[index];
  return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
};

type LinkMaxDurationCardProps = {
  settings: LinkSettings;
  onPatch: (changes: UpdateLinkSettingsInput) => void;
};

export const LinkMaxDurationCard = ({
  settings,
  onPatch,
}: LinkMaxDurationCardProps) => {
  const t = useTranslations();
  return (
    <KioskConfigCard
      title={t("link_settings__duration__title")}
      description={t("link_settings__duration__desc")}
    >
      <div className="py-5">
        <div className="flex items-baseline justify-between">
          <span className="type-body-small font-semibold">
            {t("kiosk__config__time__max_label")}
          </span>
          <span className="type-body-small text-foreground font-semibold">
            {readoutFor(settings.maxDurationSeconds)}
          </span>
        </div>
        <KioskStepSlider<LinkMaxDurationSeconds>
          value={settings.maxDurationSeconds as LinkMaxDurationSeconds}
          steps={LINK_MAX_DURATION_OPTIONS}
          labels={MAX_DURATION_LABELS}
          onChange={(maxDurationSeconds) => onPatch({ maxDurationSeconds })}
        />
      </div>
    </KioskConfigCard>
  );
};
