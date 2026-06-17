"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";

type UnlockState = "idle" | "loading" | "success" | "error";

const UnlockSuccess = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
        <CheckIcon width={20} height={20} className="text-primary-foreground" />
      </div>
      <div>
        <p className="type-body text-foreground font-semibold">
          {t("coming_soon__unlock__success_title")}
        </p>
        <p className="type-body-small text-muted-foreground mt-1">
          {t("coming_soon__unlock__success_body")}
        </p>
      </div>
    </div>
  );
};

export const UnlockSection = () => {
  const t = useTranslations();
  const [state, setState] = useState<UnlockState>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");
    const password = new FormData(e.currentTarget).get("password") as string;
    const res = await fetch("/api/coming-soon/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setState("success");
      window.location.assign("/");
    } else {
      setState("error");
    }
  };

  if (state === "success") {
    return <UnlockSuccess />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="password"
        name="password"
        placeholder={t("coming_soon__unlock__password_placeholder")}
        autoComplete="current-password"
        required
        disabled={state === "loading"}
      />
      {state === "error" && (
        <p className="type-caption text-danger px-1">
          {t("coming_soon__unlock__error")}
        </p>
      )}
      <Button
        type="submit"
        variant="outline"
        disabled={state === "loading"}
        className="w-full"
      >
        {state === "loading"
          ? t("coming_soon__unlock__verifying")
          : t("coming_soon__unlock__submit")}
      </Button>
    </form>
  );
};
