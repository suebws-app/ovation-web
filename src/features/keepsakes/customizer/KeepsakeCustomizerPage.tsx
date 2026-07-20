import { notFound } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth/session";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { CustomizerHeader } from "./CustomizerHeader";
import { BookCustomizer } from "./book/BookCustomizer";
import { UnsupportedProductCard } from "./UnsupportedProductCard";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const snell = localFont({
  src: "../../../app/[locale]/fonts/snell-roundhand-regular.woff2",
  variable: "--font-snell",
  display: "swap",
});

const coverFontClasses = `${cormorant.variable} ${snell.variable}`;

const BOOK_PRODUCT_TYPES = new Set(["hardcover", "softcover", "layflat"]);

type KeepsakeCustomizerPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export const KeepsakeCustomizerPage = async ({
  params,
}: KeepsakeCustomizerPageProps) => {
  const { id, slug } = await params;

  const [detail, eventResult, user] = await Promise.all([
    keepsakesApi.productByType(slug).catch((error) => {
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
  const isPro = user?.accountType === "pro";

  return (
    <div className={containerClassName}>
      <CustomizerHeader product={detail.product} />
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
      <div className={`${coverFontClasses} contents`}>
        <BookCustomizer
          product={product}
          variants={variants}
          eventId={event.id}
          event={event}
          isPro={isPro}
        />
      </div>
    );
  }
  return <UnsupportedProductCard />;
};
