"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { authClient } from "@/lib/api/auth-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import { SocialAuthButton } from "./SocialAuthButton";
import { AppleIconBox } from "./AppleIconBox";
import { GoogleIconBox } from "./GoogleIconBox";

type SocialAuthButtonsProps = {
  action?: "sign-up" | "sign-in";
  className?: string;
};

type Provider = "google" | "apple";

export const SocialAuthButtons = ({
  action = "sign-up",
  className,
}: SocialAuthButtonsProps) => {
  const t = useTranslations();
  const label =
    action === "sign-in"
      ? t("auth__social__continue_with")
      : t("auth__social__sign_up_with");
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProvider = async (provider: Provider) => {
    setPending(provider);
    setError(null);
    try {
      const result = await authClient.oauthUrl({
        provider,
        redirectTo: `${env.APP_URL}/oauth-callback`,
      });
      window.location.href = result.url;
    } catch (e) {
      setPending(null);
      setError(
        ApiError.isApiError(e) ? e.message : t("auth__social__error_default"),
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2.5">
        <SocialAuthButton
          provider="Apple"
          label={label}
          icon={<AppleIconBox />}
          disabled={pending !== null}
          onClick={() => handleProvider("apple")}
        />
        <SocialAuthButton
          provider="Google"
          label={label}
          icon={<GoogleIconBox />}
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
