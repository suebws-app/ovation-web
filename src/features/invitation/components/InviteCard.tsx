"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { InvitationTemplate } from "@/lib/api/types";
import { resolveFontStack } from "../invitationTemplates";

type InviteCardValues = {
  partnerA: string;
  partnerB: string;
  dateLabel?: string;
  time?: string;
  venue?: string;
  place?: string;
  message?: string;
};

type InviteCardSize = "compact" | "large";

type InviteCardProps = {
  template: InvitationTemplate;
  values: InviteCardValues;
  guestFirstName?: string;
  size?: InviteCardSize;
};

type CSSSize = number | string;

const SIZE_TOKENS: Record<
  InviteCardSize,
  {
    ornament: CSSSize;
    eyebrow: CSSSize;
    eyebrowTracking: CSSSize;
    name: CSSSize;
    divider: CSSSize;
    date: CSSSize;
    dateTracking: CSSSize;
    message: CSSSize;
    messageMaxWidth: CSSSize;
    venueLabel: CSSSize;
    venueLabelTracking: CSSSize;
    venueName: CSSSize;
    padding: string;
  }
> = {
  compact: {
    ornament: 18,
    eyebrow: 10,
    eyebrowTracking: 3,
    name: 26,
    divider: 56,
    date: 11,
    dateTracking: 2,
    message: 12,
    messageMaxWidth: 220,
    venueLabel: 10,
    venueLabelTracking: 2,
    venueName: 14,
    padding: "p-6",
  },
  large: {
    ornament: "clamp(20px, 4vw, 32px)",
    eyebrow: "clamp(11px, 1.6vw, 14px)",
    eyebrowTracking: "clamp(3px, 0.5vw, 5px)",
    name: "clamp(30px, 7vw, 56px)",
    divider: "clamp(56px, 12vw, 96px)",
    date: "clamp(12px, 1.8vw, 16px)",
    dateTracking: "clamp(2px, 0.35vw, 3px)",
    message: "clamp(13px, 2vw, 18px)",
    messageMaxWidth: "min(380px, 70vw)",
    venueLabel: "clamp(11px, 1.6vw, 14px)",
    venueLabelTracking: "clamp(2px, 0.35vw, 3px)",
    venueName: "clamp(15px, 2.6vw, 24px)",
    padding: "p-5 tablet:p-8 desktop:p-10",
  },
};

const CornerOrnament = ({
  kind,
  color,
}: {
  kind: string | null;
  color: string;
}) => {
  if (kind === "floral") {
    return (
      <svg width="56" height="56" viewBox="0 0 80 80" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="6" fill={color} opacity="0.7" />
        <circle cx="35" cy="14" r="4" fill={color} opacity="0.5" />
        <circle cx="14" cy="35" r="4" fill={color} opacity="0.5" />
        <path
          d="M8 8 Q 20 24, 40 12"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M8 8 Q 24 20, 12 40"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
        />
        <circle cx="50" cy="22" r="2.5" fill={color} opacity="0.45" />
        <circle cx="22" cy="50" r="2.5" fill={color} opacity="0.45" />
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg width="60" height="56" viewBox="0 0 90 80" fill="none" aria-hidden>
        <path
          d="M0 18 Q 25 8, 45 30 T 88 28"
          stroke={color}
          strokeWidth="1.4"
          fill="none"
          opacity="0.7"
        />
        <path d="M14 22 L 18 19 L 22 24 Z" fill={color} opacity="0.55" />
        <path d="M40 30 L 44 26 L 48 32 Z" fill={color} opacity="0.55" />
        <path d="M60 28 L 64 24 L 68 30 Z" fill={color} opacity="0.55" />
      </svg>
    );
  }
  if (kind === "deco") {
    return (
      <svg width="48" height="48" viewBox="0 0 70 70" fill="none" aria-hidden>
        <path d="M2 2 L 60 2" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M2 2 L 2 60" stroke={color} strokeWidth="1.5" fill="none" />
        <path
          d="M6 6 L 40 6"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M6 6 L 6 40"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M2 2 L 24 24"
          stroke={color}
          strokeWidth="0.6"
          fill="none"
          opacity="0.55"
        />
      </svg>
    );
  }
  return null;
};

export const InviteCard = ({
  template,
  values,
  guestFirstName,
  size = "compact",
}: InviteCardProps) => {
  const {
    pageBg,
    cardBg,
    cardBorder,
    textColor,
    mutedColor,
    accentColor,
    monogramAmp,
    ornamentSymbol,
    cornerOrnament,
  } = template;
  const displayFont = resolveFontStack(template.displayFontKey);
  const bodyFont = resolveFontStack(template.bodyFontKey);
  const s = SIZE_TOKENS[size];

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center p-4 select-none"
      style={{ background: pageBg }}
    >
      <div
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-between gap-4 overflow-hidden",
          s.padding,
        )}
        style={{
          background: cardBg,
          border: cardBorder !== "none" ? cardBorder : undefined,
          color: textColor,
        }}
      >
        {cornerOrnament && (
          <>
            <div className="absolute top-2 left-2">
              <CornerOrnament kind={cornerOrnament} color={accentColor} />
            </div>
            <div className="absolute top-2 right-2 scale-x-[-1]">
              <CornerOrnament kind={cornerOrnament} color={accentColor} />
            </div>
            <div className="absolute bottom-2 left-2 scale-y-[-1]">
              <CornerOrnament kind={cornerOrnament} color={accentColor} />
            </div>
            <div className="absolute right-2 bottom-2 -scale-100">
              <CornerOrnament kind={cornerOrnament} color={accentColor} />
            </div>
          </>
        )}

        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          {ornamentSymbol && (
            <span
              style={{
                color: accentColor,
                fontSize: s.ornament,
                lineHeight: 1,
              }}
            >
              {ornamentSymbol}
            </span>
          )}
          <span
            className="uppercase"
            style={{
              color: mutedColor,
              fontFamily: bodyFont,
              fontSize: s.eyebrow,
              letterSpacing: s.eyebrowTracking,
            }}
          >
            {guestFirstName ? `Dear ${guestFirstName}` : "You are invited"}
          </span>

          <h2
            className="px-2 leading-tight"
            style={{
              fontFamily: displayFont,
              color: textColor,
              fontSize: s.name,
            }}
          >
            {values.partnerA || "Lila"}
            <span
              className="mx-2 italic"
              style={{ color: accentColor, fontFamily: displayFont }}
            >
              {monogramAmp}
            </span>
            {values.partnerB || "Theo"}
          </h2>

          <span
            className="block h-px"
            style={{ background: accentColor, width: s.divider }}
            aria-hidden
          />

          <p
            className="uppercase"
            style={{
              color: mutedColor,
              fontFamily: bodyFont,
              fontSize: s.date,
              letterSpacing: s.dateTracking,
            }}
          >
            {values.dateLabel || "12 September 2026"}
            {values.time ? ` · ${values.time}` : ""}
          </p>

          {values.message && (
            <p
              className="leading-relaxed italic"
              style={{
                color: mutedColor,
                fontFamily: bodyFont,
                fontSize: s.message,
                maxWidth: s.messageMaxWidth,
              }}
            >
              {values.message}
            </p>
          )}

          {values.venue && (
            <div>
              <p
                className="uppercase"
                style={{
                  color: mutedColor,
                  fontFamily: bodyFont,
                  fontSize: s.venueLabel,
                  letterSpacing: s.venueLabelTracking,
                }}
              >
                Venue
              </p>
              <p
                className="mt-1 italic"
                style={{
                  fontFamily: displayFont,
                  color: textColor,
                  fontSize: s.venueName,
                }}
              >
                {values.venue}
              </p>
              {values.place && (
                <p
                  style={{
                    color: mutedColor,
                    fontFamily: bodyFont,
                    fontSize: s.venueLabel,
                  }}
                >
                  {values.place}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
