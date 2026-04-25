import { KioskConfigLeft } from "./KioskConfigLeft";
import { KioskConfigRight } from "./KioskConfigRight";

export const KioskConfigGrid = () => (
  <div className="grid gap-5 desktop:grid-cols-2">
    <KioskConfigLeft />
    <KioskConfigRight />
  </div>
);
