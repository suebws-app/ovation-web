import { useTranslations } from "next-intl";
import { Mic } from "@ovation/icons/Mic";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Heart } from "@ovation/icons/Heart";
import { Mail } from "@ovation/icons/Mail";
import type { EventStats, InvitationStats } from "@/lib/api/types";
import { GuestStatCard } from "./GuestStatCard";

type GuestStatBarProps = {
  stats: EventStats;
  invitations: InvitationStats | null;
};

export const GuestStatBar = ({ stats, invitations }: GuestStatBarProps) => {
  const t = useTranslations();
  const items = [
    {
      value: stats.totalMessages,
      label: t("guests__stats__messages"),
      sub: t("guests__stats__messages_sub", {
        audio: stats.audioMessages,
        written: stats.writtenMessages,
      }),
      icon: Mic,
      tone: "primary" as const,
    },
    {
      value: stats.photoMessages,
      label: t("guests__stats__with_photo"),
      sub: t("guests__stats__with_photo_sub", { count: stats.videoMessages }),
      icon: ImageIcon,
      tone: "primary" as const,
    },
    {
      value: stats.favorites,
      label: t("guests__stats__favourited"),
      sub: t("guests__stats__favourited_sub"),
      icon: Heart,
      tone: "accent" as const,
    },
    {
      value: invitations?.totals.sent ?? 0,
      label: t("guests__stats__invites"),
      sub: t("guests__stats__invites_sub", {
        opened: invitations?.totals.opened ?? 0,
      }),
      icon: Mail,
      tone: invitations?.totals.sent
        ? ("primary" as const)
        : ("muted" as const),
    },
  ];

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid grid-cols-2 gap-4">
      {items.map((stat) => (
        <GuestStatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          sub={stat.sub}
          icon={stat.icon}
          tone={stat.tone}
        />
      ))}
    </div>
  );
};
