"use client";

import { useTranslations } from "next-intl";
import { KioskConfigCard } from "@/features/kiosk-setup/components/KioskConfigCard";
import { KioskConfigRow } from "@/features/kiosk-setup/components/KioskConfigRow";
import { KioskToggle } from "@/features/kiosk-setup/components/KioskToggle";
import type { LinkSettings, UpdateLinkSettingsInput } from "@/lib/api/types";

type LinkSubmissionTypesCardProps = {
  settings: LinkSettings;
  onPatch: (changes: UpdateLinkSettingsInput) => void;
};

export const LinkSubmissionTypesCard = ({
  settings,
  onPatch,
}: LinkSubmissionTypesCardProps) => {
  const t = useTranslations();
  return (
    <KioskConfigCard
      title={t("link_settings__types__title")}
      description={t("link_settings__types__desc")}
    >
      <KioskConfigRow
        title={t("kiosk__config__what__audio__title")}
        description={t("kiosk__config__what__audio__desc")}
      >
        <KioskToggle
          on={settings.captureAudio}
          onChange={(captureAudio) => onPatch({ captureAudio })}
        />
      </KioskConfigRow>
      <KioskConfigRow
        title={t("kiosk__config__what__photo__title")}
        description={t("kiosk__config__what__photo__desc")}
      >
        <KioskToggle
          on={settings.capturePhoto}
          onChange={(capturePhoto) => onPatch({ capturePhoto })}
        />
      </KioskConfigRow>
      <KioskConfigRow
        title={t("kiosk__config__what__video__title")}
        description={t("kiosk__config__what__video__desc")}
        last
      >
        <KioskToggle
          on={settings.captureVideo}
          onChange={(captureVideo) => onPatch({ captureVideo })}
        />
      </KioskConfigRow>
    </KioskConfigCard>
  );
};
