"use client";

import { useState } from "react";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";

type UnlockState = "idle" | "loading" | "success" | "error";

const UnlockSuccess = () => (
  <div className="flex flex-col items-center gap-3 py-2 text-center">
    <div className="bg-secondary flex size-11 items-center justify-center rounded-full">
      <CheckIcon width={20} height={20} className="text-primary-foreground" />
    </div>
    <div>
      <p className="type-body text-foreground font-semibold">Access granted!</p>
      <p className="type-body-small text-muted-foreground mt-1">
        Redirecting you now…
      </p>
    </div>
  </div>
);

export const UnlockSection = () => {
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
        placeholder="Preview password"
        autoComplete="current-password"
        required
        disabled={state === "loading"}
      />
      {state === "error" && (
        <p className="type-caption text-danger px-1">
          Incorrect password — please try again.
        </p>
      )}
      <Button
        type="submit"
        variant="outline"
        disabled={state === "loading"}
        className="w-full"
      >
        {state === "loading" ? "Verifying…" : "Access preview"}
      </Button>
    </form>
  );
};
