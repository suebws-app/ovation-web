"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { WarningIcon } from "@ovation/icons/WarningIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useUpgradeModalStore } from "./useUpgradeModalStore";

export const UpgradeLimitModal = () => {
  const t = useTranslations();
  const open = useUpgradeModalStore((s) => s.open);
  const reason = useUpgradeModalStore((s) => s.reason);
  const close = useUpgradeModalStore((s) => s.close);

  if (!open || !reason) return null;

  const title =
    reason === "storage"
      ? t("upgrade_modal__storage__title")
      : t("upgrade_modal__messages__title");
  const body =
    reason === "storage"
      ? t("upgrade_modal__storage__body")
      : t("upgrade_modal__messages__body");

  return (
    <div className="bg-foreground/45 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-20 bg-card w-full max-w-md p-9 shadow-lg">
        <div className="rounded-16 bg-primary/15 mb-4.5 flex size-14 items-center justify-center">
          <WarningIcon width={26} height={26} className="text-primary" />
        </div>
        <h2 className="type-h2 leading-snug tracking-tight">{title}</h2>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          {body}
        </p>
        <div className="mt-6.5 flex justify-end gap-2.5">
          <Button variant="outline" className="rounded-full" onClick={close}>
            {t("upgrade_modal__dismiss")}
          </Button>
          <Button
            asChild
            variant="default"
            className="rounded-full"
            onClick={close}
          >
            <Link href={appRoutes.app.plans}>{t("upgrade_modal__cta")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
