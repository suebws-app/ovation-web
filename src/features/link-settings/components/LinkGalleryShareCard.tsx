"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CopyIcon } from "@ovation/icons/CopyIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { KioskConfigCard } from "@/features/kiosk-setup/components/KioskConfigCard";
import { KioskConfigRow } from "@/features/kiosk-setup/components/KioskConfigRow";
import { KioskToggle } from "@/features/kiosk-setup/components/KioskToggle";
import type { LinkSettings, UpdateLinkSettingsInput } from "@/lib/api/types";

type LinkGalleryShareCardProps = {
  slug: string;
  settings: LinkSettings;
  onPatch: (changes: UpdateLinkSettingsInput) => void;
  isSaving: boolean;
};

const galleryUrl = (slug: string, code: string): string => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/g/${slug}/gallery/${code}`;
};

export const LinkGalleryShareCard = ({
  slug,
  settings,
  onPatch,
  isSaving,
}: LinkGalleryShareCardProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const shareUrl =
    settings.galleryPublic && settings.galleryCode
      ? galleryUrl(slug, settings.galleryCode)
      : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <KioskConfigCard
      title={t("link_settings__gallery__title")}
      description={t("link_settings__gallery__desc")}
    >
      <KioskConfigRow
        title={t("link_settings__gallery__toggle_title")}
        description={t("link_settings__gallery__toggle_desc")}
        last={!shareUrl}
      >
        <KioskToggle
          on={settings.galleryPublic}
          onChange={(galleryPublic) => onPatch({ galleryPublic })}
        />
      </KioskConfigRow>

      {shareUrl && (
        <div className="border-border flex flex-col gap-3 border-t py-4.5">
          <div className="bg-muted rounded-12 flex items-center justify-between gap-3 px-4 py-3">
            <p className="type-body-small min-w-0 flex-1 truncate font-mono">
              {shareUrl}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={
                copied
                  ? t("link_settings__gallery__copied")
                  : t("link_settings__gallery__copy")
              }
              className="bg-background hover:bg-card inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
            >
              {copied ? (
                <CheckIcon width={14} height={14} />
              ) : (
                <CopyIcon width={14} height={14} />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="type-caption text-muted-foreground">
              {t("link_settings__gallery__regenerate_hint")}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onPatch({ regenerateGalleryCode: true })}
              className="shrink-0 rounded-full"
            >
              {t("link_settings__gallery__regenerate")}
            </Button>
          </div>
        </div>
      )}
    </KioskConfigCard>
  );
};
