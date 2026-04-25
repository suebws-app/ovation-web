"use client";

import { cn } from "@ovation/ui/utils/cn";

type SocialAuthButtonProps = {
  provider: string;
  label?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const SocialAuthButton = ({
  provider,
  label = "Sign up with",
  icon,
  onClick,
  className,
}: SocialAuthButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-16 border-border bg-card type-body-small text-foreground hover:bg-muted flex flex-1 cursor-pointer items-center justify-center gap-2.5 border px-4 py-3.5 font-semibold transition-colors",
      className,
    )}
  >
    {icon}
    {label} {provider}
  </button>
);
