"use client";

import { useTranslations } from "next-intl";
import type { VerifyEmailStatus } from "./VerifyEmailHeading";

type VerifyEmailBodyProps = {
  status: VerifyEmailStatus;
};

export const VerifyEmailBody = ({ status }: VerifyEmailBodyProps) => {
  const t = useTranslations();
  if (status.kind === "verifying") {
    return (
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-105 leading-relaxed">
        {t("auth__verify__page_verifying_body")}
      </p>
    );
  }
  if (status.kind === "success") {
    return (
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-105 leading-relaxed">
        {t("auth__verify__page_success_body")}
      </p>
    );
  }
  if (status.kind === "missing") {
    return (
      <p className="type-body-small text-muted-foreground mt-3.5 max-w-105 leading-relaxed">
        {t("auth__verify__page_missing_body")}
      </p>
    );
  }
  return (
    <p className="type-body-small text-destructive mt-3.5 max-w-105 leading-relaxed">
      {status.message}
    </p>
  );
};
