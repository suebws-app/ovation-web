"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Link } from "@/i18n/navigation";

type CompletionErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const CompletionErrorState = ({
  message,
  onRetry,
}: CompletionErrorStateProps) => {
  const t = useTranslations();
  return (
    <div className="bg-background flex min-h-[calc(100vh-89px)] flex-col items-center justify-center text-center">
      <Eyebrow className="text-destructive">
        {t("signup__completion__error_eyebrow")}
      </Eyebrow>
      <h1 className="type-h1 mt-3 font-serif leading-tight font-semibold tracking-tight">
        {t("signup__completion__error_title")}
      </h1>
      <p
        className="type-body-small text-destructive mt-3 max-w-md"
        role="alert"
      >
        {message}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry} className="rounded-full">
          {t("signup__completion__error_retry")}
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/app">{t("signup__completion__error_skip")}</Link>
        </Button>
      </div>
    </div>
  );
};
