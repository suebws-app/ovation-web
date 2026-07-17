import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Card } from "@ovation/ui/components/Card";
import { Button } from "@ovation/ui/components/Button";
import { FeatureListItem } from "@ovation/ui/components/FeatureListItem";
import { Link } from "@/i18n/navigation";
import type { Tier } from "./constants";
import { PlanPrice } from "./PlanPrice";

type PricingCardProps = Omit<Tier, "key">;

export const PricingCard = ({
  highlighted,
  tagKey,
  nameKey,
  price,
  planCode,
  perKey,
  descKey,
  ctaKey,
  featKeys,
  href,
}: PricingCardProps) => {
  const t = useTranslations();

  return (
    <Card
      className={cn(
        "relative flex flex-col rounded-3xl p-8",
        highlighted && "border-primary scale-[1.02] border-2 shadow-2xl",
      )}
    >
      {highlighted && (
        <div className="bg-primary text-primary-foreground type-overline absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 font-bold tracking-wider shadow-md">
          {t("common__most_chosen")}
        </div>
      )}

      <span className="text-muted-foreground type-overline font-bold tracking-widest uppercase">
        {t(tagKey)}
      </span>

      <p className="type-h1 mt-1.5 font-semibold">{t(nameKey)}</p>

      <div className="mt-3 flex items-end gap-1.5">
        <span className="type-h0 leading-none font-semibold tracking-tight">
          {planCode ? (
            <PlanPrice planCode={planCode} fallbackPrice={price} />
          ) : (
            price
          )}
        </span>
        <span className="text-muted-foreground type-body-small mb-2.5">
          {t(perKey)}
        </span>
      </div>

      <p className="text-muted-foreground type-body-small mt-2 min-h-12">
        {t(descKey)}
      </p>

      <div className="bg-border my-6 h-px" />

      <ul className="flex flex-1 flex-col gap-3">
        {featKeys.map((featKey) => (
          <FeatureListItem
            key={featKey}
            checkClassName={highlighted ? "text-destructive" : "text-primary"}
          >
            {t(featKey)}
          </FeatureListItem>
        ))}
      </ul>

      <Button
        size="lg"
        variant={highlighted ? "default" : "outline"}
        className="mt-8 w-full self-end rounded-full"
        asChild
      >
        <Link href={href}>{t(ctaKey)}</Link>
      </Button>
    </Card>
  );
};
