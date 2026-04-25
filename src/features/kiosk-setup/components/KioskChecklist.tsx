"use client";

import { Check } from "@ovation/icons/Check";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { KioskChecklistItem } from "./KioskChecklistItem";

const ITEMS = [
  {
    title: "Charger plugged in",
    description: "Kiosk drains 20% an hour",
    done: true,
  },
  {
    title: "Phone on a stand",
    description: "Stable, eye-height if possible",
    done: true,
  },
  {
    title: "Volume & brightness up",
    description: "Venues get loud and dim",
    done: true,
  },
  {
    title: "Do Not Disturb on",
    description: "No calls or texts mid-record",
    done: false,
  },
  {
    title: "Airplane mode OFF",
    description: "Messages need to upload",
    done: true,
  },
  {
    title: "Tested a message yourself",
    description: "Catches obvious bugs early",
    done: false,
    cta: "Run test",
  },
];

export const KioskChecklist = () => {
  const doneCount = ITEMS.filter((i) => i.done).length;

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 font-serif tracking-tight">
          Wedding-day checklist
        </h2>
        <span className="type-caption text-muted-foreground">
          <strong className="text-foreground">
            {doneCount} of {ITEMS.length}
          </strong>{" "}
          ready &middot; ~2 min to finish
        </span>
      </div>
      <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
        {ITEMS.map((item) => (
          <KioskChecklistItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};
