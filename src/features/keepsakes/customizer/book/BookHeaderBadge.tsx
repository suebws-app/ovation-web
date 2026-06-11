"use client";

import { BookBindingBadge } from "../BookBindingBadge";
import { usePeechoVariantResolver } from "./usePeechoVariantResolver";
import type { BookBinding } from "./BookFormContext";
import type { KeepsakeProductVariant } from "@/lib/api/types";

type BookHeaderBadgeProps = {
  binding: BookBinding;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

export const BookHeaderBadge = ({
  binding,
  variants,
  eventId,
}: BookHeaderBadgeProps) => {
  const { paperStock, pageWidthMm, pageHeightMm } =
    usePeechoVariantResolver(variants, eventId);
  return (
    <BookBindingBadge
      binding={binding}
      paperStock={paperStock}
      pageWidthMm={pageWidthMm}
      pageHeightMm={pageHeightMm}
    />
  );
};
