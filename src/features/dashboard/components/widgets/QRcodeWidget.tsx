"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { CopyIcon } from "@ovation/icons/CopyIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";

import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type QRcodeWidgetProps = {
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

export const QRcodeWidget = ({ shortUrl }: QRcodeWidgetProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-20 from-primary to-primary/80 text-primary-foreground relative flex min-h-110 w-full flex-col overflow-hidden bg-linear-to-br p-5 shadow-sm">
      <div
        className="pointer-events-none absolute -top-15 -right-15 size-55 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-50 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between">
        <span className="bg-primary-foreground/10 rounded-10 inline-flex size-9 items-center justify-center">
          <QrCodeIcon width={18} height={18} />
        </span>
        <p className="type-overline tracking-[2px] uppercase opacity-70">
          {t("dashboard__qr__eyebrow")}
        </p>
      </div>

      <div className="bg-background rounded-16 relative mt-5 flex items-center justify-center p-4 shadow-lg">
        <QRCodeSVG
          value={shortUrl}
          size={200}
          level="H"
          marginSize={0}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <p className="type-body-small min-w-0 flex-1 truncate font-mono opacity-90">
          {displayUrl(shortUrl)}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={
            copied ? t("dashboard__qr__copied") : t("dashboard__qr__copy")
          }
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        >
          {copied ? (
            <CheckIcon width={14} height={14} />
          ) : (
            <CopyIcon width={14} height={14} />
          )}
        </button>
      </div>

      <Link
        href={appRoutes.app.qrCode}
        className="type-body-small relative mt-4 inline-flex items-center justify-center gap-2 font-semibold transition-opacity hover:opacity-80"
      >
        {t("dashboard__qr__open_page")}
      </Link>
    </div>
  );
};
