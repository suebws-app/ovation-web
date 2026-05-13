"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskPinInput } from "./KioskPinInput";
import type {
  KioskSettings,
  UpdateKioskSettingsInput,
} from "@/lib/api/types";

type KioskConfigLeftProps = {
  settings: KioskSettings;
  eventId: string | null;
  onPatch: (changes: UpdateKioskSettingsInput) => void;
};

export const KioskConfigLeft = ({
  settings,
  eventId,
  onPatch,
}: KioskConfigLeftProps) => {
  const t = useTranslations();
  const linkHref = eventId ? appRoutes.app.eventLink(eventId) : appRoutes.app.link;
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-16 border-border bg-card flex flex-col gap-2 border px-7 py-5">
        <div className="type-h3 font-semibold">
          {t("kiosk__config__link_redirect__title")}
        </div>
        <div className="type-caption text-muted-foreground">
          {t("kiosk__config__link_redirect__desc")}
        </div>
        <Link
          href={linkHref}
          className="text-primary type-body-small mt-1 font-semibold hover:underline"
        >
          {t("kiosk__config__link_redirect__cta")}
        </Link>
      </div>

      <KioskConfigCard
        title={t("kiosk__config__lockdown_section__title")}
        description={t("kiosk__config__lockdown_section__desc")}
      >
        <KioskConfigRow
          title={t("kiosk__config__lockdown__fullscreen__title")}
          description={t("kiosk__config__lockdown__fullscreen__desc")}
        >
          <KioskToggle
            on={settings.fullscreenLock}
            onChange={(fullscreenLock) => onPatch({ fullscreenLock })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__pin__title")}
          description={t("kiosk__config__lockdown__pin__desc")}
        >
          <KioskPinInput
            value={settings.exitPin}
            onChange={(exitPin) => onPatch({ exitPin })}
          />
        </KioskConfigRow>
        <KioskConfigRow
          title={t("kiosk__config__lockdown__airplane__title")}
          description={t("kiosk__config__lockdown__airplane__desc")}
          last
        >
          <KioskToggle
            on={settings.airplaneMode}
            onChange={(airplaneMode) => onPatch({ airplaneMode })}
          />
        </KioskConfigRow>
      </KioskConfigCard>
    </div>
  );
};
