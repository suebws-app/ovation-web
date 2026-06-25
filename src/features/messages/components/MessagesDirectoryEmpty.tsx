"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { MailIcon } from "@ovation/icons/MailIcon";
import { QrCodeIcon } from "@ovation/icons/QrCodeIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type MessagesDirectoryEmptyProps = {
  eventId: string;
};

export const MessagesDirectoryEmpty = ({
  eventId,
}: MessagesDirectoryEmptyProps) => {
  const t = useTranslations();

  return (
    <div className="tablet:py-20 relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center">
      <div className="bg-primary/8 pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative">
        <div className="border-primary/15 animate-tap-pulse pointer-events-none absolute -inset-3 rounded-[28px] border" />
        <div className="border-primary/25 pointer-events-none absolute -inset-6 rounded-[36px] border opacity-60" />

        <div className="rounded-20 bg-card border-border relative border p-3 shadow-lg">
          <div className="rounded-16 bg-primary/10 text-primary flex size-36 items-center justify-center">
            <MailIcon className="size-16" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="tablet:mt-10 mt-8 flex max-w-md flex-col items-center gap-3">
        <h2 className="type-h2 leading-tight font-semibold tracking-tight">
          {t("event__messages__empty")}
        </h2>
        <p className="type-body-small text-muted-foreground leading-relaxed">
          {t("event__messages__empty_hint")}
        </p>
      </div>

      <div className="tablet:mt-6 tablet:flex-row tablet:gap-3 mt-5 flex w-full max-w-sm flex-col gap-2">
        <Button asChild className="flex-1 rounded-full">
          <Link href={appRoutes.app.eventQrCode(eventId)}>
            <QrCodeIcon width={16} height={16} />
            {t("sidebar__quick__qr")}
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 rounded-full">
          <Link href={appRoutes.app.eventLink(eventId)}>
            <LinkIcon width={16} height={16} />
            {t("sidebar__quick__link")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
