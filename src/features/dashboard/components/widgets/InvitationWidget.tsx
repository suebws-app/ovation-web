"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { MailIcon } from "@ovation/icons/MailIcon";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Event, InvitationTemplate } from "@/lib/api/types";
import { InviteCard } from "@/features/invitation/components/InviteCard";
import { useInvitationTemplatesQuery } from "@/lib/query/invitationTemplatesQueries";

type InvitationWidgetProps = {
  event: Event;
};

const formatDateLabel = (iso: string | null): string | undefined => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const pickTemplate = (
  templates: InvitationTemplate[],
  selectedId: string,
  defaultId: string,
): InvitationTemplate | undefined =>
  templates.find((tpl) => tpl.id === selectedId) ??
  templates.find((tpl) => tpl.id === defaultId) ??
  templates[0];

export const InvitationWidget = ({ event }: InvitationWidgetProps) => {
  const t = useTranslations();
  const { data } = useInvitationTemplatesQuery();

  const template = useMemo(() => {
    if (!data) return undefined;
    return pickTemplate(
      data.templates,
      event.invitationTemplateId,
      data.defaultTemplateId,
    );
  }, [data, event.invitationTemplateId]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="bg-primary/10 text-primary rounded-12 inline-flex size-10 items-center justify-center">
            <MailIcon width={18} height={18} />
          </span>
          <p className="type-overline text-muted-foreground tracking-[2px] uppercase">
            {t("dashboard__widget__invitation__eyebrow")}
          </p>
        </div>

        <div className="border-foreground/10 rounded-16 relative aspect-3/4 w-full overflow-hidden border shadow-sm">
          {template ? (
            <InviteCard
              template={template}
              values={{
                partnerA: event.partnerAName,
                partnerB: event.partnerBName,
                dateLabel: formatDateLabel(event.weddingDate),
                venue: event.venueName ?? undefined,
                place: event.venueCity ?? undefined,
                message: event.welcomeMessage ?? undefined,
              }}
            />
          ) : (
            <div className="bg-muted h-full w-full animate-pulse" />
          )}
        </div>

        <Button asChild className="rounded-full">
          <Link href={appRoutes.app.invitation}>
            {t("dashboard__widget__invitation__edit_cta")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
