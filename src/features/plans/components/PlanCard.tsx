"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Button } from "@ovation/ui/components/Button";
import { MostChosenBadge } from "./MostChosenBadge";
import { PlanFeature } from "./PlanFeature";

type PlanCardProps = {
  name: string;
  price: string;
  per: string;
  description: string;
  features: string[];
  priceNote?: string;
  /**
   * When true (recurring/paid plans), render the
   * `signup__pricing__billing_disclaimer` line under the price. Hidden for
   * free tier where there is no billing.
   */
  showBillingDisclaimer?: boolean;
  highlighted?: boolean;
  onSelect?: () => void;
};

export const PlanCard = ({
  name,
  price,
  per,
  description,
  features,
  priceNote,
  showBillingDisclaimer = false,
  highlighted = false,
  onSelect,
}: PlanCardProps) => {
  const t = useTranslations();
  return (
    <div
      className={cn(
        "rounded-20 relative flex h-full flex-col p-7",
        highlighted
          ? "border-primary bg-card shadow-primary/20 scale-[1.02] border-2 shadow-lg"
          : "border-border bg-background border",
      )}
    >
      {highlighted && <MostChosenBadge />}
      <p className="type-h2 font-semibold">{name}</p>
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="type-h1 font-semibold tracking-tight">{price}</span>
        <span className="type-caption text-muted-foreground">{per}</span>
      </div>
      {priceNote && (
        <p className="type-caption text-muted-foreground mt-1 leading-tight">
          {priceNote}
        </p>
      )}
      {showBillingDisclaimer && (
        <p className="type-caption text-muted-foreground mt-1 leading-tight">
          {t("signup__pricing__billing_disclaimer")}
        </p>
      )}
      <p className="type-body-small text-muted-foreground mt-2.5 min-h-10.5 leading-relaxed">
        {description}
      </p>
      <div className="bg-border my-4.5 h-px" />
      <div className="flex flex-1 flex-col gap-2.5">
        {features.map((feature) => (
          <PlanFeature key={feature} label={feature} />
        ))}
      </div>
      <Button
        onClick={onSelect}
        variant={highlighted ? "default" : "outline"}
        className={cn(
          "mt-6 w-full rounded-full",
          highlighted && "shadow-primary/40 shadow-md",
        )}
      >
        {t("signup__pricing__choose", { name })}
      </Button>
    </div>
  );
};
