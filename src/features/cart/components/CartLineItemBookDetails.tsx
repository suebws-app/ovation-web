"use client";

import { useTranslations } from "next-intl";
import { useCoverTemplatesQuery } from "@/lib/query/coverTemplatesQueries";
import {
  paperTypeLabelKeyFor,
  sizeLabelKeyFor,
} from "@/features/keepsakes/customizer/bookFacets";

const BOOK_PRODUCT_TYPES = new Set(["hardcover", "softcover", "layflat"]);

type BookCustomizationShape = {
  paperType?: string;
  sizeKey?: string;
  interiorDensity?: string;
  coverTemplateId?: string;
  pages?: unknown[];
};

type CartLineItemBookDetailsProps = {
  productType: string;
  customization: Record<string, unknown>;
  photoCount: number;
};

type Row = { label: string; value: string };

export const CartLineItemBookDetails = ({
  productType,
  customization,
  photoCount,
}: CartLineItemBookDetailsProps) => {
  const t = useTranslations();
  const { data } = useCoverTemplatesQuery();

  if (!BOOK_PRODUCT_TYPES.has(productType)) return null;

  const c = customization as BookCustomizationShape;
  const rows: Row[] = [];

  if (c.paperType) {
    const key = paperTypeLabelKeyFor(c.paperType);
    rows.push({
      label: t("keepsakes__book_customizer__summary_paper"),
      value: key ? t(key) : c.paperType,
    });
  }

  if (c.sizeKey) {
    const key = sizeLabelKeyFor(c.sizeKey);
    const [w, h] = c.sizeKey.split("x");
    rows.push({
      label: t("keepsakes__book_customizer__summary_size"),
      value: key
        ? t(key)
        : w && h
          ? t("keepsakes__book_customizer__size_custom", {
              width: w,
              height: h,
            })
          : c.sizeKey,
    });
  }

  if (c.interiorDensity) {
    rows.push({
      label: t("keepsakes__book_customizer__summary_layout"),
      value: t(
        `keepsakes__book_customizer__density_${c.interiorDensity}_label`,
      ),
    });
  }

  rows.push({
    label: t("keepsakes__book_customizer__summary_photos"),
    value: String(photoCount),
  });

  if (c.coverTemplateId) {
    const coverName = (data?.templates ?? []).find(
      (tpl) => tpl.id === c.coverTemplateId,
    )?.name;
    if (coverName) {
      rows.push({
        label: t("keepsakes__book_customizer__summary_cover"),
        value: coverName,
      });
    }
  }

  if (rows.length === 0) return null;

  return (
    <dl className="mt-2 flex flex-col gap-0.5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="type-caption text-muted-foreground flex gap-1.5"
        >
          <dt>{row.label}:</dt>
          <dd className="text-foreground font-medium">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};
