import { keepsakesApi } from "@/lib/api/keepsakes";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";
import { computeStartingPriceCents } from "./designTokens";

export const EventKeepsakesPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const catalog = await keepsakesApi.catalog();

  const productsWithStartingPrice = await Promise.all(
    catalog.products.map(async (product) => {
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
      </div>

      <KeepsakesCollection products={productsWithStartingPrice} eventId={id} />

      <KeepsakesFooter />
    </div>
  );
};
