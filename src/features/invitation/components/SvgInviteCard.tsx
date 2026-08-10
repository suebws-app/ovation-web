"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { InvitationTemplate } from "@/lib/api/types";
import { ordinalAge } from "@/lib/event-types/format";
import { resolveFontStack } from "../invitationTemplates";
import { useFitText } from "./useFitText";

type SvgInviteCardSize = "compact" | "large";

type SvgInviteCardValues = {
  partnerA: string;
  partnerB: string;
  title?: string;
  eventName?: string;
  postfix?: string;
  dateLabel?: string;
  time?: string;
  venue?: string;
  place?: string;
  message?: string;
  greeting?: string;
  age?: number;
};

type SvgInviteCardProps = {
  template: InvitationTemplate;
  values: SvgInviteCardValues;
  guestFirstName?: string;
  size?: SvgInviteCardSize;
  animate?: boolean;
  accentColor?: string;
  displayFontKey?: string;
  bodyFontKey?: string;
};

const NAME_FIT: Record<SvgInviteCardSize, { max: number; min: number }> = {
  compact: { max: 20, min: 8 },
  large: { max: 52, min: 12 },
};

const SIZE_TOKENS: Record<
  SvgInviteCardSize,
  {
    eyebrow: number | string;
    eyebrowTracking: number | string;
    divider: number | string;
    date: number | string;
    dateTracking: number | string;
    message: number | string;
    messageMaxWidth: number | string;
    venueLabel: number | string;
    venueLabelTracking: number | string;
    venueName: number | string;
    gap: string;
  }
> = {
  compact: {
    eyebrow: "clamp(6px, 2.6cqw, 10px)",
    eyebrowTracking: "clamp(1px, 0.6cqw, 2.5px)",
    divider: "clamp(24px, 12cqw, 44px)",
    date: "clamp(6px, 2.6cqw, 10px)",
    dateTracking: "clamp(1px, 0.4cqw, 1.5px)",
    message: "clamp(6px, 2.6cqw, 10px)",
    messageMaxWidth: "90%",
    venueLabel: "clamp(6px, 2.4cqw, 9px)",
    venueLabelTracking: "clamp(1px, 0.4cqw, 1.5px)",
    venueName: "clamp(7px, 3cqw, 12px)",
    gap: "gap-1",
  },
  large: {
    eyebrow: "clamp(11px, 4cqw, 16px)",
    eyebrowTracking: "clamp(2px, 0.9cqw, 4.5px)",
    divider: "clamp(52px, 22cqw, 88px)",
    date: "clamp(12px, 4.4cqw, 18px)",
    dateTracking: "clamp(1.5px, 0.7cqw, 3px)",
    message: "clamp(13px, 4.4cqw, 19px)",
    messageMaxWidth: "84%",
    venueLabel: "clamp(11px, 4cqw, 16px)",
    venueLabelTracking: "clamp(1.5px, 0.7cqw, 3px)",
    venueName: "clamp(16px, 5.8cqw, 28px)",
    gap: "gap-3",
  },
};

export const SvgInviteCard = ({
  template,
  values,
  guestFirstName,
  size = "large",
  animate = false,
  accentColor,
  displayFontKey,
  bodyFontKey,
}: SvgInviteCardProps) => {
  const accent = accentColor ?? template.accentColor;
  const displayFont = resolveFontStack(
    displayFontKey ?? template.displayFontKey,
  );
  const bodyFont = resolveFontStack(bodyFontKey ?? template.bodyFontKey);
  const s = SIZE_TOKENS[size];
  const insetTop = template.artInsetTop ?? 28;
  const insetBottom = template.artInsetBottom ?? 26;
  const isSplit = template.artLayout === "split";
  const isLargeSize = size === "large";
  const nameColor = template.artNameColor ?? template.textColor;
  const dateColor = template.artDateColor ?? template.mutedColor;
  const detailFont = template.artDetailFontKey
    ? resolveFontStack(template.artDetailFontKey)
    : null;
  const dateFont = detailFont ?? bodyFont;
  const venueFont = detailFont ?? (isSplit ? bodyFont : displayFont);
  const venueNameSize = !isSplit
    ? s.venueName
    : isLargeSize
      ? "clamp(9px, 3cqw, 14px)"
      : "clamp(7px, 3.4cqw, 12px)";
  const dateSize = isSplit
    ? isLargeSize
      ? "clamp(11px, 4.4cqw, 22px)"
      : "clamp(6px, 3cqw, 11px)"
    : s.date;
  const messageSize = isSplit
    ? isLargeSize
      ? "clamp(9px, 3.4cqw, 15px)"
      : "clamp(6px, 2.6cqw, 10px)"
    : s.message;
  const artUrl = `/invitation-art/${template.artSvg}`;
  const cardIsGradient = template.cardBg.includes("gradient");
  const isTiger = template.id === "tiger_shower";
  const isGilded = template.id === "gilded_peony";
  const textBg = cardIsGradient
    ? "rgba(255,255,255,0.62)"
    : `color-mix(in srgb, ${template.cardBg} 62%, transparent)`;
  const textBgBase = isTiger
    ? {
        background: textBg,
        borderRadius: 12,
        padding: "2px 10px",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }
    : undefined;
  const textBgStyle = textBgBase
    ? { ...textBgBase, display: "inline-block" }
    : undefined;
  const ageBgStyle = isGilded
    ? {
        background: template.artPanelColor ?? textBg,
        borderRadius: 14,
        padding: "2px 14px",
        display: "inline-block",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }
    : undefined;
  const cardBgImage = cardIsGradient
    ? `url("${artUrl}"), ${template.cardBg}`
    : `url("${artUrl}")`;

  const nameMax =
    size === "large" && template.artNameMax
      ? template.artNameMax
      : NAME_FIT[size].max;
  const {
    containerRef,
    textRef: nameRef,
    fontSize: nameFontSize,
  } = useFitText<HTMLHeadingElement>({
    maxPx: nameMax,
    minPx: NAME_FIT[size].min,
    deps: [
      values.title,
      values.eventName,
      values.partnerA,
      values.partnerB,
      template.monogramAmp,
      size,
    ],
  });

  const eyebrowEl = (
    <span
      className="uppercase"
      style={{
        color: template.mutedColor,
        fontFamily: bodyFont,
        fontSize: s.eyebrow,
        letterSpacing: s.eyebrowTracking,
        marginTop: template.artCelebrantTier ? "-10px" : undefined,
        ...textBgStyle,
      }}
    >
      {guestFirstName
        ? `${values.greeting?.trim() || "Dear"} ${guestFirstName}`
        : (template.artEyebrowText ?? "You are invited")}
    </span>
  );

  const bigLine = values.title || values.eventName || values.postfix;
  const namesEl = template.artCelebrantTier ? (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5",
        isTiger && "w-fit self-center",
      )}
      style={{ marginTop: "5cqh", ...textBgBase }}
    >
      <span
        style={{
          fontFamily: displayFont,
          color: nameColor,
          fontSize: nameFontSize * 0.62,
        }}
      >
        {values.partnerA || "Lila"}
      </span>
      <h2
        ref={nameRef}
        className="leading-tight whitespace-nowrap"
        style={{
          fontFamily: displayFont,
          color: nameColor,
          fontSize: nameFontSize,
        }}
      >
        {bigLine || `${values.partnerA || "Lila"}'s Party`}
      </h2>
    </div>
  ) : (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        isTiger && "w-fit self-center",
      )}
      style={textBgBase}
    >
      <h2
        ref={nameRef}
        className="leading-tight whitespace-nowrap"
        style={{
          fontFamily: displayFont,
          color: nameColor,
          fontSize: nameFontSize,
        }}
      >
        {values.title || values.eventName ? (
          values.title || values.eventName
        ) : values.partnerB ? (
          <>
            {values.partnerA || "Lila"}
            <span
              className="mx-2 italic"
              style={{ color: accent, fontFamily: displayFont }}
            >
              {template.monogramAmp}
            </span>
            {values.partnerB}
          </>
        ) : (
          values.partnerA || "Lila"
        )}
      </h2>
      {values.postfix && !values.title && !values.eventName && (
        <span
          className="italic"
          style={{
            fontFamily: displayFont,
            color: accent,
            fontSize: nameFontSize * 0.48,
          }}
        >
          {values.postfix}
        </span>
      )}
    </div>
  );

  const ageEl =
    typeof values.age === "number" ? (
      <p
        className="text-center"
        style={{
          fontFamily: displayFont,
          color: nameColor,
          fontSize: isTiger
            ? "clamp(14px, 9cqw, 44px)"
            : isGilded
              ? "clamp(22px, 10cqw, 48px)"
              : isSplit
                ? "clamp(38px, 15cqw, 72px)"
                : "clamp(30px, 12cqw, 60px)",
          marginTop: isTiger ? "-5px" : undefined,
          ...textBgStyle,
          ...ageBgStyle,
        }}
      >
        {ordinalAge(values.age)}
      </p>
    ) : null;

  const dividerEl = (
    <span
      className="block h-px"
      style={{ background: accent, width: s.divider }}
      aria-hidden
    />
  );

  const dateEl = (
    <p
      className="max-w-full uppercase"
      style={{
        color: dateColor,
        fontFamily: dateFont,
        fontSize: dateSize,
        fontWeight: isSplit ? 700 : undefined,
        letterSpacing: s.dateTracking,
        ...textBgStyle,
      }}
    >
      {values.dateLabel || "12 September 2026"}
      {values.time ? ` · ${values.time}` : ""}
    </p>
  );

  const messageEl = values.message ? (
    <p
      className="leading-relaxed italic"
      style={{
        color: template.mutedColor,
        fontFamily: bodyFont,
        fontSize: messageSize,
        maxWidth: s.messageMaxWidth,
        ...textBgStyle,
      }}
    >
      {values.message}
    </p>
  ) : null;

  const venueEl = values.venue ? (
    <div className={cn(isTiger && "w-fit self-center")} style={textBgBase}>
      {!template.artHideVenueLabel && (
        <p
          className="uppercase"
          style={{
            color: template.mutedColor,
            fontFamily: bodyFont,
            fontSize: s.venueLabel,
            letterSpacing: s.venueLabelTracking,
          }}
        >
          Venue
        </p>
      )}
      <p
        className={cn(
          "mt-0.5 max-w-full break-words",
          isSplit ? "font-semibold uppercase" : "italic",
        )}
        style={{
          fontFamily: venueFont,
          color: template.textColor,
          fontSize: venueNameSize,
          letterSpacing: isSplit ? s.venueLabelTracking : undefined,
        }}
      >
        {values.venue}
      </p>
      {values.place && (
        <p
          style={{
            color: template.mutedColor,
            fontFamily: bodyFont,
            fontSize: s.venueLabel,
          }}
        >
          {values.place}
        </p>
      )}
    </div>
  ) : null;

  const zoneClass = cn(
    "absolute inset-x-0 flex flex-col items-center px-8 text-center",
    s.gap,
    animate && "invite-stagger",
  );
  const panelClass = cn(
    "flex w-fit flex-col items-center backdrop-blur-sm",
    isLargeSize
      ? "rounded-16 gap-1.5 px-4 py-2.5"
      : "rounded-12 gap-1 px-3 py-1.5",
    !isLargeSize && s.gap,
  );
  const panelClassSm = cn(
    "flex w-fit flex-col items-center gap-0.5 backdrop-blur-sm",
    isLargeSize ? "rounded-12 px-3.5 py-1.5" : "rounded-8 px-2.5 py-1",
  );
  const panelStyle = {
    background: template.artPanelColor,
    maxWidth: isLargeSize ? "90%" : "96%",
  };
  const panelStyleSm = {
    background: template.artPanelColor,
    maxWidth: isLargeSize ? "82%" : "92%",
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 select-none"
      style={{
        background: template.pageBg,
        ["--inv-accent" as string]: accent,
      }}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          animate && "animate-invite-card-in",
        )}
        style={{
          aspectRatio: "5 / 7",
          maxHeight: "100%",
          backgroundColor: cardIsGradient ? undefined : template.cardBg,
          backgroundImage: cardBgImage,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          containerType: "size",
        }}
      >
        {isSplit ? (
          <>
            <div
              ref={containerRef}
              className={zoneClass}
              style={{ top: `${insetTop}%`, color: template.textColor }}
            >
              {eyebrowEl}
              {namesEl}
              {ageEl}
              {dividerEl}
            </div>
            <div
              className={zoneClass}
              style={{ bottom: `${insetBottom}%`, color: template.textColor }}
            >
              {template.artPanelColor ? (
                <>
                  <div className={panelClass} style={panelStyle}>
                    {dateEl}
                    {messageEl}
                  </div>
                  {venueEl && (
                    <div className={panelClassSm} style={panelStyleSm}>
                      {venueEl}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {dateEl}
                  {messageEl}
                  {venueEl}
                </>
              )}
            </div>
          </>
        ) : (
          <div
            ref={containerRef}
            className={cn(zoneClass, "justify-center")}
            style={{
              top: `${insetTop}%`,
              bottom: `${insetBottom}%`,
              color: template.textColor,
              ...(template.artStackGap ? { gap: template.artStackGap } : {}),
            }}
          >
            {eyebrowEl}
            {namesEl}
            {ageEl}
            {dividerEl}
            {dateEl}
            {messageEl}
            {venueEl}
          </div>
        )}
      </div>
    </div>
  );
};
