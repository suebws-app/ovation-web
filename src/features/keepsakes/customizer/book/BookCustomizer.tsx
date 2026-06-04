"use client";

import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { paperTypeOf, sizeKeyOf } from "../bookFacets";
import {
  bindingFromProductType,
  bookFormSchema,
  type BookFormValues,
} from "./BookFormContext";
import { BookCheckoutPanel } from "./BookCheckoutPanel";
import { BookHeaderBadge } from "./BookHeaderBadge";
import { PaperSelect } from "./PaperSelect";
import { SizeSelect } from "./SizeSelect";
import { PageCountSection } from "./PageCountSection";
import { PersonalizeSection } from "./PersonalizeSection";
import { SpineNote } from "./SpineNote";
import { useSelectScrollSnapshot } from "./useSelectScrollSnapshot";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type BookCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const BookCustomizer = ({
  product,
  variants,
  eventId,
  event,
  isPro = false,
}: BookCustomizerProps) => {
  const binding = bindingFromProductType(product.productType);

  const defaultValues = useMemo<BookFormValues>(() => {
    const firstVariant = variants[0] ?? null;
    return {
      paperType: firstVariant ? (paperTypeOf(firstVariant) ?? "") : "",
      sizeKey: firstVariant ? sizeKeyOf(firstVariant) : "",
      photoIds: [],
      coverText: "",
      dedication: "",
    };
  }, [variants]);

  const form = useForm<BookFormValues>({
    resolver: standardSchemaResolver(bookFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { rootRef, onSelectOpenChange } = useSelectScrollSnapshot();

  return (
    <FormProvider {...form}>
      <div
        ref={rootRef}
        className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6"
      >
        <div className="flex flex-col gap-6">
          <BookHeaderBadge binding={binding} variants={variants} />
          <PaperSelect
            variants={variants}
            onOpenChange={onSelectOpenChange}
          />
          <SizeSelect variants={variants} onOpenChange={onSelectOpenChange} />
          <PageCountSection
            variants={variants}
            eventId={eventId}
            event={event}
            isPro={isPro}
          />
          <PersonalizeSection variants={variants} />
          <SpineNote binding={binding} />
        </div>
        <BookCheckoutPanel
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
          binding={binding}
          isPro={isPro}
        />
      </div>
    </FormProvider>
  );
};
