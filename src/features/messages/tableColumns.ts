import type { TableSkeletonColumn } from "@ovation/ui/components/Table";

export const messagesTableColumnClasses = {
  checkbox: "w-10 @[740px]/table:w-12",
  message: "",
  type: "hidden w-24 @[740px]/table:table-cell",
  date: "hidden w-32 @[740px]/table:table-cell",
  audio: "w-14 @[740px]/table:w-38 @[1420px]/table:w-78",
};

export const messagesTableSkeletonColumns: TableSkeletonColumn[] = [
  { variant: "checkbox", className: messagesTableColumnClasses.checkbox },
  { variant: "avatar" },
  { variant: "icon", className: messagesTableColumnClasses.type },
  { variant: "text", className: messagesTableColumnClasses.date },
  { variant: "action", className: messagesTableColumnClasses.audio },
];
