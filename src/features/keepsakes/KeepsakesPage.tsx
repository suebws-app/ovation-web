import { cookies } from "next/headers";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { containerClassName } from "@/lib/utils/layoutClassNames";
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
    <div className={containerClassName}>
      <div className="tablet:flex-row tablet:items-start tablet:justify-between flex flex-col items-start gap-4">
        <KeepsakesHero />
        <div className="tablet:self-auto self-end">
          <CurrencySelect />
        </div>
      </div>

      <KeepsakesCollection
        products={productsWithStartingPrice}
        eventId={eventId}
      />

      <KeepsakesFooter />
    </div>
  );
};
