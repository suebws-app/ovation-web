import { Avatar } from "@ovation/ui/components/Avatar";
import { Badge } from "@ovation/ui/components/Badge";
import { Camera } from "@ovation/icons/Camera";
import { VerifiedDot } from "./VerifiedDot";

type PartnerCardProps = {
  initials: string;
  tint: string;
  name: string;
  role: string;
  email: string;
  badgeLabel: string;
  badgeVariant: "default" | "destructive";
};

export const PartnerCard = ({
  initials,
  tint,
  name,
  role,
  email,
  badgeLabel,
  badgeVariant,
}: PartnerCardProps) => (
  <div className="flex gap-4.5 rounded-16 border border-border bg-card p-6">
    <div className="relative shrink-0">
      <Avatar initials={initials} tint={tint} size="lg" className="size-16 type-h3" />
      <button
        type="button"
        className="absolute -bottom-0.5 -right-0.5 flex size-5.5 cursor-pointer items-center justify-center rounded-full border border-border bg-card"
      >
        <Camera width={11} height={11} />
      </button>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-serif type-h3 font-semibold">{name}</span>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
      </div>
      <div className="mt-0.5 type-body-small text-muted-foreground">{role}</div>
      <div className="mt-2.5 type-body-small text-muted-foreground">
        {email}
      </div>
      <div className="mt-2.5">
        <VerifiedDot ok />
      </div>
    </div>
  </div>
);
