import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";

import { appRoutes } from "@/lib/routes";
import { formatPrice, type DesignedProduct } from "../designTokens";
import { ProductTag } from "./ProductTag";

type ProductCardProps = {
  product: DesignedProduct;
  eventId: string | null;
  tag?: string;
};

export const ProductCard = ({ product, eventId, tag }: ProductCardProps) => {
  const t = useTranslations();
  const { name, description, priceCents, currency, timelineDays, design } =
    product;
  const dark = Boolean(design.dark);
  const isComingSoon = Boolean(product.comingSoon);
  const canOrder = Boolean(eventId) && !isComingSoon;
  const effectiveTag = isComingSoon
    ? t("keepsakes__product__coming_soon")
    : tag;

  return (
    <div className="rounded-20 border-border bg-card flex flex-col overflow-hidden border">
      <div
        className="relative flex h-45 items-center justify-center p-5"
        style={{ background: design.gradient }}
      >
        <p
          className="type-h2 text-center leading-tight font-semibold italic"
          style={{
            color: dark ? "#fff" : "var(--foreground)",
            textShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {t(design.headlineKey)}
        </p>
        {effectiveTag && <ProductTag label={effectiveTag} dark={dark} />}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4.5">
        <div className="flex items-start justify-between gap-3">
          <p className="type-h4 font-semibold">{name ? t(name) : ""}</p>
          {!isComingSoon && (
            <div className="flex shrink-0 flex-col items-end leading-tight">
              <span className="type-caption text-muted-foreground">
                {t("keepsakes__product__starting_from")}
              </span>
              <span className="type-body-large text-primary font-serif font-semibold">
                {formatPrice(priceCents, currency)}
              </span>
            </div>
          )}
        </div>
        <p className="type-caption text-muted-foreground tracking-wider">
          {product.subtitle ? t(product.subtitle) : t(design.subtitleKey)}
          {timelineDays
            ? ` · ${t("keepsakes__product__ships_in", { days: timelineDays })}`
            : ""}
        </p>
        <p className="type-body-small text-foreground mt-1.5 leading-relaxed">
          {t(design.taglineKey) || (description ? t(description) : "")}
        </p>
        <div className="mt-auto flex gap-2 pt-3.5">
          {isComingSoon ? (
            <Button
              size="sm"
              disabled
              className="bg-foreground text-background flex-1 rounded-full"
            >
              {t("keepsakes__product__coming_soon")}
            </Button>
          ) : canOrder && eventId ? (
            <Button
              asChild
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 flex-1 rounded-full"
            >
              <Link
                href={appRoutes.app.eventKeepsakeCustomizer(
                  eventId,
                  product.productType,
                )}
              >
                {t("keepsakes__product__order")}
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              disabled
              className="bg-foreground text-background flex-1 rounded-full"
            >
              {t("keepsakes__product__create_first")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
