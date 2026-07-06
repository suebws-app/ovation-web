"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { clientEnv } from "@/lib/utils/env.client";
import { SettingsSectionTitle } from "./SettingsSectionTitle";
import { SettingsRow } from "./SettingsRow";

export const DataRightsSection = () => {
  const t = useTranslations();
  const subject = encodeURIComponent(
    t("settings__data__rights__report__email_subject"),
  );
  const mailtoHref = `mailto:${clientEnv.SUPPORT_EMAIL}?subject=${subject}`;

  return (
    <section>
      <SettingsSectionTitle
        title={t("settings__data__rights__title")}
        description={t("settings__data__rights__desc")}
      />
      <Card>
        <CardContent>
          <SettingsRow
            title={t("settings__data__rights__report__title")}
            description={t("settings__data__rights__report__desc")}
            last
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                window.location.href = mailtoHref;
              }}
            >
              {t("settings__data__rights__report__action")}
            </Button>
          </SettingsRow>
        </CardContent>
      </Card>
    </section>
  );
};
