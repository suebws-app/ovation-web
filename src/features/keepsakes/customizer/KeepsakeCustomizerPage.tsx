import { notFound } from "next/navigation";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth/session";
import { designFor } from "../designTokens";
import { CustomizerHeader } from "./CustomizerHeader";
import { BookCustomizer } from "./book/BookCustomizer";
import { UnsupportedProductCard } from "./UnsupportedProductCard";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

const BOOK_PRODUCT_TYPES = new Set([
  "hardcover_book",
  "softcover_book",
  "layflat_book",
]);

type KeepsakeCustomizerPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export const KeepsakeCustomizerPage = async ({
  params,
}: KeepsakeCustomizerPageProps) => {
  const { id, slug } = await params;

  const [detail, eventResult, user] = await Promise.all([
    keepsakesApi.productBySlug(slug).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.get(id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    getCurrentUser(),
  ]);

  if (!detail || !eventResult) notFound();

  const event = eventResult.event;
  const design = designFor(detail.product.sku);
  const isPro = user?.accountType === "pro";

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-6">
      <CustomizerHeader
        product={detail.product}
        design={design}
        eventId={event.id}
      />
      <KeepsakeCustomizerSwitch
        product={detail.product}
        variants={detail.variants}
        event={event}
        isPro={isPro}
      />
    </div>
  );
};

type SwitchProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  event: Event;
  isPro: boolean;
};

const KeepsakeCustomizerSwitch = ({
  product,
  variants,
  event,
  isPro,
}: SwitchProps) => {
  if (BOOK_PRODUCT_TYPES.has(product.productType)) {
    return (
      <BookCustomizer
        product={product}
        variants={variants}
        eventId={event.id}
        event={event}
        isPro={isPro}
      />
    );
  }
  return <UnsupportedProductCard />;
};
