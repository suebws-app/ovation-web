"use client";

import { Button } from "@ovation/ui/components/Button";
import { Filter } from "@ovation/icons/Filter";
import { Download } from "@ovation/icons/Download";
import { GuestTableHead } from "./GuestTableHead";
import { GuestRow } from "./GuestRow";
import { GuestPagination } from "./GuestPagination";

const GUESTS = [
  {
    initials: "MD",
    tint: "#EFC9A8",
    name: "Margot Devreese",
    relation: "Lena\u2019s maid of honour",
    group: "Wedding party",
    table: "Table 3",
    contact: "margot@hey.com",
    contributed: true,
    favorited: true,
    messageCount: 1,
    hasPhoto: true,
    thanked: false,
  },
  {
    initials: "AP",
    tint: "#D8C9B2",
    name: "Abuela Pilar",
    relation: "Tom\u00e1s\u2019s grandmother",
    group: "Tom\u00e1s\u2019s family",
    table: "Table 1",
    contact: "+34 644 812 091",
    contributed: true,
    favorited: true,
    messageCount: 1,
    hasPhoto: false,
    thanked: true,
  },
  {
    initials: "JE",
    tint: "#B9C9D9",
    name: "Johan & Els Alvarez",
    relation: "Lena\u2019s parents",
    group: "Lena\u2019s family",
    table: "Table 2",
    contact: "els@alvarez.nl",
    contributed: true,
    favorited: false,
    messageCount: 2,
    hasPhoto: true,
    thanked: true,
  },
  {
    initials: "SO",
    tint: "#C8B5D9",
    name: "Sam Okafor",
    relation: "University friend",
    group: "University friends",
    table: "Table 7",
    contact: "sam.okafor@gmail.com",
    contributed: true,
    favorited: false,
    messageCount: 1,
    hasPhoto: false,
    thanked: false,
  },
  {
    initials: "MB",
    tint: "#B8D3B6",
    name: "Marco Benedetti",
    relation: "Tom\u00e1s\u2019s brother",
    group: "Tom\u00e1s\u2019s family",
    table: "Table 1",
    contact: "+39 334 221 809",
    contributed: true,
    favorited: true,
    messageCount: 1,
    hasPhoto: true,
    thanked: false,
  },
  {
    initials: "ID",
    tint: "#E9BFC4",
    name: "Inge De Smet",
    relation: "Work friend",
    group: "Work & colleagues",
    table: "Table 9",
    contact: "inge@studio-nw.be",
    contributed: true,
    favorited: false,
    messageCount: 1,
    hasPhoto: true,
    thanked: true,
  },
  {
    initials: "NH",
    tint: "#F2D7B3",
    name: "Nora, Hugo & Ma\u00ebl",
    relation: "Lena\u2019s nieces & nephew",
    group: "Lena\u2019s family",
    table: "Table 2",
    contact: "via Els",
    contributed: true,
    favorited: true,
    messageCount: 1,
    hasPhoto: true,
    thanked: true,
  },
  {
    initials: "RA",
    tint: "#ADC4D1",
    name: "Ren\u00e9e Aerts",
    relation: "School friend",
    group: "University friends",
    table: "Table 8",
    contact: "renee.aerts@mail.com",
    contributed: false,
    favorited: false,
    messageCount: 0,
    hasPhoto: false,
    thanked: false,
    nudged: "Nudge sent 2 days ago",
  },
  {
    initials: "KV",
    tint: "#B9C9D9",
    name: "Koen Van Looy",
    relation: "Lena\u2019s uncle",
    group: "Lena\u2019s family",
    table: "Table 4",
    contact: "koen@vanlooy.nl",
    contributed: false,
    favorited: false,
    messageCount: 0,
    hasPhoto: false,
    thanked: false,
    nudged: "Not nudged yet",
  },
  {
    initials: "SP",
    tint: "#D8C9B2",
    name: "Sofia Pereira",
    relation: "Tom\u00e1s\u2019s cousin",
    group: "Tom\u00e1s\u2019s family",
    table: "Table 5",
    contact: "+351 912 004 113",
    contributed: true,
    favorited: false,
    messageCount: 1,
    hasPhoto: true,
    thanked: false,
  },
];

export const GuestDirectory = () => {
  return (
    <div className="rounded-16 border-border bg-card overflow-hidden border">
      <div className="border-border flex items-center gap-3 border-b px-6 py-4">
        <div className="type-body font-serif font-semibold">
          Directory{" "}
          <span className="type-body-small text-muted-foreground font-medium">
            &middot; showing 112
          </span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter width={13} height={13} />
            Group: all
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter width={13} height={13} />
            Table: any
          </Button>
          <Button size="sm" className="rounded-full">
            <Download width={13} height={13} />
            Export CSV
          </Button>
        </div>
      </div>
      <GuestTableHead />
      {GUESTS.map((guest, i) => (
        <GuestRow
          key={guest.initials}
          {...guest}
          isLast={i === GUESTS.length - 1}
        />
      ))}
      <GuestPagination current={1} total={12} showing={10} of={112} />
    </div>
  );
};
