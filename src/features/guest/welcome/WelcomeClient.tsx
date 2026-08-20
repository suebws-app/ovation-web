"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { readStoredGuestName, writeStoredGuestName } from "./guestNameStorage";

type WelcomeClientProps = {
  slug: string;
  sourceParam: string | null;
  nextParam: string | null;
};

export const WelcomeClient = ({
  slug,
  sourceParam,
  nextParam,
}: WelcomeClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const setSlug = useGuestSubmissionStore((s) => s.setSlug);
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const destination =
    nextParam === "upload"
      ? appRoutes.guest.upload(slug)
      : appRoutes.guest.album(slug);
  const nextHref = sourceParam
    ? `${destination}?source=${sourceParam}`
    : destination;

  useEffect(() => {
    setSlug(slug);
    const stored = readStoredGuestName(slug);
    if (!stored) return;
    setGuestName(stored);
    router.replace(nextHref);
  }, [slug, setSlug, setGuestName, router, nextHref]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError(t("guest__record__schema__name_required"));
      return;
    }
    setGuestName(trimmed);
    writeStoredGuestName(slug, trimmed);
    router.push(nextHref);
  };

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4">
      <div className="bg-card rounded-16 flex flex-col gap-1.5 p-4 shadow-lg">
        <Label htmlFor="guest-name" className="type-caption text-primary">
          {t("guest__record__name_label")}
        </Label>
        <Input
          id="guest-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder={t("guest__welcome__name_placeholder")}
          maxLength={60}
          autoComplete="name"
          className="border-none px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {error && <p className="type-body-small text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full">
        {t("guest__welcome__cta")}
      </Button>
    </form>
  );
};
