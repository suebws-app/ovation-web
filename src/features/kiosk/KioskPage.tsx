"use client";

import { KioskLiveFrame } from "@/features/kiosk-setup/components/KioskLiveFrame";

export const KioskPage = () => {
  return (
    <div className="fixed inset-0">
      <KioskLiveFrame />
    </div>
  );
};
