"use client";

import { KioskConfigLeft } from "./KioskConfigLeft";
import { KioskConfigRight } from "./KioskConfigRight";
import type { KioskSettings, UpdateKioskSettingsInput } from "@/lib/api/types";

type KioskConfigGridProps = {
  settings: KioskSettings;
  eventId: string;
  onPatch: (changes: UpdateKioskSettingsInput) => void;
};

export const KioskConfigGrid = ({
  settings,
  eventId,
  onPatch,
}: KioskConfigGridProps) => (
  <div className="desktop:grid-cols-2 grid gap-5">
    <KioskConfigLeft settings={settings} eventId={eventId} onPatch={onPatch} />
    <KioskConfigRight settings={settings} onPatch={onPatch} />
  </div>
);
