"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { PlayIcon } from "@ovation/icons/PlayIcon";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { MessageRowView } from "@/features/messages/adapters";

type ResumeCardProps = {
  message: MessageRowView | null;
};

export const ResumeCard = ({ message }: ResumeCardProps) => {
  const t = useTranslations();
  const router = useRouter();

  if (!message || !message.hasAudio) return null;

  const handleResume = () => {
    router.push(`${appRoutes.app.messages}?active=${message.id}`);
  };

  return (
    <Card>
      <CardContent className="tablet:flex-row tablet:items-center tablet:gap-6 flex flex-col gap-4">
        <Avatar size="lg" className="-rotate-3">
          <AvatarFallback
            className="type-body-small text-primary-foreground font-semibold"
            style={{ background: message.tint }}
          >
            {message.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="type-body-small text-muted-foreground">
            {t("dashboard__resume__pick_up")}
          </p>
          <p className="type-h3 mt-1 truncate leading-snug font-semibold">
            {message.name}
          </p>
          {message.duration && (
            <p className="type-body-small text-muted-foreground mt-1 italic">
              {message.duration}
            </p>
          )}
        </div>
        <Button
          onClick={handleResume}
          size="lg"
          className="shadow-primary/40 tablet:w-auto w-full gap-2.5 rounded-full shadow-md"
        >
          <PlayIcon width={16} height={16} />
          {t("dashboard__resume__continue")}
        </Button>
      </CardContent>
    </Card>
  );
};
