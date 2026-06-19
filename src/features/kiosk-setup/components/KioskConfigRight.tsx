"use client";

import { useTranslations } from "next-intl";
import { KioskConfigCard } from "./KioskConfigCard";
import { KioskConfigRow } from "./KioskConfigRow";
import { KioskToggle } from "./KioskToggle";
import { KioskWelcomeNote } from "./KioskWelcomeNote";
import { KioskLanguagesSelect } from "./KioskLanguagesSelect";
import type { KioskSettings, UpdateKioskSettingsInput } from "@/lib/api/types";

type KioskConfigRightProps = {
  settings: KioskSettings;
  onPatch: (changes: UpdateKioskSettingsInput) => void;
};

export const KioskConfigRight = ({
  settings,
  onPatch,
}: KioskConfigRightProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-5">
      <KioskConfigCard
        title={t("kiosk__config__welcome_section__title")}
        description={t("kiosk__config__welcome_section__desc")}
      >
        <KioskWelcomeNote
          value={settings.welcomeNote ?? ""}
          onChange={(welcomeNote) =>
            onPatch({
              welcomeNote: welcomeNote.length === 0 ? null : welcomeNote,
            })
          }
        />
        <KioskConfigRow
          title={t("kiosk__config__welcome__lang_picker__title")}
          description={t("kiosk__config__welcome__lang_picker__desc")}
          last
        >
          <KioskToggle
            on={settings.welcomeShowLanguagePicker}
            onChange={(welcomeShowLanguagePicker) =>
              onPatch({ welcomeShowLanguagePicker })
            }
          />
        </KioskConfigRow>
      </KioskConfigCard>

      <KioskConfigCard
        title={t("kiosk__config__languages_section__title")}
        description={t("kiosk__config__languages_section__desc")}
      >
        <KioskLanguagesSelect
          defaultLanguage={settings.defaultLanguage}
          supportedLanguages={settings.supportedLanguages}
          onChange={onPatch}
        />
      </KioskConfigCard>
    </div>
  );
};
