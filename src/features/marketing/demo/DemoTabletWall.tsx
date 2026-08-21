"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DEMO_WALL_ROTATE_MS } from "./constants";
import type { DemoFeedItem } from "./useDemoFeed";
import { QRCodeSVG } from "qrcode.react";
import { DemoWallSlide } from "./DemoWallSlide";

type DemoTabletWallProps = {
  items: DemoFeedItem[];
  guestUrl: string | null;
};

export const DemoTabletWall = ({ items, guestUrl }: DemoTabletWallProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`marketing__${suffix}`);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % items.length),
      DEMO_WALL_ROTATE_MS,
    );
    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <div className="bg-foreground rounded-16 tablet:rounded-24 w-full p-2.5 shadow-lg">
      <div className="bg-warm-panel/40 rounded-12 tablet:rounded-16 relative aspect-16/10 w-full overflow-hidden">
        {items.map((item, index) => (
          <DemoWallSlide
            key={item.id}
            url={item.url}
            alt={k("demo_wall_alt")}
            isActive={index === activeIndex}
            isNew={item.isNew}
            newLabel={k("demo_wall_new_badge")}
          />
        ))}

        {guestUrl && (
          <div className="rounded-8 small-desktop:p-2 absolute bottom-3 left-3 bg-white p-1.5 shadow-lg">
            <QRCodeSVG
              value={guestUrl}
              size={80}
              level="M"
              marginSize={0}
              fgColor="#111111"
              bgColor="#ffffff"
              className="small-desktop:size-16 size-10"
            />
          </div>
        )}
      </div>
    </div>
  );
};
