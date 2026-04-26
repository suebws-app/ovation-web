"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Button } from "@ovation/ui/components/Button";
import { AlbumItem } from "./AlbumItem";
import { TimelineItem } from "./TimelineItem";
import { PersonChip } from "./PersonChip";

export const FilterRail = () => {
  const t = useTranslations();

  const people = [
    {
      name: t("photos__filter__person_margot"),
      initials: "M",
      tint: "#EFC9A8",
    },
    { name: t("photos__filter__person_joan"), initials: "J", tint: "#779FEB" },
    {
      name: t("photos__filter__person_angela"),
      initials: "A",
      tint: "#EC8662",
    },
    { name: t("photos__filter__person_elise"), initials: "E", tint: "#82E19D" },
    {
      name: t("photos__filter__person_carlos"),
      initials: "C",
      tint: "#EDB974",
    },
    {
      name: t("photos__filter__person_marco"),
      initials: "MB",
      tint: "#B8D3B6",
    },
  ];

  const albums = [
    { label: t("photos__filter__album_all"), count: 64, active: true },
    { label: t("photos__filter__album_favourites"), count: 12 },
    { label: t("photos__filter__album_couple"), count: 9 },
    { label: t("photos__filter__album_groups"), count: 18 },
    { label: t("photos__filter__album_family"), count: 21 },
    { label: t("photos__filter__album_with_audio"), count: 42 },
  ];

  const timeline = [
    {
      label: t("photos__filter__moment_getting_ready"),
      time: t("photos__filter__time_getting_ready"),
      count: 11,
    },
    {
      label: t("photos__filter__moment_ceremony"),
      time: t("photos__filter__time_ceremony"),
      count: 18,
    },
    {
      label: t("photos__filter__moment_reception"),
      time: t("photos__filter__time_reception"),
      count: 23,
      active: true,
    },
    {
      label: t("photos__filter__moment_party"),
      time: t("photos__filter__time_party"),
      count: 10,
    },
    {
      label: t("photos__filter__moment_morning_after"),
      time: t("photos__filter__time_morning_after"),
      count: 2,
    },
  ];

  return (
    <div className="border-border bg-background large-desktop:block hidden overflow-auto border-r p-4.5">
      <Eyebrow className="text-muted-foreground px-2 pb-2">
        {t("photos__filter__albums")}
      </Eyebrow>
      {albums.map((a) => (
        <AlbumItem key={a.label} {...a} />
      ))}

      <Eyebrow className="text-muted-foreground px-2 pt-5 pb-2">
        {t("photos__filter__day_timeline")}
      </Eyebrow>
      {timeline.map((tl) => (
        <TimelineItem key={tl.label} {...tl} />
      ))}

      <Eyebrow className="text-muted-foreground px-2 pt-5 pb-2">
        {t("photos__filter__people_detected")}
      </Eyebrow>
      <div className="flex flex-wrap gap-1.5 px-2">
        {people.map((p) => (
          <PersonChip key={p.name} {...p} />
        ))}
        <span className="border-border type-caption text-muted-foreground inline-flex items-center rounded-full border border-dashed px-2.5 py-1 font-semibold">
          {t("photos__filter__more_count", { count: 46 })}
        </span>
      </div>

      <div className="rounded-12 border-accent from-accent/10 to-destructive/10 mt-6 border border-dashed bg-gradient-to-br p-3.5">
        <p className="type-caption text-foreground font-semibold">
          {t("photos__filter__pair_title")}
        </p>
        <p className="type-caption text-muted-foreground mt-1">
          {t("photos__filter__pair_body", { count: 22 })}
        </p>
        <Button
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 mt-2.5 rounded-full"
        >
          {t("photos__filter__pair_cta")}
        </Button>
      </div>

      <div className="rounded-12 border-border bg-card mt-4 border p-3.5">
        <Eyebrow className="text-muted-foreground">
          {t("photos__filter__storage")}
        </Eyebrow>
        <p className="type-body-large mt-1.5 font-serif font-semibold">
          1.2{" "}
          <span className="type-caption text-muted-foreground font-medium italic">
            {t("photos__filter__storage_quota")}
          </span>
        </p>
        <div className="bg-border mt-1.5 h-1 overflow-hidden rounded-full">
          <div className="bg-primary h-full w-[24%] rounded-full" />
        </div>
      </div>
    </div>
  );
};
