"use client";

import { useTranslations } from "next-intl";
import type { InvitationStepId } from "../constants";
import type { InvitationFields } from "../invitationSchema";
import type { InvitationTemplateMeta } from "../invitationTemplates";
import { eventCardTitle } from "@/lib/event-types";
import { InviteCard } from "./InviteCard";
import { PhonePreview } from "./PhonePreview";

const formatDateLabel = (iso: string): string | undefined => {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type InvitationPreviewPanelProps = {
  template: InvitationTemplateMeta | undefined;
  values: InvitationFields | undefined;
  eventType?: string | null;
  customEventNoun?: string | null;
  step: InvitationStepId;
  selectedGuestFirstName: string | undefined;
};

export const InvitationPreviewPanel = ({
  template,
  values,
  eventType,
  customEventNoun,
  step,
  selectedGuestFirstName,
}: InvitationPreviewPanelProps) => {
  const t = useTranslations();
  const showPersonalized = step === "guests" && Boolean(selectedGuestFirstName);
  // Two-tier, type-aware title: host names on top + the event word below
  // (e.g. "Alex & Jordan" / "Anniversary"). An explicit Event Name overrides
  // with a single line; single-host types never emit a second host.
  const titleParts = eventCardTitle(t, {
    eventType,
    hostA: values?.partnerA,
    hostB: values?.partnerB,
    eventName: values?.eventName,
    customEventNoun,
  });

  return (
    <aside className="desktop:flex desktop:basis-2/5 desktop:shrink-0 desktop:sticky desktop:top-0 desktop:h-screen mt-20 hidden flex-col items-center px-2 py-8">
      <div className="flex flex-col items-center gap-4">
        <PhonePreview>
          {template ? (
            <InviteCard
              template={template}
              values={{
                ...titleParts,
                dateLabel: formatDateLabel(values?.weddingDate ?? ""),
                time: values?.time,
                venue: values?.venue,
                place: values?.place,
                message: values?.message,
              }}
              guestFirstName={
                step === "guests" ? selectedGuestFirstName : undefined
              }
            />
          ) : (
            <div className="bg-muted h-full w-full animate-pulse" />
          )}
        </PhonePreview>
        <p className="type-caption text-muted-foreground font-mono tracking-widest uppercase">
          {showPersonalized
            ? t("invitation__preview__personalized", {
                name: selectedGuestFirstName ?? "",
              })
            : t("invitation__preview__live")}
        </p>
      </div>
    </aside>
  );
};
