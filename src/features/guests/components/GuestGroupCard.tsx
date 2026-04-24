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
    <div className="cursor-pointer rounded-16 border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <Avatar initials={title[0]} tint={tint} size="md" />
      <div className="mt-3 type-body-small font-semibold leading-tight">
        {title}
      </div>
      <div className="mt-0.5 type-caption text-muted-foreground">
        {recordedCount} of {totalCount} recorded
      </div>
      <div className="mt-2.5">
        <GuestAvatarStack members={members} />
      </div>
    </div>
  );
};
