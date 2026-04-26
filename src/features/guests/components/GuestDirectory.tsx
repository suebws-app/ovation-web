"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Filter } from "@ovation/icons/Filter";
import { Download } from "@ovation/icons/Download";
import { GuestTableHead } from "./GuestTableHead";
import { GuestRow } from "./GuestRow";
import { GuestPagination } from "./GuestPagination";

export const GuestDirectory = () => {
  const t = useTranslations();
  const guests = [
    {
      initials: "MD",
      tint: "#EFC9A8",
      name: t("guests__directory__name_margot"),
      relation: t("guests__directory__lena_maid"),
      group: t("guests__directory__group_wedding_party"),
      table: t("guests__directory__table_label", { n: 3 }),
      contact: "margot@hey.com",
      contactType: "email" as const,
      contributed: true,
      favorited: true,
      messageCount: 1,
      hasPhoto: true,
      thanked: false,
    },
    {
      initials: "AP",
      tint: "#D8C9B2",
      name: t("guests__directory__name_pilar"),
      relation: t("guests__directory__tomas_grandmother"),
      group: t("guests__directory__group_tomas_family"),
      table: t("guests__directory__table_label", { n: 1 }),
      contact: "+34 644 812 091",
      contactType: "phone" as const,
      contributed: true,
      favorited: true,
      messageCount: 1,
      hasPhoto: false,
      thanked: true,
    },
    {
      initials: "JE",
      tint: "#B9C9D9",
      name: t("guests__directory__name_alvarez"),
      relation: t("guests__directory__lena_parents"),
      group: t("guests__directory__group_lena_family"),
      table: t("guests__directory__table_label", { n: 2 }),
      contact: "els@alvarez.nl",
      contactType: "email" as const,
      contributed: true,
      favorited: false,
      messageCount: 2,
      hasPhoto: true,
      thanked: true,
    },
    {
      initials: "SO",
      tint: "#C8B5D9",
      name: t("guests__directory__name_sam"),
      relation: t("guests__directory__university_friend"),
      group: t("guests__directory__group_university_friends"),
      table: t("guests__directory__table_label", { n: 7 }),
      contact: "sam.okafor@gmail.com",
      contactType: "email" as const,
      contributed: true,
      favorited: false,
      messageCount: 1,
      hasPhoto: false,
      thanked: false,
    },
    {
      initials: "MB",
      tint: "#B8D3B6",
      name: t("guests__directory__name_marco"),
      relation: t("guests__directory__tomas_brother"),
      group: t("guests__directory__group_tomas_family"),
      table: t("guests__directory__table_label", { n: 1 }),
      contact: "+39 334 221 809",
      contactType: "phone" as const,
      contributed: true,
      favorited: true,
      messageCount: 1,
      hasPhoto: true,
      thanked: false,
    },
    {
      initials: "ID",
      tint: "#E9BFC4",
      name: t("guests__directory__name_inge"),
      relation: t("guests__directory__work_friend"),
      group: t("guests__directory__group_work_colleagues"),
      table: t("guests__directory__table_label", { n: 9 }),
      contact: "inge@studio-nw.be",
      contactType: "email" as const,
      contributed: true,
      favorited: false,
      messageCount: 1,
      hasPhoto: true,
      thanked: true,
    },
    {
      initials: "NH",
      tint: "#F2D7B3",
      name: t("guests__directory__name_nora"),
      relation: t("guests__directory__lena_nieces"),
      group: t("guests__directory__group_lena_family"),
      table: t("guests__directory__table_label", { n: 2 }),
      contact: t("guests__directory__via_els"),
      contactType: "via" as const,
      contributed: true,
      favorited: true,
      messageCount: 1,
      hasPhoto: true,
      thanked: true,
    },
    {
      initials: "RA",
      tint: "#ADC4D1",
      name: t("guests__directory__name_renee"),
      relation: t("guests__directory__school_friend"),
      group: t("guests__directory__group_university_friends"),
      table: t("guests__directory__table_label", { n: 8 }),
      contact: "renee.aerts@mail.com",
      contactType: "email" as const,
      contributed: false,
      favorited: false,
      messageCount: 0,
      hasPhoto: false,
      thanked: false,
      nudged: t("guests__directory__nudge_sent_2_days"),
      wasNudged: true,
    },
    {
      initials: "KV",
      tint: "#B9C9D9",
      name: t("guests__directory__name_koen"),
      relation: t("guests__directory__lena_uncle"),
      group: t("guests__directory__group_lena_family"),
      table: t("guests__directory__table_label", { n: 4 }),
      contact: "koen@vanlooy.nl",
      contactType: "email" as const,
      contributed: false,
      favorited: false,
      messageCount: 0,
      hasPhoto: false,
      thanked: false,
      nudged: t("guests__directory__not_nudged_yet"),
      wasNudged: false,
    },
    {
      initials: "SP",
      tint: "#D8C9B2",
      name: t("guests__directory__name_sofia"),
      relation: t("guests__directory__tomas_cousin"),
      group: t("guests__directory__group_tomas_family"),
      table: t("guests__directory__table_label", { n: 5 }),
      contact: "+351 912 004 113",
      contactType: "phone" as const,
      contributed: true,
      favorited: false,
      messageCount: 1,
      hasPhoto: true,
      thanked: false,
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card overflow-hidden border">
      <div className="border-border flex items-center gap-3 border-b px-6 py-4">
        <div className="type-body font-serif font-semibold">
          {t("guests__directory__title")}{" "}
          <span className="type-body-small text-muted-foreground font-medium">
            {t("guests__directory__showing_count", { count: 112 })}
          </span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter width={13} height={13} />
            {t("guests__directory__group_all")}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter width={13} height={13} />
            {t("guests__directory__table_any")}
          </Button>
          <Button size="sm" className="rounded-full">
            <Download width={13} height={13} />
            {t("guests__directory__export")}
          </Button>
        </div>
      </div>
      <GuestTableHead />
      {guests.map((guest, i) => (
        <GuestRow
          key={guest.initials}
          {...guest}
          isLast={i === guests.length - 1}
        />
      ))}
      <GuestPagination current={1} total={12} showing={10} of={112} />
    </div>
  );
};
