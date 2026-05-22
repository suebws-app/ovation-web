"use client";

import { useTranslations } from "next-intl";
import { AvailableBadge } from "./AvailableBadge";
import { UrlSuggestionChip } from "./UrlSuggestionChip";
import type { SlugStatus } from "@/features/create/hooks/useSlugChecker";
import { env } from "@/lib/utils/env";

type SlugInputProps = {
  value: string;
  status: SlugStatus;
  suggestions: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onSuggestionClick: (slug: string) => void;
};

export const SlugInput = ({
  value,
  status,
  suggestions,
  placeholder,
  onChange,
  onSuggestionClick,
}: SlugInputProps) => {
  const t = useTranslations();

  return (
    <div className="mt-6">
      <div className="rounded-16 border-primary bg-card shadow-input flex items-center gap-2 border-2 px-4 py-3">
        <span className="type-body-small text-muted-foreground font-mono">
          {env.APP_URL} /
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          placeholder={placeholder}
          className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent font-medium outline-none"
        />
        {status === "available" && (
          <AvailableBadge label={t("signup__claim__available")} />
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
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <UrlSuggestionChip key={s} slug={s} onClick={() => onSuggestionClick(s)} />
          ))}
        </div>
      )}
    </div>
  );
};
