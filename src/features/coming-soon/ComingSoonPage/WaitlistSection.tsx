"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { clientEnv as env } from "@/lib/utils/env.client";

const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
});

type WaitlistFields = z.infer<typeof waitlistSchema>;
type WaitlistState = "idle" | "loading" | "success" | "error";

const WaitlistSuccess = () => (
  <div className="flex flex-col items-center gap-3 py-2 text-center">
    <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
      <CheckIcon width={20} height={20} className="text-primary-foreground" />
    </div>
    <div>
      <p className="type-body text-foreground font-semibold">
        You&rsquo;re on the list!
      </p>
      <p className="type-body-small text-muted-foreground mt-1">
        We&rsquo;ll email you when we launch.
      </p>
    </div>
  </div>
);

export const WaitlistSection = () => {
  const [state, setState] = useState<WaitlistState>("idle");

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
        placeholder="your@email.com"
        autoComplete="email"
        disabled={state === "loading"}
        {...register("email")}
      />
      {errors.email && (
        <p className="type-caption text-danger px-1">{errors.email.message}</p>
      )}
      {state === "error" && !errors.email && (
        <p className="type-caption text-danger px-1">
          Something went wrong — please try again.
        </p>
      )}
      <Button type="submit" disabled={state === "loading"} className="w-full">
        {state === "loading" ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
};
