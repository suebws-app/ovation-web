import type { TableSkeletonColumn } from "@ovation/ui/components/Table";

export const guestsTableColumnClasses = {
  checkbox: "w-10 @[740px]/table:w-12",
  guest: "",
  messages: "hidden w-24 @[740px]/table:table-cell",
  photos: "hidden w-20 @[740px]/table:table-cell",
  audio: "hidden w-20 @[740px]/table:table-cell",
  videos: "hidden w-20 @[740px]/table:table-cell",
  spacer: "w-9",
};

export const guestsTableSkeletonColumns: TableSkeletonColumn[] = [
  { variant: "checkbox", className: guestsTableColumnClasses.checkbox },
  { variant: "avatar" },
  { variant: "text", className: guestsTableColumnClasses.messages },
  { variant: "text", className: guestsTableColumnClasses.photos },
  { variant: "text", className: guestsTableColumnClasses.audio },
  { variant: "text", className: guestsTableColumnClasses.videos },
  { variant: "spacer", className: guestsTableColumnClasses.spacer },
];
