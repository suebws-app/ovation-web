import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Button } from "@ovation/ui/components/Button";
import { PricingFeature } from "./PricingFeature";

type PricingCardProps = {
  tierKey: "essential" | "keepsake" | "gold";
  highlighted: boolean;
  tagKey: string;
  nameKey: string;
  priceKey: string;
  perKey: string;
  descKey: string;
  ctaKey: string;
  featKeys: string[];
  price: string;
};

export const PricingCard = ({
  highlighted,
  tagKey,
  nameKey,
  priceKey,
  perKey,
  descKey,
  ctaKey,
  featKeys,
  price,
}: PricingCardProps) => {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "relative flex min-h-146.5 flex-col rounded-3xl border p-8",
        highlighted
          ? "border-primary scale-[1.02] border-2 shadow-2xl"
          : "bg-card border-border shadow-sm",
      )}
    >
      {highlighted && (
        <>
          <div className="bg-primary text-primary-foreground type-overline absolute -top-3.5 left-8 rounded-full px-3 py-1.5 font-bold tracking-wider shadow-md">
            {t("common__most_chosen")}
          </div>
          <div className="bg-destructive/20 pointer-events-none absolute top-0 right-0 size-55 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        </>
      )}

      <span className="text-muted-foreground type-overline font-bold tracking-widest uppercase">
        {t(tagKey)}
      </span>

      <p className="type-h1 mt-1.5 font-serif font-semibold">{t(nameKey)}</p>

      <div className="mt-3 flex items-end gap-1.5">
        <span className="type-display font-serif leading-none font-semibold tracking-tight">
          {t(priceKey, { price })}
        </span>
        <span className="text-muted-foreground mb-2.5 text-sm">
          {t(perKey)}
        </span>
      </div>

      <p className="text-muted-foreground mt-2 min-h-12 text-sm">
        {t(descKey)}
      </p>

      <div className="bg-border my-6 h-px" />

      <ul className="flex flex-1 flex-col gap-3">
        {featKeys.map((featKey) => (
          <PricingFeature
            key={featKey}
            feat={t(featKey)}
            highlighted={highlighted}
          />
        ))}
      </ul>

      <Button
        size="lg"
        variant={highlighted ? "default" : "outline"}
        className="w-full self-end rounded-full"
      >
        {t(ctaKey)}
      </Button>
    </div>
  );
};
