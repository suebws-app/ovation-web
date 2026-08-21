import type { TableSkeletonColumn } from "@ovation/ui/components/Table";

// Column widths are tuned so the sum of every *visible* fixed column always
// leaves room for the flexible guest column at the container width where it
// reveals — the table never exceeds its container, so no horizontal scroll.
export const inviteesTableColumnClasses = {
  guest: "min-w-0",
  email: "hidden w-44 @[840px]/table:table-cell",
  phone: "hidden w-32 @[960px]/table:table-cell",
  seats: "hidden w-16 text-center @[840px]/table:table-cell",
  status: "hidden w-24 @[600px]/table:table-cell",
  rsvp: "hidden w-28 @[600px]/table:table-cell",
  note: "hidden w-28 @[1080px]/table:table-cell",
  actions: "w-44 text-right",
};

export const inviteesTableSkeletonColumns: TableSkeletonColumn[] = [
  { variant: "avatar", className: inviteesTableColumnClasses.guest },
  { variant: "text", className: inviteesTableColumnClasses.email },
  { variant: "text", className: inviteesTableColumnClasses.phone },
  { variant: "text", className: inviteesTableColumnClasses.seats },
  { variant: "text", className: inviteesTableColumnClasses.status },
  { variant: "badge", className: inviteesTableColumnClasses.rsvp },
  { variant: "text", className: inviteesTableColumnClasses.note },
  { variant: "spacer", className: inviteesTableColumnClasses.actions },
];
