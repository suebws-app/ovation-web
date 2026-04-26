"use client";

import { useTranslations } from "next-intl";

export type VerifyEmailStatus =
  | { kind: "verifying" }
  | { kind: "missing" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type VerifyEmailHeadingProps = {
  status: VerifyEmailStatus;
};

export const VerifyEmailHeading = ({ status }: VerifyEmailHeadingProps) => {
  const t = useTranslations();
  return (
    <h1 className="type-h1 mt-3 font-serif leading-tight font-semibold tracking-tight">
      {status.kind === "verifying" && t("auth__verify__page_verifying_title")}
      {status.kind === "success" && t("auth__verify__page_success_title")}
      {status.kind === "missing" && t("auth__verify__page_missing_title")}
      {status.kind === "error" && t("auth__verify__page_error_title")}
    </h1>
  );
};
