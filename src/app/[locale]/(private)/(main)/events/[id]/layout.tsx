import { eventsApi } from "@/lib/api/events";
import { EventContextProvider } from "@/features/events/EventContext";
import { EventLabelSync } from "@/features/events/EventLabelSync";
import { LastEventCookieSync } from "@/features/events/LastEventCookieSync";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const result = await eventsApi.get(id).catch(() => null);
  const event = result?.event;
  const datePart = event?.weddingDate
    ? new Date(event.weddingDate).toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      })
    : null;
  const label = event
    ? datePart
      ? `${event.partnerAName} & ${event.partnerBName} · ${datePart}`
      : `${event.partnerAName} & ${event.partnerBName}`
    : id;

  return (
    <EventContextProvider id={id}>
      <EventLabelSync label={label} />
      <LastEventCookieSync eventId={id} />
      {children}
    </EventContextProvider>
  );
}
