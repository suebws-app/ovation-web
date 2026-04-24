"use client";

import { useState } from "react";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { SettingsProfileSection } from "./components/SettingsProfileSection";
import { SettingsPrivacySection } from "./components/SettingsPrivacySection";
import { SettingsDataSection } from "./components/SettingsDataSection";
import { SettingsDangerSection } from "./components/SettingsDangerSection";

const SECTIONS: Record<string, React.ComponentType> = {
  profile: SettingsProfileSection,
  privacy: SettingsPrivacySection,
  data: SettingsDataSection,
  danger: SettingsDangerSection,
};

export const SettingsPage = () => {
  const [active, setActive] = useState("profile");
  const ActiveSection = SECTIONS[active] ?? SettingsProfileSection;

  return (
    <div className="-mx-4 -mb-6 tablet:-mb-10 desktop:-mb-20 grid min-h-screen desktop:grid-cols-[260px_1fr]">
      <div className="hidden border-r border-border bg-card p-4.5 pt-8 desktop:block">
        <SettingsSidebar active={active} onNavigate={setActive} />
      </div>
      <div className="max-w-4xl px-6 py-8 tablet:px-10 tablet:py-11">
        <ActiveSection />
      </div>
    </div>
  );
};
