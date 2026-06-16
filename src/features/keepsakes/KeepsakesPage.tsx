import { cookies } from "next/headers";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";
import { computeStartingPriceCents } from "./designTokens";
import { CurrencySelect } from "@/components/CurrencySelect";

export const KeepsakesPage = async () => {
  const cookieStore = await cookies();
  const lastEventId = cookieStore.get("ovation_last_event_id")?.value ?? null;
  const [catalog, eventsResult] = await Promise.all([
    keepsakesApi.catalog(),
    eventsApi.list({ limit: 100 }),
  ]);

  const eventId =
    (lastEventId && eventsResult.items.find((e) => e.id === lastEventId)?.id) ||
    eventsResult.items[0]?.id ||
    null;

  const productsWithStartingPrice = await Promise.all(
    catalog.products.map(async (product) => {
      if (product.comingSoon) return product;
      const detail = await keepsakesApi
        .productByType(product.productType)
        .catch(() => null);
      const startingPriceCents = detail
        ? computeStartingPriceCents(detail.variants, product.priceCents)
        : product.priceCents;
      return { ...product, priceCents: startingPriceCents };
    }),
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <KeepsakesHero />
        <CurrencySelect />
      </div>

      <KeepsakesCollection
        products={productsWithStartingPrice}
        eventId={eventId}
      />

      <KeepsakesFooter />
    </div>
  );
};
