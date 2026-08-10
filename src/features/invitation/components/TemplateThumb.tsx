"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { SwatchIcon } from "@ovation/icons/SwatchIcon";
import type { InvitationTemplate } from "@/lib/api/types";
import { resolveFontStack } from "../invitationTemplates";

type TemplateThumbProps = {
  template: InvitationTemplate;
  active: boolean;
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
  onSelect,
}: TemplateThumbProps) => {
  const t = useTranslations();
  const bodyFont = resolveFontStack(template.bodyFontKey);

  const customisableBadge = (
    <span
      aria-label={t("invitation__thumb__customisable")}
      title={t("invitation__thumb__customisable")}
      className="bg-background/85 absolute top-1.5 right-1.5 z-10 flex size-4.5 items-center justify-center rounded-full shadow-sm"
    >
      <SwatchIcon
        width={11}
        height={11}
        colors={["#EF4444", "#22C55E", "#3B82F6"]}
      />
    </span>
  );

  const nameLabel = (
    <span
      className="type-caption absolute inset-x-0 bottom-1 truncate px-2 text-center font-semibold"
      style={{ color: template.textColor, fontFamily: bodyFont, fontSize: 9 }}
    >
      {template.name}
    </span>
  );

  const activeCls = active
    ? "border-primary shadow-md"
    : "border-border hover:border-foreground/30";

  if (template.artSvg) {
    return (
      <button
        type="button"
        onClick={() => onSelect(template.id)}
        className={cn(
          "rounded-12 group relative aspect-3/4 overflow-hidden border-2 transition-all",
          activeCls,
        )}
        style={{ background: template.cardBg }}
      >
        <Image
          src={`/invitation-art/${template.artSvg}`}
          alt={template.name}
          fill
          unoptimized
          className="object-cover"
        />
        {nameLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={cn(
        "rounded-12 group relative aspect-3/4 overflow-hidden border-2 p-3 transition-all",
        activeCls,
      )}
      style={{ background: template.pageBg }}
    >
      <div
        className="relative h-full w-full"
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
            <div className="absolute bottom-1 left-1 scale-y-[-1]">
              <CornerOrnament
                kind={template.cornerOrnament}
                color={template.accentColor}
              />
            </div>
            <div className="absolute right-1 bottom-1 -scale-100">
              <CornerOrnament
                kind={template.cornerOrnament}
                color={template.accentColor}
              />
            </div>
          </>
        )}
        {template.ornamentSymbol && (
          <span
            className="absolute top-3 left-1/2 -translate-x-1/2"
            style={{ color: template.accentColor, fontSize: 16, lineHeight: 1 }}
          >
            {template.ornamentSymbol}
          </span>
        )}
      </div>
      {customisableBadge}
      {nameLabel}
    </button>
  );
};
