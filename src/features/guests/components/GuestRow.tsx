import { Avatar } from "@ovation/ui/components/Avatar";
import { Heart } from "@ovation/icons/Heart";
import { Phone } from "@ovation/icons/Phone";
import { Mail } from "@ovation/icons/Mail";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { MoreHorizontal } from "@ovation/icons/MoreHorizontal";
import { GuestStatusPill } from "./GuestStatusPill";

type GuestRowProps = {
  initials: string;
  tint: string;
  name: string;
  relation: string;
  group: string;
  table: string;
  contact: string;
  contributed: boolean;
  thanked: boolean;
  favorited: boolean;
  messageCount: number;
  hasPhoto: boolean;
  nudged?: string;
  isLast?: boolean;
};

export const GuestRow = ({
  initials,
  tint,
  name,
  relation,
  group,
  table,
  contact,
  contributed,
  thanked,
  favorited,
  messageCount,
  hasPhoto,
  nudged,
  isLast,
}: GuestRowProps) => {
  const contactIcon = contact.startsWith("+") ? (
    <Phone width={12} height={12} className="text-muted-foreground" />
  ) : contact.startsWith("via") ? (
    <LinkIcon width={12} height={12} className="text-muted-foreground" />
  ) : (
    <Mail width={12} height={12} className="text-muted-foreground" />
  );

  return (
    <div
      className={`grid grid-cols-[28px_minmax(220px,1.4fr)_140px_150px_150px_120px_36px] items-center gap-3.5 px-6 py-3.5 ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <input
        type="checkbox"
        className="size-4 accent-primary"
      />
      <div className="flex min-w-0 items-center gap-3">
        <Avatar initials={initials} tint={tint} size="md" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="type-body-small font-semibold">{name}</span>
            {favorited && (
              <Heart
                width={12}
                height={12}
                fill="var(--destructive)"
                stroke="none"
              />
            )}
          </div>
          <div className="truncate type-caption text-muted-foreground">
            {relation}
          </div>
        </div>
      </div>
      <div>
        <div className="type-caption">{group}</div>
        <div className="mt-0.5 type-caption text-muted-foreground">{table}</div>
      </div>
      <div className="flex items-center gap-1.5 overflow-hidden type-caption text-muted-foreground">
        {contactIcon}
        <span className="truncate">{contact}</span>
      </div>
      <GuestStatusPill
        contributed={contributed}
        thanked={thanked}
        nudged={nudged}
      />
      <div className="flex items-center gap-2 type-caption text-muted-foreground">
        {contributed ? (
          <>
            <span className="font-semibold text-foreground">
              {messageCount} msg
            </span>
            {hasPhoto && (
              <ImageIcon
                width={12}
                height={12}
                className="text-muted-foreground"
              />
            )}
          </>
        ) : (
          <span>{nudged}</span>
        )}
      </div>
      <MoreHorizontal
        width={16}
        height={16}
        className="text-muted-foreground"
      />
    </div>
  );
};
