"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Button } from "@ovation/ui/components/Button";
import { Logo } from "@ovation/ui/components/Logo";
import { Link, useRouter } from "@/i18n/navigation";
import type { ApiErrorBody } from "@/lib/api/types";
import { Spinner } from "./Spinner";

type Status =
  | { kind: "exchanging" }
  | { kind: "missing" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export const OauthCallbackPage = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") ?? "";
  const errorParam = searchParams.get("error");

  const [status, setStatus] = useState<Status>(() => {
    if (errorParam) {
      return {
        kind: "error",
        message: searchParams.get("error_description") ?? errorParam,
      };
    }
    return code ? { kind: "exchanging" } : { kind: "missing" };
  });

  useEffect(() => {
    if (status.kind !== "exchanging") return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (cancelled) return;
      if (!res.ok) {
        const body = (await res
          .json()
          .catch(() => null)) as ApiErrorBody | null;
        setStatus({
          kind: "error",
          message:
            body?.error?.message ?? t("auth__oauth_callback__error_default"),
        });
        return;
      }
      setStatus({ kind: "success" });
      setTimeout(() => {
        router.replace("/app");
        router.refresh();
      }, 600);
    })();
    return () => {
      cancelled = true;
    };
  }, [status.kind, code, router, t]);

  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-120 flex-col items-center gap-4 px-6 py-12 text-center">
        {status.kind === "exchanging" && (
          <>
            <Spinner />
            <Eyebrow className="text-muted-foreground">
              {t("auth__oauth_callback__exchanging_eyebrow")}
            </Eyebrow>
            <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
              {t("auth__oauth_callback__exchanging_title")}
            </h1>
            <p className="type-body-small text-muted-foreground">
              {t("auth__oauth_callback__exchanging_body")}
            </p>
          </>
        )}

        {status.kind === "success" && (
          <>
            <Eyebrow className="text-secondary">
              {t("auth__oauth_callback__success_eyebrow")}
            </Eyebrow>
            <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
              {t("auth__oauth_callback__success_title")}
            </h1>
            <p className="type-body-small text-muted-foreground">
              {t("auth__oauth_callback__success_body")}
            </p>
          </>
        )}

        {status.kind === "missing" && (
          <>
            <Eyebrow className="text-muted-foreground">
              {t("auth__oauth_callback__missing_eyebrow")}
            </Eyebrow>
            <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
              {t("auth__oauth_callback__missing_title")}
            </h1>
            <p className="type-body-small text-muted-foreground">
              {t("auth__oauth_callback__missing_body")}
            </p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/sign-in">{t("auth__verify__back_to_signin")}</Link>
            </Button>
          </>
        )}

        {status.kind === "error" && (
          <>
            <Eyebrow className="text-destructive">
              {t("auth__oauth_callback__error_eyebrow")}
            </Eyebrow>
            <h1 className="type-h1 font-serif leading-tight font-semibold tracking-tight">
              {t("auth__oauth_callback__error_title")}
            </h1>
            <p
              className="type-body-small text-destructive max-w-md leading-relaxed"
              role="alert"
            >
              {status.message}
            </p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/sign-in">{t("auth__verify__back_to_signin")}</Link>
            </Button>
          </>
        )}
      </main>
    </div>
  );
};
