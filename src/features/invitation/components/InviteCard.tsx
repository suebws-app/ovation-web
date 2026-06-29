"use client";

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

type InviteCardProps = {
  template: InvitationTemplate;
  values: InviteCardValues;
  guestFirstName?: string;
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

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center p-4"
      style={{ background: pageBg }}
    >
      <div
        className="relative flex h-full w-full flex-col items-center justify-between p-6"
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
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              {ornamentSymbol}
            </span>
          )}
          <span
            className="text-[10px] tracking-[3px] uppercase"
            style={{ color: mutedColor, fontFamily: bodyFont }}
          >
            {guestFirstName ? `Dear ${guestFirstName}` : "You are invited"}
          </span>

          <h2
            className="px-2 text-[26px] leading-tight"
            style={{ fontFamily: displayFont, color: textColor }}
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
            className="block h-px w-14"
            style={{ background: accentColor }}
            aria-hidden
          />

          <p
            className="text-[11px] tracking-[2px] uppercase"
            style={{ color: mutedColor, fontFamily: bodyFont }}
          >
            {values.dateLabel || "12 September 2026"}
            {values.time ? ` · ${values.time}` : ""}
          </p>

          {values.message && (
            <p
              className="max-w-[220px] text-[12px] leading-relaxed italic"
              style={{ color: mutedColor, fontFamily: bodyFont }}
            >
              {values.message}
            </p>
          )}

          {values.venue && (
            <div>
              <p
                className="text-[10px] tracking-[2px] uppercase"
                style={{ color: mutedColor, fontFamily: bodyFont }}
              >
                Venue
              </p>
              <p
                className="mt-1 text-[14px] italic"
                style={{ fontFamily: displayFont, color: textColor }}
              >
                {values.venue}
              </p>
              {values.place && (
                <p
                  className="text-[10px]"
                  style={{ color: mutedColor, fontFamily: bodyFont }}
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
