import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { messagesApi } from "@/lib/api/messages";
import { toMessageRowView } from "@/features/messages/adapters";
import { Messages } from "../components/widgets/Messages";
import { getEventStats } from "./dashboardStats";

type MessagesSectionProps = {
  eventId: string;
};

export const MessagesSection = async ({ eventId }: MessagesSectionProps) => {
  const t = await getTranslations();
  const anonymous = t("common__anonymous");

  const [stats, recentMessages] = await Promise.all([
    getEventStats(eventId),
    messagesApi.list(eventId, { limit: 5, sort: "newest" }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const messageViews = (recentMessages?.items ?? []).map((m) =>
    toMessageRowView(m, anonymous),
  );
  const totalMessages = stats?.totalMessages ?? messageViews.length;

  return (
    <Messages
      eventId={eventId}
      messages={messageViews}
      totalCount={totalMessages}
    />
  );
};
