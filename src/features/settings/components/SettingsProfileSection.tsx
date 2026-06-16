import { useTranslations } from "next-intl";
import type { Event, User } from "@/lib/api/types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsCard } from "./SettingsCard";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { ProfileNameForm } from "./ProfileNameForm";
import { WeddingDetailsForm } from "./WeddingDetailsForm";
import { ProfileCloseAccount } from "./ProfileCloseAccount";
import { LanguageSelect } from "@/components/LanguageSelect";
import { CurrencySelect } from "@/components/CurrencySelect";

type SettingsProfileSectionProps = {
  user: User;
  event: Event | null;
};

export const SettingsProfileSection = ({
  user,
  event,
}: SettingsProfileSectionProps) => {
  const t = useTranslations();
  const isPro = user.accountType === "pro";
  return (
    <>
      <span className="type-overline text-primary">
        {t("settings__profile__eyebrow")}
      </span>
      <h1 className="type-h0 mt-2 tracking-tight">
        {t("settings__profile__title_a")}{" "}
        <span className="text-primary italic">
          {t("settings__profile__title_b")}
        </span>
      </h1>
      <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
        {t("settings__profile__subtitle")}
      </p>

      <div className="mt-9">
        <SettingsSectionTitle
          title={t("settings__profile__your_account")}
          description={t("settings__profile__your_account_description")}
        />
        <SettingsCard>
          <div className="py-5.5">
            <ProfileNameForm user={user} />
          </div>
        </SettingsCard>
      </div>

      {!isPro &&
        (event ? (
          <div className="mt-11">
            <SettingsSectionTitle
              title={t("settings__profile__wedding_details")}
              description={t("settings__profile__wedding_details_description")}
            />
            <SettingsCard>
              <div className="py-5.5">
                <WeddingDetailsForm event={event} />
              </div>
            </SettingsCard>
          </div>
        ) : (
          <div className="mt-11">
            <SettingsSectionTitle
              title={t("settings__profile__wedding_details")}
              description={t("settings__profile__wedding_details_no_event")}
            />
          </div>
        ))}

      <div className="mt-11">
        <SettingsSectionTitle
          title={t("settings__profile__localization")}
          description={t("settings__profile__localization_description")}
        />
        <SettingsCard>
          <SettingsRow
            title={t("settings__profile__language_label")}
            description={t("settings__profile__language_hint")}
          >
            <LanguageSelect />
          </SettingsRow>
          <SettingsRow
            title={t("settings__profile__currency_label")}
            description={t("settings__profile__currency_hint")}
            last
          >
            <CurrencySelect />
          </SettingsRow>
        </SettingsCard>
      </div>

      <div className="mt-11">
        <SettingsSectionTitle title={t("settings__privacy__ai__title")} />
        <SettingsCard>
          <SettingsRow
            title={t("settings__privacy__ai__transcribe__title")}
            description={t("settings__privacy__ai__transcribe__desc")}
            last
          >
            <SettingsToggle on={true} />
          </SettingsRow>
        </SettingsCard>
      </div>

      <ProfileCloseAccount email={user.email} />
    </>
  );
};
