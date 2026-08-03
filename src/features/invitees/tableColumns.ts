import type { TableSkeletonColumn } from "@ovation/ui/components/Table";

export const inviteesTableColumnClasses = {
  guest: "",
  email: "hidden w-56 @[740px]/table:table-cell",
  phone: "hidden w-44 @[840px]/table:table-cell",
  seats: "hidden w-20 text-center @[740px]/table:table-cell",
  status: "hidden w-32 @[640px]/table:table-cell",
  rsvp: "hidden w-36 @[640px]/table:table-cell",
  note: "hidden w-40 @[940px]/table:table-cell",
  actions: "w-44 text-right",
};

export const inviteesTableSkeletonColumns: TableSkeletonColumn[] = [
  { variant: "avatar" },
  { variant: "text", className: inviteesTableColumnClasses.email },
  { variant: "text", className: inviteesTableColumnClasses.phone },
  { variant: "text", className: inviteesTableColumnClasses.seats },
  { variant: "text", className: inviteesTableColumnClasses.status },
  { variant: "badge", className: inviteesTableColumnClasses.rsvp },
  { variant: "text", className: inviteesTableColumnClasses.note },
  { variant: "spacer", className: inviteesTableColumnClasses.actions },
];
