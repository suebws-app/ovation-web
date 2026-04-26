"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Event, User } from "@/lib/api/types";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { SettingsProfileSection } from "./components/SettingsProfileSection";
import { SettingsPrivacySection } from "./components/SettingsPrivacySection";
import { SettingsDataSection } from "./components/SettingsDataSection";
import { SettingsDangerSection } from "./components/SettingsDangerSection";
import { SettingsNotificationsSection } from "./components/SettingsNotificationsSection";

type SettingsClientProps = {
  user: User;
  event: Event | null;
};

export const SettingsClient = ({ user, event }: SettingsClientProps) => {
  const t = useTranslations();
  const [active, setActive] = useState("profile");

  return (
    <div className="tablet:-mb-10 desktop:-mb-20 desktop:grid-cols-[260px_1fr] -mx-4 -mb-6 grid min-h-screen">
      <div className="border-border bg-card desktop:block hidden border-r p-4.5 pt-8">
        <SettingsSidebar
          active={active}
          onNavigate={setActive}
          coupleName={
            event
              ? [event.partnerAName, event.partnerBName]
                  .filter(Boolean)
                  .join(" & ")
              : (user.fullName ?? user.email)
          }
          slug={event?.slug ?? null}
        />
      </div>
      <div className="tablet:px-10 tablet:py-11 max-w-4xl px-6 py-8">
        {active === "profile" && (
          <SettingsProfileSection user={user} event={event} />
        )}
        {active === "notif" && <SettingsNotificationsSection user={user} />}
        {active === "privacy" && <SettingsPrivacySection />}
        {active === "data" && <SettingsDataSection />}
        {active === "danger" && (
          <SettingsDangerSection user={user} event={event} />
        )}
        {active !== "profile" &&
          active !== "notif" &&
          active !== "privacy" &&
          active !== "data" &&
          active !== "danger" && (
            <div className="rounded-16 border-border bg-card border p-8">
              <p className="type-body-small text-muted-foreground">
                {t("settings__not_connected")}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};
