"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TagIcon } from "@ovation/icons/TagIcon";
import { Button } from "@ovation/ui/components/Button";

type PromoCodeFieldProps = {
  onApply: (code: string) => void;
  disabled?: boolean;
  appliedCode?: string | null;
};

export const PromoCodeField = ({
  onApply,
  disabled,
  appliedCode,
}: PromoCodeFieldProps) => {
  const t = useTranslations();
  const [code, setCode] = useState(appliedCode ?? "");
  return (
    <div className="flex gap-2">
      <label className="border-border bg-muted/40 text-muted-foreground focus-within:ring-ring inline-flex h-10 flex-1 items-center gap-2 rounded-lg border px-3 focus-within:ring-2 focus-within:outline-none">
        <TagIcon width={13} height={13} />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("cart__summary__promo_placeholder")}
          className="text-foreground placeholder:text-muted-foreground tablet:text-sm flex-1 bg-transparent text-base outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </label>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => onApply(code.trim())}
        disabled={disabled || code.trim().length === 0}
      >
        {t("cart__summary__promo_apply")}
      </Button>
    </div>
  );
};
