import { cookies } from "next/headers";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { ordersApi } from "@/lib/api/orders";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { BundleBanner } from "./components/BundleBanner";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFeaturedRow } from "./components/KeepsakesFeaturedRow";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";

export const KeepsakesPage = async () => {
  const cookieStore = await cookies();
  const lastEventId = cookieStore.get("ovation_last_event_id")?.value ?? null;
  const [catalog, eventsResult] = await Promise.all([
    keepsakesApi.catalog(),
    eventsApi.list({ limit: 100 }),
  ]);

  const eventId =
    (lastEventId &&
      eventsResult.items.find((e) => e.id === lastEventId)?.id) ||
    eventsResult.items[0]?.id ||
    null;

  const ordersResult = eventId
    ? await ordersApi
        .list({ eventId, limit: 5, orderType: "keepsake" })
        .catch((error) => {
          if (ApiError.isApiError(error) && error.status === 404)
            return { items: [], nextCursor: null };
          throw error;
        })
    : { items: [], nextCursor: null };
  const featured =
    catalog.products.find((p) => p.sku === "hardcover_book") ??
    catalog.products[0];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-6">
      <KeepsakesHero />
      {featured && (
        <KeepsakesFeaturedRow
          featured={featured}
          orders={ordersResult.items}
          eventId={eventId}
        />
      )}
      <BundleBanner />
      <KeepsakesCollection products={catalog.products} eventId={eventId} />

      <KeepsakesFooter />
    </div>
  );
};
