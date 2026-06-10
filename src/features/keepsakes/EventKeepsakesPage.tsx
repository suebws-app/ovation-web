import { keepsakesApi } from "@/lib/api/keepsakes";
import { ordersApi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { BundleBanner } from "./components/BundleBanner";
import { KeepsakesCollection } from "./components/KeepsakesCollection";
import { KeepsakesFeaturedRow } from "./components/KeepsakesFeaturedRow";
import { KeepsakesFooter } from "./components/KeepsakesFooter";
import { KeepsakesHero } from "./components/KeepsakesHero";
import { computeStartingPriceCents } from "./designTokens";

export const EventKeepsakesPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [catalog, ordersResult] = await Promise.all([
    keepsakesApi.catalog(),
    ordersApi
      .list({ eventId: id, limit: 5, orderType: "keepsake" })
      .catch((error) => {
        if (ApiError.isApiError(error) && error.status === 404)
          return { items: [], nextCursor: null };
        throw error;
      }),
  ]);

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

  const featured =
    productsWithStartingPrice.find((p) => p.productType === "hardcover") ??
    productsWithStartingPrice[0];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <KeepsakesHero />
      </div>
      {featured && (
        <KeepsakesFeaturedRow
          featured={featured}
          orders={ordersResult.items}
          eventId={id}
        />
      )}
      <BundleBanner />
      <KeepsakesCollection
        products={productsWithStartingPrice}
        eventId={id}
      />

      <KeepsakesFooter />
    </div>
  );
};
