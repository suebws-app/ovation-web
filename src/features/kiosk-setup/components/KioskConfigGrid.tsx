import { KioskConfigLeft } from "./KioskConfigLeft";
import { KioskConfigRight } from "./KioskConfigRight";

export const KioskConfigGrid = () => (
  <div className="desktop:grid-cols-2 grid gap-5">
    <KioskConfigLeft />
    <KioskConfigRight />
  </div>
);
