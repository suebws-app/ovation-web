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

const MAX_DURATION_LABELS = ["15s", "30s", "45s", "1m"] as const;

const readoutFor = (seconds: number): string => {
  const index = LINK_MAX_DURATION_OPTIONS.indexOf(
    seconds as LinkMaxDurationSeconds,
  );
  if (index >= 0) return MAX_DURATION_LABELS[index];
  return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
};

type LinkAudioDurationCardProps = {
  settings: LinkSettings;
  onPatch: (changes: UpdateLinkSettingsInput) => void;
};

export const LinkAudioDurationCard = ({
  settings,
  onPatch,
}: LinkAudioDurationCardProps) => {
  const t = useTranslations();
  return (
    <KioskConfigCard
      title={t("link_settings__audio_duration__title")}
      description={t("link_settings__audio_duration__desc")}
    >
      <div className="py-5">
        <div className="flex items-baseline justify-between">
          <span className="type-body-small font-semibold">
            {t("kiosk__config__time__max_label")}
          </span>
          <span className="type-body-small text-foreground font-semibold">
            {readoutFor(settings.maxAudioDurationSeconds)}
          </span>
        </div>
        <KioskStepSlider<LinkMaxDurationSeconds>
          value={settings.maxAudioDurationSeconds as LinkMaxDurationSeconds}
          steps={LINK_MAX_DURATION_OPTIONS}
          labels={MAX_DURATION_LABELS}
          onChange={(maxAudioDurationSeconds) =>
            onPatch({ maxAudioDurationSeconds })
          }
        />
      </div>
    </KioskConfigCard>
  );
};
