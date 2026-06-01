"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";

type SocialAuthButtonProps = {
  provider: string;
  label?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export const SocialAuthButton = ({
  provider,
  label,
  icon,
  onClick,
  disabled,
  className,
}: SocialAuthButtonProps) => {
  const t = useTranslations();
  const resolvedLabel = label ?? t("auth__social__sign_up_with");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-12 tablet:rounded-16 border-border bg-card type-caption tablet:type-body-small text-foreground hover:bg-muted tablet:gap-2.5 tablet:px-4 tablet:py-3.5 flex flex-1 cursor-pointer items-center justify-center gap-2 border px-3 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {icon}
      {resolvedLabel} {provider}
    </button>
  );
};
