"use client";

import { useTranslations } from "next-intl";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { BoxIcon } from "@ovation/icons/BoxIcon";
import type { AccountAnalytics } from "@/lib/api/types";
import { AnalyticsStatCard } from "./AnalyticsStatCard";

type AnalyticsStatGridProps = {
  data: AccountAnalytics;
};

export const AnalyticsStatGrid = ({ data }: AnalyticsStatGridProps) => {
  const t = useTranslations();

  const cards = [
    {
      key: "events",
      value: String(data.events.total),
      label: t("analytics__stats__total_events"),
      sub: t("analytics__stats__active_events", {
        count: data.events.active,
      }),
      icon: CalendarIcon,
      tone: "primary" as const,
    },
    {
      key: "guests",
      value: String(data.engagement.guests),
      label: t("analytics__stats__guests"),
      sub: t("analytics__stats__guests_sub"),
      icon: UsersIcon,
      tone: "primary" as const,
    },
    {
      key: "messages",
      value: String(data.engagement.messages),
      label: t("analytics__stats__messages"),
      sub: t("analytics__stats__messages_sub", {
        audio: data.engagement.audio,
        written: data.engagement.written,
      }),
      icon: MessageSquareIcon,
      tone: "primary" as const,
    },
    {
      key: "media",
      value: String(data.engagement.photos + data.engagement.videos),
      label: t("analytics__stats__media"),
      sub: t("analytics__stats__media_sub", {
        photos: data.engagement.photos,
        videos: data.engagement.videos,
      }),
      icon: ImageIcon,
      tone: "accent" as const,
    },
    {
      key: "orders",
      value: String(data.orders.count),
      label: t("analytics__stats__orders"),
      sub: t("analytics__stats__orders_sub"),
      icon: BoxIcon,
      tone: "accent" as const,
    },
  ];

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <AnalyticsStatCard
          key={card.key}
          value={card.value}
          label={card.label}
          sub={card.sub}
          icon={card.icon}
          tone={card.tone}
        />
      ))}
    </div>
  );
};
