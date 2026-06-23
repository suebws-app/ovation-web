import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";
import type { User } from "@/lib/api/types";
import { NotificationPrefs } from "./NotificationPrefs";

type SettingsNotificationsSectionProps = {
  user: User;
};

export const SettingsNotificationsSection = ({
  user,
}: SettingsNotificationsSectionProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <PageHeading kicker={t("settings__notif__eyebrow")}>
          <span className="text-primary italic">
            {t("settings__notif__title")}
          </span>
        </PageHeading>
        <p className="type-body text-muted-foreground mt-2.5 max-w-xl">
          {t("settings__notif__subtitle")}
        </p>
      </div>
      <NotificationPrefs user={user} />
    </div>
  );
};
