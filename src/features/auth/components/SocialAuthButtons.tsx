"use client";

import { Apple } from "@ovation/icons/Apple";
import { cn } from "@ovation/ui/utils/cn";
import { SocialAuthButton } from "./SocialAuthButton";

type SocialAuthButtonsProps = {
  action?: "sign-up" | "sign-in";
  className?: string;
};

export const SocialAuthButtons = ({
  action = "sign-up",
  className,
}: SocialAuthButtonsProps) => {
  const label = action === "sign-in" ? "Continue with" : "Sign up with";

  return (
    <div className={cn("flex gap-2.5", className)}>
      <SocialAuthButton
        provider="Apple"
        label={label}
        icon={<AppleIconBox />}
      />
      <SocialAuthButton
        provider="Google"
        label={label}
        icon={<GoogleIconBox />}
      />
    </div>
  );
};

const AppleIconBox = () => (
  <span className="rounded-6 bg-foreground inline-flex size-5.5 items-center justify-center">
    <Apple width={12} height={12} className="text-background" />
  </span>
);

const GoogleIconBox = () => (
  <span className="rounded-6 border-border bg-card type-caption text-foreground inline-flex size-5.5 items-center justify-center border font-bold">
    G
  </span>
);
