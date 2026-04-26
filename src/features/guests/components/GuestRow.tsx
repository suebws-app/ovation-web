import { Avatar } from "@ovation/ui/components/Avatar";
import { Heart } from "@ovation/icons/Heart";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { MoreHorizontal } from "@ovation/icons/MoreHorizontal";
import { GuestStatusPill } from "./GuestStatusPill";
import { ContactIcon, type ContactType } from "./ContactIcon";

type GuestRowProps = {
  initials: string;
  tint: string;
  name: string;
  relation: string;
  group: string;
  table: string;
  contact: string;
  contactType: ContactType;
  contributed: boolean;
  thanked: boolean;
  favorited: boolean;
  messageCount: number;
  hasPhoto: boolean;
  nudged?: string;
  wasNudged?: boolean;
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
  contactType,
  contributed,
  thanked,
  favorited,
  messageCount,
  hasPhoto,
  nudged,
  wasNudged,
  isLast,
}: GuestRowProps) => (
  <div
    className={`grid grid-cols-[28px_minmax(220px,1.4fr)_140px_150px_150px_120px_36px] items-center gap-3.5 px-6 py-3.5 ${
      isLast ? "" : "border-border border-b"
    }`}
  >
    <input type="checkbox" className="accent-primary size-4" />
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
        <div className="type-caption text-muted-foreground truncate">
          {relation}
        </div>
      </div>
    </div>
    <div>
      <div className="type-caption">{group}</div>
      <div className="type-caption text-muted-foreground mt-0.5">{table}</div>
    </div>
    <div className="type-caption text-muted-foreground flex items-center gap-1.5 overflow-hidden">
      <ContactIcon type={contactType} />
      <span className="truncate">{contact}</span>
    </div>
    <GuestStatusPill
      contributed={contributed}
      thanked={thanked}
      wasNudged={wasNudged}
    />
    <div className="type-caption text-muted-foreground flex items-center gap-2">
      {contributed ? (
        <>
          <span className="text-foreground font-semibold">
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
    <MoreHorizontal width={16} height={16} className="text-muted-foreground" />
  </div>
);
