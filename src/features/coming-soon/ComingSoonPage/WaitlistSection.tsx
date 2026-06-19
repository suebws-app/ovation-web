"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { clientEnv as env } from "@/lib/utils/env.client";

const buildWaitlistSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("coming_soon__waitlist__email_required"))
      .email(t("coming_soon__waitlist__email_invalid")),
  });

type WaitlistFields = z.infer<ReturnType<typeof buildWaitlistSchema>>;
type WaitlistState = "idle" | "loading" | "success" | "error";

const WaitlistSuccess = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
        <CheckIcon width={20} height={20} className="text-primary-foreground" />
      </div>
      <div>
        <p className="type-body text-foreground font-semibold">
          {t("coming_soon__waitlist__success_title")}
        </p>
        <p className="type-body-small text-muted-foreground mt-1">
          {t("coming_soon__waitlist__success_body")}
        </p>
      </div>
    </div>
  );
};

export const WaitlistSection = () => {
  const t = useTranslations();
  const [state, setState] = useState<WaitlistState>("idle");

  const waitlistSchema = useMemo(() => buildWaitlistSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFields>({
    resolver: zodResolver(waitlistSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async ({ email }: WaitlistFields) => {
    setState("loading");
    try {
      const res = await fetch(`${env.API_URL}/api/v1/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return <WaitlistSuccess />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        type="email"
        placeholder={t("coming_soon__waitlist__email_placeholder")}
        autoComplete="email"
        disabled={state === "loading"}
        {...register("email")}
      />
      {errors.email && (
        <p className="type-caption text-danger px-1">{errors.email.message}</p>
      )}
      {state === "error" && !errors.email && (
        <p className="type-caption text-danger px-1">
          {t("coming_soon__waitlist__error")}
        </p>
      )}
      <Button type="submit" disabled={state === "loading"} className="w-full">
        {state === "loading"
          ? t("coming_soon__waitlist__joining")
          : t("coming_soon__waitlist__submit")}
      </Button>
    </form>
  );
};
