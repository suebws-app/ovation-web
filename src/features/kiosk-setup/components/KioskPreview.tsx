"use client";

import { useState } from "react";
import { Button } from "@ovation/ui/components/Button";
import { Eye } from "@ovation/icons/Eye";
import { cn } from "@ovation/ui/utils/cn";
import { KioskLiveFrame } from "./KioskLiveFrame";
import { KioskPreviewTab } from "./KioskPreviewTab";

const TABS = [
  { label: "Tablet \u00b7 landscape", value: "tablet" },
  { label: "Phone \u00b7 portrait", value: "phone" },
  { label: "Phone \u00b7 locked screen", value: "locked" },
];

export const KioskPreview = () => {
  const [activeTab, setActiveTab] = useState("tablet");

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="font-serif type-h2 tracking-tight">Live preview</h2>
        <Button size="sm" className="rounded-full">
          <Eye width={13} height={13} />
          Open as guest
        </Button>
      </div>
      <div className="rounded-20 border border-border bg-card p-5 shadow">
        <div className="mb-3.5 flex gap-1.5">
          {TABS.map((tab) => (
            <KioskPreviewTab
              key={tab.value}
              label={tab.label}
              active={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            />
          ))}
        </div>
        <div className="flex justify-center rounded-16 bg-background p-6">
          <div className="relative overflow-hidden rounded-24 border-[14px] border-foreground/90 shadow-lg" style={{ width: 1280 * 0.58, height: 800 * 0.58 + 28 }}>
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                transform: "scale(0.58)",
                width: 1280,
                height: 800,
              }}
            >
              <KioskLiveFrame />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
