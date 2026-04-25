import { KioskChecklist } from "./components/KioskChecklist";
import { KioskConfigGrid } from "./components/KioskConfigGrid";
import { KioskFooter } from "./components/KioskFooter";
import { KioskHero } from "./components/KioskHero";
import { KioskPreview } from "./components/KioskPreview";

export const KioskSetupPage = () => (
  <div className="flex flex-col gap-6">
    <KioskHero />
    <KioskChecklist />
    <KioskConfigGrid />
    <KioskPreview />
    <KioskFooter />
  </div>
);
