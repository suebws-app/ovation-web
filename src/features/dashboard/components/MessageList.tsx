import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MessageRowView } from "@/features/messages/adapters";
import { MessageRow } from "./MessageRow";

type MessageListProps = {
  messages: MessageRowView[];
  totalCount: number;
};

export const MessageList = ({ messages, totalCount }: MessageListProps) => {
  const t = useTranslations();

  if (messages.length === 0) {
    return (
      <div className="rounded-20 border-border bg-card border p-8 text-center">
        <h2 className="type-h2 font-serif font-semibold">
          {t("dashboard__messages__empty_title")}
        </h2>
        <p className="type-body-small text-muted-foreground mt-2">
          {t("dashboard__messages__empty_body")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="type-h2 font-serif font-semibold">
          {t("dashboard__messages__title")}
        </h2>
        <Link
          href={`/app/messages`}
          className="type-body-small text-primary font-semibold"
        >
          {t("dashboard__messages__see_all", { count: totalCount })}
        </Link>
      </div>

      <div className="rounded-20 border-border bg-card overflow-hidden border">
        {messages.map((m, i) => (
          <MessageRow
            key={m.id}
            name={m.name}
            relation={m.relation}
            quote={m.quote}
            initials={m.initials}
            tint={m.tint}
            wave={m.wave}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};
