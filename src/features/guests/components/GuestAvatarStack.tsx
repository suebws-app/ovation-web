import { Avatar } from "@ovation/ui/components/Avatar";

type AvatarStackMember = {
  initials: string;
  tint: string;
};

type GuestAvatarStackProps = {
  members: AvatarStackMember[];
  maxVisible?: number;
};

export const GuestAvatarStack = ({
  members,
  maxVisible = 5,
}: GuestAvatarStackProps) => {
  const visible = members.slice(0, maxVisible);
  const remaining = members.length - maxVisible;

  return (
    <div className="flex items-center">
      {visible.map((member, i) => (
        <div
          key={`${member.initials}-${i}`}
          className="ring-card ring-2"
          style={{ marginLeft: i === 0 ? 0 : -8, borderRadius: "50%" }}
        >
          <Avatar initials={member.initials} tint={member.tint} size="sm" />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="border-card bg-muted type-caption text-muted-foreground flex size-8 items-center justify-center rounded-full border-2 font-bold"
          style={{ marginLeft: -8 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
