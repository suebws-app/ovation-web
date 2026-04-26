"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { QRTabButton } from "./QRTabButton";

type QRStageProps = {
  coupleName: string;
  shortUrl: string;
};

const displayUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    return `${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

export const QRStage = ({ coupleName, shortUrl }: QRStageProps) => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    t("qr__stage__tab_standard"),
    t("qr__stage__tab_with_photo"),
    t("qr__stage__tab_poster"),
  ];

  return (
    <div className="rounded-20 from-primary to-primary/80 tablet:p-12 relative flex flex-col items-center gap-5 overflow-hidden bg-gradient-to-br p-7">
      <div
        className="pointer-events-none absolute -top-15 -right-15 size-55 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-50 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
        }}
      />

      <div className="text-primary-foreground relative text-center">
        <p className="type-overline tracking-[2px] opacity-85">
          {t("qr__stage__overline")}
        </p>
        <p className="tablet:type-h1 type-h2 mt-1.5 font-serif font-medium italic">
          {coupleName}
        </p>
      </div>

      <div className="rounded-16 bg-card relative p-5 shadow-lg">
        <QRCodeSVG
          value={shortUrl}
          size={220}
          level="M"
          marginSize={0}
          fgColor="#2D2D2D"
          bgColor="#ffffff"
        />
      </div>

      <p className="type-body-small text-primary-foreground/90 relative font-mono tracking-wider">
        {displayUrl(shortUrl)}
      </p>

      <div className="relative flex gap-2">
        {tabs.map((tab, i) => (
          <QRTabButton
            key={tab}
            label={tab}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>
    </div>
  );
};
