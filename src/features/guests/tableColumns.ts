import type { TableSkeletonColumn } from "@ovation/ui/components/Table";

export const guestsTableColumnClasses = {
  checkbox: "w-10 @[740px]/table:w-12",
  guest: "",
  messages: "hidden w-32 @[740px]/table:table-cell",
  status: "hidden w-36 @[740px]/table:table-cell",
  lastSeen: "hidden w-46 @[740px]/table:table-cell",
  spacer: "w-9",
};

export const guestsTableSkeletonColumns: TableSkeletonColumn[] = [
  { variant: "checkbox", className: guestsTableColumnClasses.checkbox },
  { variant: "avatar" },
  { variant: "text", className: guestsTableColumnClasses.messages },
  { variant: "badge", className: guestsTableColumnClasses.status },
  { variant: "text", className: guestsTableColumnClasses.lastSeen },
  { variant: "spacer", className: guestsTableColumnClasses.spacer },
];
