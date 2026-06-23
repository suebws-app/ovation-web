import { useTranslations } from "next-intl";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { PageHeading } from "@/components/PageHeading";
import type { Event, User } from "@/lib/api/types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsRow } from "./SettingsRow";
import { SettingsToggle } from "./SettingsToggle";
import { ProfileNameForm } from "./ProfileNameForm";
import { WeddingDetailsForm } from "./WeddingDetailsForm";
import { LocalizationForm } from "./LocalizationForm";
import { ProfileCloseAccount } from "./ProfileCloseAccount";

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
    <div className="tablet:gap-10 flex flex-1 flex-col gap-6">
      <div>
        <PageHeading kicker={t("settings__profile__eyebrow")}>
          {t("settings__profile__title_a")}{" "}
          <span className="text-primary italic">
            {t("settings__profile__title_b")}
          </span>
        </PageHeading>
        <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
          {t("settings__profile__subtitle")}
        </p>
      </div>

      <section>
        <SettingsSectionTitle
          title={t("settings__profile__your_account")}
          description={t("settings__profile__your_account_description")}
        />
        <Card>
          <CardContent>
            <ProfileNameForm user={user} />
          </CardContent>
        </Card>
      </section>

      {!isPro &&
        (event ? (
          <section>
            <SettingsSectionTitle
              title={t("settings__profile__wedding_details")}
              description={t("settings__profile__wedding_details_description")}
            />
            <Card>
              <CardContent>
                <WeddingDetailsForm event={event} />
              </CardContent>
            </Card>
          </section>
        ) : (
          <section>
            <SettingsSectionTitle
              title={t("settings__profile__wedding_details")}
              description={t("settings__profile__wedding_details_no_event")}
            />
          </section>
        ))}

      <section>
        <SettingsSectionTitle
          title={t("settings__profile__localization")}
          description={t("settings__profile__localization_description")}
        />
        <Card>
          <CardContent>
            <LocalizationForm user={user} />
          </CardContent>
        </Card>
      </section>

      <section>
        <SettingsSectionTitle title={t("settings__privacy__ai__title")} />
        <Card>
          <CardContent>
            <SettingsRow
              title={t("settings__privacy__ai__transcribe__title")}
              description={t("settings__privacy__ai__transcribe__desc")}
              last
            >
              <SettingsToggle on={true} />
            </SettingsRow>
          </CardContent>
        </Card>
      </section>

      <ProfileCloseAccount email={user.email} />
    </div>
  );
};
