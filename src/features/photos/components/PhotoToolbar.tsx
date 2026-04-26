"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Upload } from "@ovation/icons/Upload";
import { PhotoSearchInput } from "./PhotoSearchInput";
import { PhotoSortButton } from "./PhotoSortButton";
import { PhotoViewToggle } from "./PhotoViewToggle";
import { PhotoFilterChip } from "./PhotoFilterChip";

export const PhotoToolbar = () => {
  const t = useTranslations();
  return (
    <div className="border-border bg-card tablet:px-7 border-b px-4 py-5">
      <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-4">
        <div>
          <h1 className="desktop:type-h1 type-h2 font-serif leading-tight font-semibold tracking-tight">
            <span>{t("photos__toolbar__title_a", { count: 64 })}</span>{" "}
            <span className="text-primary italic">
              {t("photos__toolbar__title_b", { count: 52 })}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mt-1.5">
            {t("photos__toolbar__subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <PhotoSortButton />
          <PhotoViewToggle />
          <Button className="rounded-10 bg-foreground text-background hover:bg-foreground/90">
            <Upload width={13} height={13} /> {t("photos__toolbar__upload")}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <PhotoSearchInput />
        <div className="desktop:flex hidden gap-1.5">
          <PhotoFilterChip
            label={t("photos__toolbar__chip_reception")}
            active
          />
          <PhotoFilterChip label={t("photos__toolbar__chip_with_audio")} />
          <PhotoFilterChip label={t("photos__toolbar__chip_family")} />
        </div>
      </div>
    </div>
  );
};
