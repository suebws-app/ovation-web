"use client";

import { useTranslations } from "next-intl";
import { EyeIcon } from "@ovation/icons/EyeIcon";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Event } from "@/lib/api/types";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { PhonePreview } from "@/features/invitation/components/PhonePreview";
import { useInvitePreview } from "../hooks/useInvitePreview";

type InviteePreviewPaneProps = {
  event: Event;
  onOpenPreview: () => void;
};

export const InviteePreviewPane = ({
  event,
  onOpenPreview,
}: InviteePreviewPaneProps) => {
  const t = useTranslations();
  const { template, values } = useInvitePreview(event);

  return (
    <aside className="tablet:sticky tablet:top-6 flex flex-col gap-4">
      <div className="rounded-16 border-border bg-card flex flex-col items-center gap-4 border p-5">
        <p className="type-caption text-muted-foreground self-start font-semibold tracking-wide uppercase">
          {t("invitees__preview__title")}
        </p>
        <div className="origin-top scale-90">
          <PhonePreview>
            {template ? (
              <InviteCard template={template} values={values} />
            ) : (
              <div className="bg-muted h-full w-full animate-pulse" />
            )}
          </PhonePreview>
        </div>
        <div className="flex w-full gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenPreview}
            className="flex-1 rounded-full"
          >
            <EyeIcon width={13} height={13} />
            {t("invitees__preview__cta")}
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 rounded-full"
          >
            <Link href={appRoutes.app.invitation}>
              <PencilIcon width={13} height={13} />
              {t("invitees__edit_card__cta")}
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
};
