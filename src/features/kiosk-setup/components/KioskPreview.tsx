"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { PublicEvent } from "@/lib/api/types";
import { KioskLiveFrame } from "./KioskLiveFrame";
import { KioskPreviewTab } from "./KioskPreviewTab";

type KioskPreviewProps = {
  slug: string | null;
  event: PublicEvent | null;
};

type DeviceKey = "tablet" | "phone";

const DEVICES: Record<
  DeviceKey,
  { width: number; height: number; maxScale: number }
> = {
  tablet: { width: 1280, height: 800, maxScale: 0.58 },
  phone: { width: 390, height: 844, maxScale: 0.55 },
};

const BEZEL_PX = 28;

export const KioskPreview = ({ slug, event }: KioskPreviewProps) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<DeviceKey>("tablet");
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setStageWidth(entry.contentRect.width);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const TABS: Array<{ label: string; value: DeviceKey }> = [
    { label: t("kiosk__preview__tablet"), value: "tablet" },
    { label: t("kiosk__preview__phone"), value: "phone" },
  ];

  const device = DEVICES[activeTab];
  const availableWidth = Math.max(stageWidth - BEZEL_PX, 0);
  const fitScale =
    stageWidth > 0
      ? Math.min(device.maxScale, availableWidth / device.width)
      : device.maxScale;
  const outerWidth = device.width * fitScale + BEZEL_PX;
  const outerHeight = device.height * fitScale + BEZEL_PX;

  if (!slug || !event) {
    return (
      <div>
        <h2 className="type-h2 tracking-tight">{t("kiosk__preview__title")}</h2>
        <div className="rounded-20 border-border bg-card mt-3.5 border p-8 text-center">
          <p className="type-body-small text-muted-foreground">
            {t("kiosk__preview__no_event")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="type-h2 tracking-tight">{t("kiosk__preview__title")}</h2>
      </div>
      <div className="rounded-20 border-border bg-card border p-5 shadow">
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
        <div
          ref={stageRef}
          className="rounded-16 bg-background flex justify-center p-6"
        >
          <div
            className="rounded-24 border-foreground/90 relative overflow-hidden border-14 shadow-lg"
            style={{ width: outerWidth, height: outerHeight }}
          >
            <div
              className="pointer-events-none absolute inset-0 origin-top-left"
              style={{
                transform: `scale(${fitScale})`,
                width: device.width,
                height: device.height,
              }}
            >
              <KioskLiveFrame slug={slug} event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
