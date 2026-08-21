"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

type DemoQrCardProps = {
  guestUrl: string;
};

export const DemoQrCard = ({ guestUrl }: DemoQrCardProps) => {
  const t = useTranslations();
  const k = (suffix: string) => t(`marketing__${suffix}`);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(guestUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  };

  return (
    <div className="small-desktop:flex-col small-desktop:items-start flex items-center gap-4">
      <div className="border-primary rounded-16 shrink-0 border-2 bg-white p-2.5">
        <QRCodeSVG
          value={guestUrl}
          size={96}
          level="M"
          marginSize={0}
          fgColor="#111111"
          bgColor="#ffffff"
        />
      </div>
      <div className="small-desktop:items-start flex flex-col items-start gap-2">
        <p className="type-caption text-muted-foreground">
          {k("demo_qr_hint")}
        </p>
        <Button variant="pillGhost" size="pill" onClick={copyLink}>
          {copied ? k("demo_copy_done") : k("demo_copy_link")}
        </Button>
      </div>
    </div>
  );
};
