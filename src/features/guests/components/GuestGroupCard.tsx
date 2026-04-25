import { Avatar } from "@ovation/ui/components/Avatar";
import { GuestAvatarStack } from "./GuestAvatarStack";

type GroupMember = {
  initials: string;
  tint: string;
};

type GuestGroupCardProps = {
  title: string;
  totalCount: number;
  recordedCount: number;
  tint: string;
  members: GroupMember[];
};

export const GuestGroupCard = ({
  title,
  totalCount,
  recordedCount,
  tint,
  members,
}: GuestGroupCardProps) => {
  return (
    <div className="rounded-16 border-border bg-card hover:bg-muted/50 cursor-pointer border p-4 transition-colors">
      <Avatar initials={title[0]} tint={tint} size="md" />
      <div className="type-body-small mt-3 leading-tight font-semibold">
        {title}
      </div>
      <div className="type-caption text-muted-foreground mt-0.5">
        {recordedCount} of {totalCount} recorded
      </div>
      <div className="mt-2.5">
        <GuestAvatarStack members={members} />
      </div>
    </div>
  );
};
