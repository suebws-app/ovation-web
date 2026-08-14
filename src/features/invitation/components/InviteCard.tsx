"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { InvitationTemplate } from "@/lib/api/types";
import { resolveFontStack } from "../invitationTemplates";
import { SvgInviteCard } from "./SvgInviteCard";
import { useFitText } from "./useFitText";

// Largest / smallest name font size (px) per card size. The name shrinks from
// the max down toward the min so long couple names never exceed the card width.
const NAME_FIT: Record<InviteCardSize, { max: number; min: number }> = {
  compact: { max: 26, min: 9 },
  large: { max: 56, min: 12 },
};

type InviteCardValues = {
  partnerA: string;
  partnerB: string;
  // Single-line override (a typed Event Name); rendered alone when set.
  title?: string;
  // Legacy explicit event title (kept for back-compat with `title`).
  eventName?: string;
  // The event word shown on a second tier below the names (e.g. "Anniversary").
  postfix?: string;
  // Type-specific line under the names (e.g. "Together since 2010", "1950 – 2020").
  subtitle?: string;
  // Optional logo (public image URL) shown at the top of the card (corporate).
  logo?: string;
  dateLabel?: string;
  time?: string;
  venue?: string;
  place?: string;
  message?: string;
  greeting?: string;
  age?: number;
};

type InviteCardSize = "compact" | "large";

type InviteCardProps = {
  template: InvitationTemplate;
  values: InviteCardValues;
  guestFirstName?: string;
  size?: InviteCardSize;
  animate?: boolean;
  padded?: boolean;
  pageBg?: string;
  cardBg?: string;
  textColor?: string;
  mutedColor?: string;
  accentColor?: string;
  textScale?: number;
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
    ornament: "clamp(12px, 6cqw, 18px)",
    eyebrow: "clamp(6px, 3.3cqw, 10px)",
    eyebrowTracking: "clamp(1px, 0.9cqw, 3px)",
    name: 26,
    divider: "clamp(28px, 18cqw, 56px)",
    date: "clamp(7px, 3.6cqw, 11px)",
    dateTracking: "clamp(1px, 0.6cqw, 2px)",
    message: "clamp(8px, 4cqw, 12px)",
    messageMaxWidth: "90%",
    venueLabel: "clamp(6px, 3.3cqw, 10px)",
    venueLabelTracking: "clamp(1px, 0.6cqw, 2px)",
    venueName: "clamp(9px, 4.6cqw, 14px)",
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
  animate = false,
  padded = false,
  pageBg,
  cardBg,
  textColor,
  mutedColor,
  accentColor,
  textScale,
}: InviteCardProps) => {
  const { cardBorder, monogramAmp, ornamentSymbol, cornerOrnament } = template;
  const displayFont = resolveFontStack(template.displayFontKey);
  const bodyFont = resolveFontStack(template.bodyFontKey);
  const ts = textScale ?? 1;
  const scale = (v: number | string): number | string =>
    typeof v === "number" ? v * ts : `calc(${v} * ${ts})`;
  const effectivePageBg = pageBg?.trim() ? pageBg : template.pageBg;
  const effectiveCardBg = cardBg?.trim() ? cardBg : template.cardBg;
  const effectiveTextColor = textColor?.trim() ? textColor : template.textColor;
  const effectiveMutedColor = mutedColor?.trim()
    ? mutedColor
    : template.mutedColor;
  const effectiveAccentColor = accentColor?.trim()
    ? accentColor
    : template.accentColor;
  const s = SIZE_TOKENS[size];

  const {
    containerRef,
    textRef: nameRef,
    fontSize: nameFontSize,
  } = useFitText<HTMLHeadingElement>({
    maxPx: NAME_FIT[size].max,
    minPx: NAME_FIT[size].min,
    deps: [
      values.title,
      values.eventName,
      values.partnerA,
      values.partnerB,
      monogramAmp,
      size,
    ],
  });

  if (template.artSvg) {
    return (
      <SvgInviteCard
        template={template}
        values={values}
        guestFirstName={guestFirstName}
        size={size}
        animate={animate}
        padded={padded}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center select-none",
        padded && "p-6",
      )}
      style={{ background: effectivePageBg }}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative flex aspect-5/7 max-h-full w-full flex-col items-center justify-between gap-4 overflow-hidden",
          s.padding,
          animate && "animate-invite-card-in",
        )}
        style={{
          background: effectiveCardBg,
          border: cardBorder !== "none" ? cardBorder : undefined,
          color: effectiveTextColor,
          containerType: "size",
        }}
      >
        {values.logo && (
          <img
            src={values.logo}
            alt=""
            className="absolute left-1/2 z-10 w-auto max-w-[40%] -translate-x-1/2 object-contain"
            style={{ top: "5cqh", maxHeight: "13cqh" }}
          />
        )}
        {cornerOrnament && (
          <>
            <div className="absolute top-2 left-2">
              <CornerOrnament
                kind={cornerOrnament}
                color={effectiveAccentColor}
              />
            </div>
            <div className="absolute top-2 right-2 scale-x-[-1]">
              <CornerOrnament
                kind={cornerOrnament}
                color={effectiveAccentColor}
              />
            </div>
            <div className="absolute bottom-2 left-2 scale-y-[-1]">
              <CornerOrnament
                kind={cornerOrnament}
                color={effectiveAccentColor}
              />
            </div>
            <div className="absolute right-2 bottom-2 -scale-100">
              <CornerOrnament
                kind={cornerOrnament}
                color={effectiveAccentColor}
              />
            </div>
          </>
        )}

        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-4 text-center",
            animate && "invite-stagger",
          )}
          // Reserve room for the absolutely-positioned logo so it never overlaps
          // the name on short (phone) cards.
          style={values.logo ? { paddingTop: "18cqh" } : undefined}
        >
          {ornamentSymbol && (
            <span
              style={{
                color: effectiveAccentColor,
                fontSize: scale(s.ornament),
                lineHeight: 1,
              }}
            >
              {ornamentSymbol}
            </span>
          )}
          <span
            className="uppercase"
            style={{
              color: effectiveMutedColor,
              fontFamily: bodyFont,
              fontSize: scale(s.eyebrow),
              letterSpacing: scale(s.eyebrowTracking),
            }}
          >
            {guestFirstName
              ? `${values.greeting?.trim() || "Dear"} ${guestFirstName}`
              : "You are invited"}
          </span>

          <div className="flex max-w-full flex-col items-center gap-1">
            <h2
              ref={nameRef}
              className="max-w-full px-6 leading-tight whitespace-nowrap"
              style={{
                fontFamily: displayFont,
                color: effectiveTextColor,
                fontSize: nameFontSize * ts,
              }}
            >
              {values.title || values.eventName ? (
                values.title || values.eventName
              ) : values.partnerB ? (
                <>
                  {values.partnerA}
                  <span
                    className="mx-2 italic"
                    style={{
                      color: effectiveAccentColor,
                      fontFamily: displayFont,
                    }}
                  >
                    {monogramAmp}
                  </span>
                  {values.partnerB}
                </>
              ) : (
                values.partnerA
              )}
            </h2>
            {values.postfix && !values.title && !values.eventName && (
              <span
                className="italic"
                style={{
                  fontFamily: displayFont,
                  color: effectiveAccentColor,
                  fontSize: nameFontSize * 0.48 * ts,
                }}
              >
                {values.postfix}
              </span>
            )}
            {values.subtitle && (
              <span
                className="italic"
                style={{
                  fontFamily: displayFont,
                  color: effectiveTextColor,
                  fontSize: nameFontSize * 0.52 * ts,
                }}
              >
                {values.subtitle}
              </span>
            )}
          </div>

          <span
            className="block h-px"
            style={{
              background: effectiveAccentColor,
              width: scale(s.divider),
            }}
            aria-hidden
          />

          <p
            className="uppercase"
            style={{
              color: effectiveMutedColor,
              fontFamily: bodyFont,
              fontSize: scale(s.date),
              letterSpacing: scale(s.dateTracking),
            }}
          >
            {values.dateLabel}
            {values.time ? ` · ${values.time}` : ""}
          </p>

          {values.message && (
            <p
              className="leading-relaxed italic"
              style={{
                color: effectiveMutedColor,
                fontFamily: bodyFont,
                fontSize: scale(s.message),
                maxWidth: scale(s.messageMaxWidth),
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
                  color: effectiveMutedColor,
                  fontFamily: bodyFont,
                  fontSize: scale(s.venueLabel),
                  letterSpacing: scale(s.venueLabelTracking),
                }}
              >
                Venue
              </p>
              <p
                className="mt-1 italic"
                style={{
                  fontFamily: displayFont,
                  color: effectiveTextColor,
                  fontSize: scale(s.venueName),
                }}
              >
                {values.venue}
              </p>
              {values.place && (
                <p
                  style={{
                    color: effectiveMutedColor,
                    fontFamily: bodyFont,
                    fontSize: scale(s.venueLabel),
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
