import { useFormContext } from "react-hook-form";
import z from "zod";
import type { KeepsakeProductVariant } from "@/lib/api/types";

export type BookBinding = "hardcover" | "softcover" | "layflat";

export const DEFAULT_COVER_TEMPLATE_ID = "ivory_classic";

export const coverSlotSchema = z.object({
  slotId: z.string(),
  mediaId: z.string(),
});

export type CoverSlot = z.infer<typeof coverSlotSchema>;

export const photoSelectAllSchema = z
  .object({
    filter: z.enum(["all", "favorites", "gold_book"]),
    excludedIds: z.array(z.string()),
  })
  .nullable();

export const bookFormSchema = z.object({
  paperType: z.string().min(1),
  sizeKey: z.string().min(1),
  photoIds: z.array(z.string()),
  photoSelectAll: photoSelectAllSchema,
  coverText: z.string(),
  dedication: z.string(),
  coverTemplateId: z.string().min(1),
  coverSlots: z.array(coverSlotSchema),
  coverBgColor: z.string(),
  coverTextColors: z.record(z.string(), z.string()),
  interiorDensity: z.enum(["spacious", "balanced", "compact"]),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export type BookCustomization = {
  binding: BookBinding;
  variantId: string | null;
  pages: Array<{ mediaId: string; order: number }>;
  coverText?: string;
  dedication?: string;
  coverTemplateId: string;
  coverSlots: CoverSlot[];
  coverBgColor?: string;
  coverTextColors?: Record<string, string>;
  interiorDensity?: "spacious" | "balanced" | "compact";
};

export type BuildCustomizationOptions = {
  supportsCoverText: boolean;
  supportsDedication: boolean;
};

export const buildCustomization = (
  values: BookFormValues,
  chosenVariant: KeepsakeProductVariant | null,
  binding: BookBinding,
  options: BuildCustomizationOptions,
): BookCustomization => {
  const trimmedCoverText = values.coverText.trim();
  const trimmedDedication = values.dedication.trim();
  return {
    binding,
    variantId: chosenVariant?.id ?? null,
    coverTemplateId: values.coverTemplateId,
    coverSlots: values.coverSlots,
    pages: values.photoIds.map((mediaId, index) => ({
      mediaId,
      order: index,
    })),
    ...(values.coverBgColor ? { coverBgColor: values.coverBgColor } : {}),
    ...(values.coverTextColors && Object.keys(values.coverTextColors).length > 0
      ? { coverTextColors: values.coverTextColors }
      : {}),
    interiorDensity: values.interiorDensity,
    ...(options.supportsCoverText && trimmedCoverText
      ? { coverText: trimmedCoverText }
      : {}),
    ...(options.supportsDedication && trimmedDedication
      ? { dedication: trimmedDedication }
      : {}),
  };
};

export const useBookForm = () => useFormContext<BookFormValues>();

export const bindingFromProductType = (productType: string): BookBinding => {
  switch (productType) {
    case "hardcover":
      return "hardcover";
    case "softcover":
      return "softcover";
    case "layflat":
      return "layflat";
    default:
      return "hardcover";
  }
};
