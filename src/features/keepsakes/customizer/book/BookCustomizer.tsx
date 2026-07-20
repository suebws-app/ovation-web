"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import {
  buildPaperFacets,
  buildSizeFacets,
  paperTypeOf,
  sizeKeyOf,
} from "../bookFacets";
import { cheapestVariant } from "../../designTokens";
import {
  bindingFromProductType,
  bookFormSchema,
  DEFAULT_COVER_TEMPLATE_ID,
  type BookFormValues,
} from "./BookFormContext";
import { BOOK_STEPS } from "./bookSteps";
import { BookStepPanel } from "./components/BookStepPanel";
import { BookWizardFooter } from "./components/BookWizardFooter";
import { BookReadinessBridge } from "./BookReadinessBridge";
import { useBookStepNavigation } from "./useBookStepNavigation";
import { useBookStore } from "./useBookStore";
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
    const cheapest = cheapestVariant(variants);
    const cheapestPaperType = cheapest ? paperTypeOf(cheapest) : null;
    const cheapestSizeKey = cheapest ? sizeKeyOf(cheapest) : null;
    const fallbackPaperType = buildPaperFacets(variants)[0] ?? "";
    const defaultPaperType = cheapestPaperType ?? fallbackPaperType;
    const defaultSizeKey =
      cheapestSizeKey ??
      (defaultPaperType
        ? (buildSizeFacets(
            variants.filter((v) => paperTypeOf(v) === defaultPaperType),
          )[0]?.sizeKey ?? "")
        : "");
    return {
      paperType: defaultPaperType,
      sizeKey: defaultSizeKey,
      photoIds: [],
      photoSelectAll: null,
      coverText: "",
      dedication: "",
      coverTemplateId: DEFAULT_COVER_TEMPLATE_ID,
      coverSlots: [],
      coverBgColor: "",
      coverTextColors: {},
      interiorDensity: "spacious",
    };
  }, [variants]);

  const form = useForm<BookFormValues>({
    resolver: standardSchemaResolver(bookFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const hydrated = useHydrateStore(useBookStore);
  const productKey = `${eventId ?? "none"}:${product.productType}`;
  const storedProductKey = useBookStore((s) => s.productKey);
  const setStep = useBookStore((s) => s.setStep);
  const setProductKey = useBookStore((s) => s.setProductKey);

  useEffect(() => {
    if (!hydrated) return;
    if (storedProductKey !== productKey) {
      setStep(BOOK_STEPS[0]);
      setProductKey(productKey);
    }
  }, [hydrated, storedProductKey, productKey, setStep, setProductKey]);

  const [canCheckout, setCanCheckout] = useState(false);
  const buyNowRef = useRef<(() => void) | null>(null);
  const registerBuyNow = useCallback((fn: (() => void) | null) => {
    buyNowRef.current = fn;
  }, []);
  const {
    step,
    stepIdx,
    isLastStep,
    handleNext,
    handleBack,
    photosError,
    nextDisabled,
  } = useBookStepNavigation({ methods: form, canCheckout });

  if (!hydrated || storedProductKey !== productKey) return null;

  return (
    <FormProvider {...form}>
      <BookReadinessBridge
        variants={variants}
        eventId={eventId}
        binding={binding}
        onReadyChange={setCanCheckout}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <BookStepPanel
          step={step}
          product={product}
          variants={variants}
          eventId={eventId}
          event={event}
          binding={binding}
          isPro={isPro}
          photosError={photosError}
          onRegisterBuyNow={registerBuyNow}
        />
        <BookWizardFooter
          stepIdx={stepIdx}
          isLastStep={isLastStep}
          nextDisabled={nextDisabled}
          onBack={handleBack}
          onNext={handleNext}
          onGoToCheckout={() => buyNowRef.current?.()}
        />
      </div>
    </FormProvider>
  );
};
