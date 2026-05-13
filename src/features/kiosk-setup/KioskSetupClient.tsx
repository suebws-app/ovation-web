"use client";

import type { KioskSettings, PublicEvent } from "@/lib/api/types";
import { KioskHero } from "./components/KioskHero";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskConfigGrid } from "./components/KioskConfigGrid";
import { KioskPreview } from "./components/KioskPreview";
import { KioskFooter } from "./components/KioskFooter";
import { useKioskSettings } from "./useKioskSettings";

type KioskSetupClientProps = {
  eventId: string;
  slug: string;
  settings: KioskSettings;
  publicEvent: PublicEvent | null;
};

export const KioskSetupClient = ({
  eventId,
  slug,
  settings: initialSettings,
  publicEvent,
}: KioskSetupClientProps) => {
  const { settings, patch, isSaving, error } = useKioskSettings(
    eventId,
    initialSettings,
  );

  const previewEvent =
    publicEvent && {
      ...publicEvent,
      welcomeMessage: settings.welcomeNote ?? publicEvent.welcomeMessage,
      defaultLanguage: settings.defaultLanguage,
      supportedLanguages: settings.supportedLanguages,
      kiosk: {
        ...publicEvent.kiosk,
        returnAfterSeconds: settings.returnAfterSeconds,
        welcomeShowPhoto: settings.welcomeShowPhoto,
        welcomeShowLanguagePicker: settings.welcomeShowLanguagePicker,
        welcomeChime: settings.welcomeChime,
        fullscreenLock: settings.fullscreenLock,
        guidedMode: settings.guidedMode,
        exitPin: settings.exitPin,
      },
    };

  return (
    <>
      <KioskHero slug={slug} />
      <KioskChecklist
        eventId={eventId}
        onTestClick={() => {
          if (typeof window !== "undefined") {
            window.open(`/kiosk/${slug}`, "_blank", "noopener");
          }
        }}
      />
      <KioskConfigGrid settings={settings} eventId={eventId} onPatch={patch} />
      <KioskPreview slug={slug} event={previewEvent} />
      <KioskFooter slug={slug} isSaving={isSaving} saveError={error} />
    </>
  );
};
