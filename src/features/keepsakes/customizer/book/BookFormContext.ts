import { useFormContext } from "react-hook-form";
import z from "zod";
import type { KeepsakeProductVariant } from "@/lib/api/types";

export type BookBinding = "hardcover" | "softcover" | "layflat";

export const bookFormSchema = z.object({
  paperType: z.string().min(1),
  sizeKey: z.string().min(1),
  photoIds: z.array(z.string()),
  coverText: z.string(),
  dedication: z.string(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export type BookCustomization = {
  binding: BookBinding;
  variantId: string | null;
  pages: Array<{ mediaId: string; order: number }>;
  coverText?: string;
  dedication?: string;
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
    pages: values.photoIds.map((mediaId, index) => ({
      mediaId,
      order: index,
    })),
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
