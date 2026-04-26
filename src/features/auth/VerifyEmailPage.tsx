"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Mail } from "@ovation/icons/Mail";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/api/auth-client";
import type { ApiErrorBody } from "@/lib/api/types";
import {
  VerifyEmailHeading,
  type VerifyEmailStatus,
} from "./VerifyEmailHeading";
import { VerifyEmailBody } from "./VerifyEmailBody";

const readVerifyType = (raw: string | null): "email" | "email_change" =>
  raw === "email_change" ? "email_change" : "email";

export const VerifyEmailPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenHash =
    searchParams.get("token_hash") ?? searchParams.get("token") ?? "";
  const type = readVerifyType(searchParams.get("type"));

  const [status, setStatus] = useState<VerifyEmailStatus>(() =>
    tokenHash ? { kind: "verifying" } : { kind: "missing" },
  );

  useEffect(() => {
    if (!tokenHash) return;
    let cancelled = false;
    (async () => {
      const res = await authClient.verifyEmail({ tokenHash, type });
      if (cancelled) return;
      if (res.ok) {
        setStatus({ kind: "success" });
        setTimeout(() => {
          router.replace("/app");
          router.refresh();
        }, 800);
      } else {
        const body = (await res
          .json()
          .catch(() => null)) as ApiErrorBody | null;
        setStatus({
          kind: "error",
          message:
            body?.error?.message ?? t("auth__verify__page_error_default"),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tokenHash, type, router, t]);

  return (
    <div className="tablet:px-20 mx-auto flex min-h-screen w-full max-w-130 flex-col px-6 py-12">
      <Logo />
      <div className="mt-16 flex flex-1 flex-col items-center text-center">
        <div className="rounded-20 bg-primary/10 mb-6 inline-flex size-18 items-center justify-center">
          <Mail
            width={30}
            height={30}
            className="text-primary"
            strokeWidth={1.75}
          />
        </div>
        <Eyebrow className="text-primary">
          {t("auth__verify__page_eyebrow")}
        </Eyebrow>
        <VerifyEmailHeading status={status} />
        <VerifyEmailBody status={status} />

        {(status.kind === "missing" || status.kind === "error") && (
          <Button asChild className="mt-9 rounded-full">
            <Link href="/sign-in">{t("auth__verify__back_to_signin")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};
