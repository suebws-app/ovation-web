"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { XIcon } from "@ovation/icons/XIcon";
import { AvailableBadge } from "./AvailableBadge";
import { UrlSuggestionChip } from "./UrlSuggestionChip";
import type { SlugStatus } from "@/features/create/hooks/useSlugChecker";
import { clientEnv as env } from "@/lib/utils/env.client";

type SlugInputProps = {
  value: string;
  status: SlugStatus;
  badgeKind?: "available" | "suggested";
  suggestions: string[];
  suggestionsLoading: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onSuggestionClick: (slug: string) => void;
};

const SKELETON_WIDTHS = ["w-28", "w-36", "w-24", "w-32"];

export const SlugInput = ({
  value,
  status,
  badgeKind = "available",
  suggestions,
  suggestionsLoading,
  placeholder,
  onChange,
  onSuggestionClick,
}: SlugInputProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="min-w-0">
      <div className="rounded-16 border-border bg-background focus-within:ring-ring tablet:px-4 tablet:py-3 flex min-w-0 items-center gap-2 border px-3 py-2.5 transition-colors focus-within:ring-2">
        <span className="type-body-small text-muted-foreground min-w-0 shrink truncate font-mono">
          {env.APP_URL} /
        </span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={value}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder={placeholder}
          className="type-body-small text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-medium outline-none placeholder:font-normal"
        />
        {status === "available" && (
          <AvailableBadge
            label={
              badgeKind === "suggested"
                ? t("signup__claim__suggested")
                : t("signup__claim__available")
            }
            tone={badgeKind === "suggested" ? "warning" : "success"}
          />
        )}
        {status === "checking" && (
          <span className="type-caption text-muted-foreground">
            {t("signup__claim__checking")}
          </span>
        )}
        {status === "taken" && (
          <span className="type-caption text-destructive font-semibold">
            {t("signup__claim__taken")}
          </span>
        )}
        {status === "invalid" && (
          <span className="type-caption text-destructive font-semibold">
            {t("signup__claim__invalid")}
          </span>
        )}
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("signup__claim__clear")}
            className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer transition-colors"
          >
            <XIcon width={12} height={12} strokeWidth={1.8} />
          </button>
        )}
      </div>

      <div className="tablet:mt-3 tablet:min-h-20 mt-2 min-h-0">
        {!suggestionsLoading && suggestions.length > 0 && (
          <p className="type-caption text-muted-foreground mb-2 font-normal italic">
            {t("signup__claim__select_option")}
          </p>
        )}
        <div className="flex flex-wrap content-start gap-2">
          {suggestionsLoading
            ? SKELETON_WIDTHS.map((w, i) => (
                <div
                  key={i}
                  className={`border-border bg-muted-foreground/15 h-9 ${w} animate-pulse rounded-full border`}
                />
              ))
            : suggestions.map((s) => (
                <UrlSuggestionChip
                  key={s}
                  slug={s}
                  onClick={() => onSuggestionClick(s)}
                />
              ))}
        </div>
      </div>
    </div>
  );
};
