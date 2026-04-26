"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Check } from "@ovation/icons/Check";
import { MessageBatchAction } from "./MessageBatchAction";

type MessageBatchBarProps = {
  count: number;
  combinedDuration: string;
};

export const MessageBatchBar = ({
  count,
  combinedDuration,
}: MessageBatchBarProps) => {
  const t = useTranslations();
  if (count === 0) return null;

  const actions = [
    t("messages__batch__action_favourite"),
    t("messages__batch__action_download"),
    t("messages__batch__action_translate"),
    t("messages__batch__action_tag"),
  ];

  return (
    <div className="border-border bg-foreground text-background tablet:px-6 flex items-center gap-3 border-b px-4 py-2.5">
      <div className="rounded-4 bg-secondary flex size-5 items-center justify-center">
        <Check
          width={13}
          height={13}
          className="text-foreground"
          strokeWidth={2.5}
        />
      </div>
      <span className="type-body-small font-semibold">
        {t("messages__batch__selected", { count })}
      </span>
      <span className="type-caption opacity-65">
        {t("messages__batch__combined_duration", {
          duration: combinedDuration,
        })}
      </span>
      <div className="desktop:flex ml-auto hidden gap-1.5">
        {actions.map((label) => (
          <MessageBatchAction key={label} label={label} />
        ))}
        <Button size="sm" className="rounded-full">
          {t("messages__batch__add_to_book")}
        </Button>
      </div>
    </div>
  );
};
