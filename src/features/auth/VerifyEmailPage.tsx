"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "@ovation/ui/components/Logo";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Mail } from "@ovation/icons/Mail";
import { Link, useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

/**
 * Better Auth handles verification clicks at /api/auth/verify-email and
 * redirects to the configured callbackURL on success. This page is the
 * fallback users see if they navigate here directly with no token.
 */
export const VerifyEmailPage = () => {
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      router.replace(appRoutes.app.root);
    }
  }, [router]);

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
        <h1 className="type-h1 mt-3 font-serif leading-tight font-semibold tracking-tight">
          {t("auth__verify__page_missing_title")}
        </h1>
        <p className="type-body-small text-muted-foreground mt-3.5 max-w-105 leading-relaxed">
          {t("auth__verify__page_missing_body")}
        </p>
        <Button asChild className="mt-9 rounded-full">
          <Link href={appRoutes.auth.signIn}>
            {t("auth__verify__back_to_signin")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
