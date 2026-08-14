"use client";

import { useTranslations } from "next-intl";
import type { InvitationStepId } from "../constants";
import type { InvitationFields } from "../invitationSchema";
import type { InvitationTemplateMeta } from "../invitationTemplates";
import {
  eventCardTitle,
  formatDateRange,
  isDateRange,
  memorialLifeSpan,
} from "@/lib/event-types";
import { InviteCard } from "./InviteCard";
import { PhonePreview } from "./PhonePreview";
import { CustomiseControls } from "./CustomiseControls";

const PREVIEW_GUEST_NAME = "Alex";

const TOKEN_CUSTOM_IDS = [
  "classic_elegance",
  "watercolor_blush",
  "charcoal_marble",
  "modern_botanical",
];

const formatDateLabel = (raw: string): string => {
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? raw
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

type InvitationPreviewPanelProps = {
  template: InvitationTemplateMeta | undefined;
  values: InvitationFields | undefined;
  eventType?: string | null;
  endDate?: string | null;
  customEventNoun?: string | null;
  step: InvitationStepId;
  selectedGuestFirstName: string | undefined;
};

export const InvitationPreviewPanel = ({
  template,
  values,
  eventType,
  endDate,
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
    // Corporate keeps the organization (hostA) as the title; the event name is
    // shown as a subtitle below, not as an overriding single line.
    eventName: eventType === "corporate" ? undefined : values?.eventName,
    customEventNoun,
  });
  const subtitle =
    eventType === "corporate"
      ? values?.eventName?.trim() || undefined
      : eventType === "memorial"
        ? memorialLifeSpan(values?.bornOn, values?.passedOn)
        : undefined;

  const showCustomise =
    Boolean(template) &&
    !template?.artSvg &&
    TOKEN_CUSTOM_IDS.includes(template?.id ?? "");

  const phonePreview = (
    <PhonePreview>
      {template ? (
        <InviteCard
          template={template}
          padded
          values={{
            ...titleParts,
            subtitle,
            logo: values?.showLogo ? values?.logo || undefined : undefined,
            dateLabel:
              formatDateRange(
                {
                  eventType,
                  eventDate: values?.weddingDate ?? null,
                  endDate: endDate ?? null,
                  weddingDate: null,
                },
                formatDateLabel,
              ) ?? t("invitation__placeholder__date"),
            time: values?.time
              ? t(
                  isDateRange({
                    eventType,
                    eventDate: values?.weddingDate ?? null,
                    endDate: endDate ?? null,
                    weddingDate: null,
                  })
                    ? "invitation__time__from"
                    : "invitation__time__at",
                  { time: values.time },
                )
              : undefined,
            venue: values?.venue,
            place: values?.place,
            message: values?.message,
            greeting: values?.greeting,
            age:
              values?.showAge !== false &&
              values?.age &&
              Number.isFinite(Number(values.age))
                ? Number(values.age)
                : undefined,
          }}
          guestFirstName={selectedGuestFirstName ?? PREVIEW_GUEST_NAME}
          pageBg={values?.pageBg}
          cardBg={values?.cardBg}
          textColor={values?.textColor}
          mutedColor={values?.mutedColor}
          accentColor={values?.accentColor}
          textScale={values?.textScale}
        />
      ) : (
        <div className="bg-muted h-full w-full animate-pulse" />
      )}
    </PhonePreview>
  );

  return (
    <aside className="desktop:flex desktop:basis-2/5 desktop:shrink-0 desktop:sticky desktop:top-0 desktop:h-screen desktop:overflow-y-auto mt-20 hidden flex-col items-center px-2 py-8">
      <div className="flex flex-col items-center gap-4 pb-8">
        {phonePreview}
        <p className="type-caption text-muted-foreground font-mono tracking-widest uppercase">
          {showPersonalized
            ? t("invitation__preview__personalized", {
                name: selectedGuestFirstName ?? "",
              })
            : t("invitation__preview__live")}
        </p>
        {showCustomise && template && <CustomiseControls template={template} />}
      </div>
    </aside>
  );
};
