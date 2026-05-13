import { notFound } from "next/navigation";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { designFor } from "../designTokens";
import { CustomizerHeader } from "./CustomizerHeader";
import { GoldBookCustomizer } from "./GoldBookCustomizer";
import { VideoMontageCustomizer } from "./VideoMontageCustomizer";
import { AudioVinylCustomizer } from "./AudioVinylCustomizer";
import { DigitalAlbumCustomizer } from "./DigitalAlbumCustomizer";
import { ThankYouCardsCustomizer } from "./ThankYouCardsCustomizer";
import { CanvasPrintCustomizer } from "./CanvasPrintCustomizer";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type KeepsakeCustomizerPageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export const KeepsakeCustomizerPage = async ({
  params,
}: KeepsakeCustomizerPageProps) => {
  const { id, slug } = await params;

  const [detail, eventResult] = await Promise.all([
    keepsakesApi.productBySlug(slug).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.get(id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  if (!detail || !eventResult) notFound();

  const event = eventResult.event;
  const design = designFor(detail.product.sku);

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      <CustomizerHeader product={detail.product} design={design} />
      <KeepsakeCustomizerSwitch
        productType={detail.product.productType}
        product={detail.product}
        variants={detail.variants}
        event={event}
      />
    </div>
  );
};

type SwitchProps = {
  productType: string;
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  event: Event;
};

const KeepsakeCustomizerSwitch = ({
  productType,
  product,
  variants,
  event,
}: SwitchProps) => {
  const eventId = event.id;
  switch (productType) {
    case "gold_book":
      return (
        <GoldBookCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
        />
      );
    case "video_montage":
      return (
        <VideoMontageCustomizer
          product={product}
          eventId={eventId}
          event={event}
        />
      );
    case "audio_vinyl":
      return (
        <AudioVinylCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
        />
      );
    case "digital_album":
      return (
        <DigitalAlbumCustomizer
          product={product}
          eventId={eventId}
          event={event}
        />
      );
    case "thank_you_cards":
      return (
        <ThankYouCardsCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
        />
      );
    case "canvas_print":
      return (
        <CanvasPrintCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
        />
      );
    default:
      return (
        <DigitalAlbumCustomizer
          product={product}
          eventId={eventId}
          event={event}
        />
      );
  }
};
