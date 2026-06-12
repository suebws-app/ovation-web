"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { authClient } from "@/lib/auth/client";
import { SocialAuthButton } from "./SocialAuthButton";
import { AppleIcon } from "@ovation/icons/AppleIcon";
import { GoogleIcon } from "@ovation/icons/GoogleIcon";

type SocialAuthButtonsProps = {
  className?: string;
};

type Provider = "google" | "apple";

export const SocialAuthButtons = ({ className }: SocialAuthButtonsProps) => {
  const t = useTranslations();
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProvider = async (provider: Provider) => {
    setPending(provider);
    setError(null);
    const { error: providerError } = await authClient.signIn.social({
      provider,
      callbackURL: "/home",
    });
    if (providerError) {
      setPending(null);
      const errorCode =
        ((providerError as Record<string, unknown>)?.code as
          | string
          | undefined) ?? "";
      if (errorCode === "ACCOUNT_DELETED") {
        setError(t("auth__signin__error_account_deleted"));
        return;
      }
      setError(providerError.message ?? t("auth__social__error_default"));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2.5">
        <SocialAuthButton
          provider="Apple"
          icon={<AppleIcon className="tablet:size-5 size-4" />}
          disabled={true}
          onClick={() => handleProvider("apple")}
        />
        <SocialAuthButton
          provider="Google"
          icon={<GoogleIcon className="tablet:size-5 size-4" />}
          disabled={pending !== null}
          onClick={() => handleProvider("google")}
        />
      </div>
      {error && (
        <p className="type-caption text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
