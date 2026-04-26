import { Avatar } from "@ovation/ui/components/Avatar";

type PersonChipProps = {
  name: string;
  initials: string;
  tint: string;
};

export const PersonChip = ({ name, initials, tint }: PersonChipProps) => (
  <span className="border-border bg-card type-caption text-muted-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 font-semibold transition-colors">
    <Avatar
      initials={initials}
      tint={tint}
      size="sm"
      className="type-caption size-5"
    />
    {name}
  </span>
);
