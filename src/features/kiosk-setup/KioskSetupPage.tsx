"use client";

import { KioskHero } from "./components/KioskHero";
import { KioskChecklist } from "./components/KioskChecklist";
import { KioskConfigLeft } from "./components/KioskConfigLeft";
import { KioskConfigRight } from "./components/KioskConfigRight";
import { KioskPreview } from "./components/KioskPreview";
import { KioskFooter } from "./components/KioskFooter";

export const KioskSetupPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <KioskHero />
      <KioskChecklist />
      <div className="grid gap-5 desktop:grid-cols-2">
        <KioskConfigLeft />
        <KioskConfigRight />
      </div>
      <KioskPreview />
      <KioskFooter />
    </div>
  );
};
