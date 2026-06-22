"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { LockIcon } from "@ovation/icons/LockIcon";

type KioskShareCardProps = {
  slug: string;
};

const subscribeNoop = () => () => {};
const getOriginSnapshot = () => window.location.origin;
const getOriginServerSnapshot = () => "";

const displayUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    return `${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

export const KioskShareCard = ({ slug }: KioskShareCardProps) => {
  const t = useTranslations();
  const origin = useSyncExternalStore(
    subscribeNoop,
    getOriginSnapshot,
    getOriginServerSnapshot,
  );
  const shareUrl = origin ? `${origin}/kiosk/${slug}` : "";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-16 border-border bg-card flex flex-col gap-3.5 border p-4.5">
      <div>
        <Kicker className="text-muted-foreground mb-2.5">
          {t("kiosk__share__eyebrow")}
        </Kicker>
        <p className="type-body-small text-muted-foreground">
          {t("kiosk__share__desc")}
        </p>
      </div>

      <div className="rounded-12 bg-background flex flex-wrap items-center gap-2.5 px-3.5 py-2.5">
        <LinkIcon width={16} height={16} className="text-muted-foreground" />
        <span className="type-body-small text-foreground flex-1 truncate font-mono">
          {shareUrl ? displayUrl(shareUrl) : `…/kiosk/${slug}`}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!shareUrl}
          className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copied ? t("kiosk__share__copied") : t("kiosk__share__copy")}
        </button>
      </div>

      <div className="rounded-12 bg-primary/5 text-primary type-caption flex items-start gap-2.5 px-3.5 py-2.5">
        <LockIcon width={14} height={14} className="mt-0.5 shrink-0" />
        <span>{t("kiosk__share__pin_set")}</span>
      </div>
    </div>
  );
};
