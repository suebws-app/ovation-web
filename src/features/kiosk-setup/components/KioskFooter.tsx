"use client";

import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";

export const KioskFooter = () => {
  return (
    <div className="flex items-center justify-between">
      <span className="type-caption text-muted-foreground">
        Changes save automatically &middot; Last edit 2 minutes ago
      </span>
      <div className="flex gap-2.5">
        <Button variant="outline" className="rounded-full">
          Save as template
        </Button>
        <Button className="rounded-full shadow-lg">
          <Play width={13} height={13} />
          Start kiosk on this device
        </Button>
      </div>
    </div>
  );
};
