import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { messagesApi } from "@/lib/api/messages";
import { getCurrentUser } from "@/lib/auth/session";
import { toMessageRowView } from "@/features/messages/adapters";
import { DashboardGreeting } from "./components/DashboardGreeting";
import { ResumeCard } from "./components/ResumeCard";
import { StatLine } from "./components/StatLine";
import { MessageList } from "./components/MessageList";
import { NudgeCard } from "./components/NudgeCard";
import { DashboardEmpty } from "./components/DashboardEmpty";

const formatWeddingDate = (raw: string | null): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const greetingName = (fullName: string | null, email: string): string => {
  if (fullName?.trim()) return fullName.trim().split(/\s+/)[0]!;
  return email.split("@")[0] ?? "there";
};

export const DashboardPage = async () => {
  const t = await getTranslations();
  const anonymous = t("common__anonymous");
  const [user, eventsPage] = await Promise.all([
    getCurrentUser(),
    eventsApi.list({ limit: 1 }),
  ]);
  if (!user) redirect("/sign-in");
  const event = eventsPage.items[0];

  if (!event) {
    return (
      <DashboardEmpty userName={greetingName(user.fullName, user.email)} />
    );
  }

  const [stats, recentMessages] = await Promise.all([
    eventsApi.stats(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    messagesApi.list(event.id, { limit: 5, sort: "newest" }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const messageViews = (recentMessages?.items ?? []).map((m) =>
    toMessageRowView(m, anonymous),
  );
  const newMessages = stats?.totalMessages ?? messageViews.length;

  return (
    <div className="flex flex-col gap-6">
      <DashboardGreeting
        name={greetingName(user.fullName, user.email)}
        date={formatWeddingDate(event.weddingDate)}
        venue={event.venueName ?? ""}
        newMessages={newMessages}
      />
      <ResumeCard />
      {stats && <StatLine stats={stats} />}
      <MessageList
        messages={messageViews}
        totalCount={stats?.totalMessages ?? messageViews.length}
      />
      <NudgeCard />
    </div>
  );
};
