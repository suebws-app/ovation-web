"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useUpgradeModalStore } from "./useUpgradeModalStore";
import { UpgradeFeatureRow } from "./UpgradeFeatureRow";

const FEATURE_KEYS = [
  "upgrade_modal__feature_ai_planner",
  "plans__feature_unlimited_messages",
  "upgrade_modal__feature_unlimited_guests",
  "upgrade_modal__feature_unlimited_media",
  "upgrade_modal__feature_storage",
  "plans__feature_auto_transcription",
];

export const UpgradeLimitModal = () => {
  const t = useTranslations();
  const open = useUpgradeModalStore((s) => s.open);
  const reason = useUpgradeModalStore((s) => s.reason);
  const close = useUpgradeModalStore((s) => s.close);

  if (!open || !reason) return null;

  return (
    <div className="bg-foreground/45 animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="rounded-20 bg-card animate-scale-fade-in relative w-full max-w-md p-9 shadow-lg">
        <button
          type="button"
          onClick={close}
          aria-label={t("common__close")}
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <XIcon width={18} height={18} />
        </button>

        <div className="rounded-16 bg-primary/15 mx-auto mb-4.5 flex size-14 items-center justify-center">
          <SparkleIcon width={26} height={26} className="text-primary" />
        </div>
        <h2 className="type-h2 text-center leading-snug tracking-tight">
          {t("upgrade_modal__title")}
        </h2>
        <p className="type-body-small text-muted-foreground mt-3 text-center leading-relaxed">
          {t("upgrade_modal__body")}
        </p>

        <ul className="mt-6 flex flex-col gap-3">
          {FEATURE_KEYS.map((key) => (
            <UpgradeFeatureRow key={key} label={t(key)} />
          ))}
        </ul>

        <Button
          asChild
          variant="default"
          className="mt-7 w-full rounded-full"
          onClick={close}
        >
          <Link href={appRoutes.app.plans}>{t("upgrade_modal__cta")}</Link>
        </Button>
      </div>
    </div>
  );
};
