"use client";

import { useTranslations } from "next-intl";
import { LockIcon } from "@ovation/icons/LockIcon";
import { AlbumHero } from "./AlbumHero";

type AlbumPrivateProps = {
  slug: string;
  title: string;
  initials: string;
  avatarUrl: string | null;
  coverUrl: string | null;
};

export const AlbumPrivate = ({
  slug,
  title,
  initials,
  avatarUrl,
  coverUrl,
}: AlbumPrivateProps) => {
  const t = useTranslations();

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <AlbumHero
        slug={slug}
        title={title}
        initials={initials}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        slideUrls={[]}
        count={null}
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div className="bg-muted flex size-14 items-center justify-center rounded-full">
          <LockIcon width={22} height={22} className="text-muted-foreground" />
        </div>
        <p className="type-body text-foreground font-semibold">
          {t("guest__album__private_title")}
        </p>
        <p className="type-body-small text-muted-foreground max-w-80">
          {t("guest__album__private_body")}
        </p>
      </div>
    </div>
  );
};
