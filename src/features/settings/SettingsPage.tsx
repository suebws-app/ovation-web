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
    <div className="tablet:-mb-10 desktop:-mb-20 desktop:grid-cols-[260px_1fr] -mx-4 -mb-6 grid min-h-screen">
      <div className="border-border bg-card desktop:block hidden border-r p-4.5 pt-8">
        <SettingsSidebar active={active} onNavigate={setActive} />
      </div>
      <div className="tablet:px-10 tablet:py-11 max-w-4xl px-6 py-8">
        <ActiveSection />
      </div>
    </div>
  );
};
