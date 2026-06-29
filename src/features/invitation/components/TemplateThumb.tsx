"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { InvitationTemplate } from "@/lib/api/types";
import { resolveFontStack } from "../invitationTemplates";

type TemplateThumbProps = {
  template: InvitationTemplate;
  active: boolean;
  partnerA: string;
  partnerB: string;
  onSelect: (id: string) => void;
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
      <svg width="36" height="36" viewBox="0 0 80 80" fill="none" aria-hidden>
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
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg width="40" height="36" viewBox="0 0 90 80" fill="none" aria-hidden>
        <path
          d="M0 18 Q 25 8, 45 30 T 88 28"
          stroke={color}
          strokeWidth="1.4"
          fill="none"
          opacity="0.7"
        />
        <path d="M14 22 L 18 19 L 22 24 Z" fill={color} opacity="0.55" />
        <path d="M40 30 L 44 26 L 48 32 Z" fill={color} opacity="0.55" />
      </svg>
    );
  }
  if (kind === "deco") {
    return (
      <svg width="32" height="32" viewBox="0 0 70 70" fill="none" aria-hidden>
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
      </svg>
    );
  }
  return null;
};

export const TemplateThumb = ({
  template,
  active,
  partnerA,
  partnerB,
  onSelect,
}: TemplateThumbProps) => {
  const displayFont = resolveFontStack(template.displayFontKey);
  const bodyFont = resolveFontStack(template.bodyFontKey);

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={cn(
        "rounded-12 group relative flex aspect-3/4 flex-col items-center justify-between overflow-hidden border-2 p-3 text-center transition-all",
        active
          ? "border-primary shadow-md"
          : "border-border hover:border-foreground/30",
      )}
      style={{
        background: template.pageBg,
      }}
    >
      <div
        className="relative flex h-full w-full flex-col items-center justify-between p-2"
        style={{
          background: template.cardBg,
          border:
            template.cardBorder !== "none" ? template.cardBorder : undefined,
        }}
      >
        {template.cornerOrnament && (
          <>
            <div className="absolute top-1 left-1">
              <CornerOrnament
                kind={template.cornerOrnament}
                color={template.accentColor}
              />
            </div>
            <div className="absolute top-1 right-1 scale-x-[-1]">
              <CornerOrnament
                kind={template.cornerOrnament}
                color={template.accentColor}
              />
            </div>
          </>
        )}

        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2">
          {template.ornamentSymbol && (
            <span
              style={{
                color: template.accentColor,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              {template.ornamentSymbol}
            </span>
          )}
          <span
            className="text-[8px] tracking-[2px] uppercase"
            style={{
              color: template.mutedColor,
              fontFamily: bodyFont,
            }}
          >
            You are invited
          </span>
          <span
            className="text-base leading-tight"
            style={{
              color: template.textColor,
              fontFamily: displayFont,
            }}
          >
            {partnerA || "Lila"}{" "}
            <span
              style={{
                color: template.accentColor,
                fontStyle: "italic",
              }}
            >
              {template.monogramAmp}
            </span>{" "}
            {partnerB || "Theo"}
          </span>
          <span
            className="block h-px w-8"
            style={{ background: template.accentColor }}
          />
        </div>

        <span
          className="type-caption block w-full truncate text-center font-semibold"
          style={{
            color: template.textColor,
            fontFamily: bodyFont,
            fontSize: 9,
          }}
        >
          {template.name}
        </span>
      </div>
    </button>
  );
};
