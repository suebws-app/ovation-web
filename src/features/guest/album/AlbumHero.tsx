"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { safeHttpUrl } from "@/lib/utils/safe-url";
import { GuestAvatar } from "../welcome/GuestAvatar";
import { AlbumMenu } from "./AlbumMenu";
import type { AlbumCollection } from "./albumScope";

type AlbumHeroProps = {
  slug: string;
  title: string;
  initials: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  slideUrls: string[];
  count: number | null;
  onOpenCollection?: (collection: AlbumCollection) => void;
};

const SLIDE_MS = 5000;

export const AlbumHero = ({
  slug,
  title,
  initials,
  avatarUrl,
  coverUrl,
  slideUrls,
  count,
  onOpenCollection,
}: AlbumHeroProps) => {
  const t = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = slideUrls.length > 0 ? slideUrls : [coverUrl].filter(Boolean);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % slides.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-foreground relative flex min-h-100 flex-col justify-end">
      {slides.map((url, index) => {
        const safeUrl = safeHttpUrl(url);
        if (!safeUrl) return null;
        return (
          <img
            key={url}
            src={safeUrl}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-1000",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          />
        );
      })}
      <span
        aria-hidden
        className="from-foreground/95 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent"
      />

      <div className="absolute top-4 right-4 z-10">
        <AlbumMenu slug={slug} onOpenCollection={onOpenCollection} />
      </div>

      <div className="relative flex flex-col gap-4 p-5 pb-6">
        <GuestAvatar
          url={avatarUrl}
          initials={initials}
          alt={title}
          className="size-20"
        />
        <h1 className="type-h1 text-primary-foreground font-semibold">
          {title}
        </h1>
        <Button size="lg" asChild className="self-start">
          <Link href={appRoutes.guest.upload(slug)}>
            <PlusIcon className="size-4" aria-hidden />
            {t("guest__album__add_cta")}
          </Link>
        </Button>
        {count !== null && (
          <p className="type-body-small text-primary-foreground/85">
            <span className="font-semibold">{count}</span>{" "}
            {t("guest__album__count_label")}
          </p>
        )}
      </div>
    </div>
  );
};
