"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { CopyIcon } from "@ovation/icons/CopyIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { GlobeIcon } from "@ovation/icons/GlobeIcon";
import { getMobilePlatform, type MobilePlatform } from "@/lib/utils/browser";

type InAppBrowserPromptProps = {
  onContinueAnyway: () => void;
};

const subscribeNoop = () => () => {};
const getHrefSnapshot = () => window.location.href;
const getHrefServerSnapshot = () => "";

const platformInstructionKey = (platform: MobilePlatform): string => {
  if (platform === "ios") return "checkout__in_app__instructions_ios";
  if (platform === "android") return "checkout__in_app__instructions_android";
  return "checkout__in_app__instructions_other";
};

export const InAppBrowserPrompt = ({
  onContinueAnyway,
}: InAppBrowserPromptProps) => {
  const t = useTranslations();
  const href = useSyncExternalStore(
    subscribeNoop,
    getHrefSnapshot,
    getHrefServerSnapshot,
  );
  const [copied, setCopied] = useState(false);
  const platform = getMobilePlatform();

  const handleCopy = async () => {
    if (!href || typeof navigator === "undefined" || !navigator.clipboard)
      return;
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-background flex min-h-[calc(100vh-89px)] flex-col items-center justify-center px-5 text-center">
      <div className="bg-primary/15 text-primary mb-7 inline-flex size-20 items-center justify-center rounded-full">
        <GlobeIcon width={32} height={32} />
      </div>
      <Kicker className="text-muted-foreground">
        {t("checkout__in_app__eyebrow")}
      </Kicker>
      <h1 className="type-h1 mt-3 leading-tight font-semibold tracking-tight">
        {t("checkout__in_app__title")}
      </h1>
      <p className="type-body-small text-muted-foreground mt-3 max-w-md">
        {t("checkout__in_app__body")}
      </p>

      <div className="rounded-16 border-border bg-card mt-8 flex w-full max-w-md flex-col gap-3.5 border p-4.5">
        <p className="type-caption text-muted-foreground text-left">
          {t(platformInstructionKey(platform))}
        </p>
        <div className="rounded-12 bg-background flex items-center gap-2.5 px-3.5 py-2.5">
          <span className="type-body-small text-foreground flex-1 truncate text-left font-mono">
            {href || ""}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!href}
            className="border-border bg-card type-caption text-foreground hover:bg-muted inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copied ? (
              <>
                <CheckIcon width={14} height={14} />
                {t("checkout__in_app__copied")}
              </>
            ) : (
              <>
                <CopyIcon width={14} height={14} />
                {t("checkout__in_app__copy_link")}
              </>
            )}
          </button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onContinueAnyway}
        className="text-muted-foreground mt-6"
      >
        {t("checkout__in_app__continue_anyway")}
      </Button>
    </div>
  );
};
