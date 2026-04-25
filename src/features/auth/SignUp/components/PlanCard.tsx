"use client";

import { cn } from "@ovation/ui/utils/cn";
import { Button } from "@ovation/ui/components/Button";
import { Check } from "@ovation/icons/Check";

type PlanCardProps = {
  name: string;
  price: string;
  per: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  onSelect?: () => void;
};

export const PlanCard = ({
  name,
  price,
  per,
  description,
  features,
  highlighted = false,
  onSelect,
}: PlanCardProps) => (
  <div
    className={cn(
      "rounded-20 relative p-7",
      highlighted
        ? "border-primary bg-card shadow-primary/20 scale-[1.02] border-2 shadow-lg"
        : "border-border bg-background border",
    )}
  >
    {highlighted && <MostChosenBadge />}
    <p className="font-serif text-[1.625rem] font-semibold">{name}</p>
    <div className="mt-2.5 flex items-baseline gap-1.5">
      <span className="font-serif text-[2.75rem] font-semibold tracking-tight">
        {price}
      </span>
      <span className="type-caption text-muted-foreground">{per}</span>
    </div>
    <p className="type-body-small text-muted-foreground mt-2.5 min-h-[42px] leading-relaxed">
      {description}
    </p>
    <div className="bg-border my-4.5 h-px" />
    <div className="flex flex-col gap-2.5">
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
      {highlighted ? `Choose ${name}` : `Choose ${name}`}
    </Button>
  </div>
);

const MostChosenBadge = () => (
  <div className="bg-destructive type-caption text-primary-foreground shadow-destructive/40 absolute -top-3 left-6 rounded-full px-3 py-1.5 font-bold tracking-wider shadow-md">
    MOST CHOSEN
  </div>
);

const PlanFeature = ({ label }: { label: string }) => (
  <div className="type-body-small flex items-start gap-2">
    <Check
      width={14}
      height={14}
      className="text-primary mt-0.5 shrink-0"
      strokeWidth={2.2}
    />
    {label}
  </div>
);
