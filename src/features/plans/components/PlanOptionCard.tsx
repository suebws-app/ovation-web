"use client";

import { Card } from "@ovation/ui/components/Card";
import { FeatureListItem } from "@ovation/ui/components/FeatureListItem";
import { cn } from "@ovation/ui/utils/cn";

type PlanOptionCardProps = {
  planKey: string;
  isSelected: boolean;
  tagLabel: string;
  name: string;
  price: string;
  per: string;
  desc: string;
  features: string[];
  onSelect: (key: string) => void;
};

export const PlanOptionCard = ({
  planKey,
  isSelected,
  tagLabel,
  name,
  price,
  per,
  desc,
  features,
  onSelect,
}: PlanOptionCardProps) => (
  <button type="button" onClick={() => onSelect(planKey)} className="w-full text-left">
    <Card
      className={cn(
        "relative flex h-full flex-col rounded-3xl p-8 transition-all",
        isSelected
          ? "border-primary border-2 shadow-lg"
          : "hover:border-primary/40 border-2 border-transparent",
      )}
    >
      {isSelected && (
        <div className="bg-primary text-primary-foreground type-overline absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 font-bold tracking-wider shadow-md">
          {tagLabel}
        </div>
      )}
      <p className="type-h2 font-semibold">{name}</p>
      <div className="mt-3 flex items-end gap-1.5">
        <span className="type-display leading-none font-semibold tracking-tight">
          {price}
        </span>
        <span className="text-muted-foreground type-body-small mb-2.5">{per}</span>
      </div>
      <p className="text-muted-foreground type-body-small mt-2">{desc}</p>
      <div className="bg-border my-5 h-px" />
      <ul className="flex flex-1 flex-col gap-3">
        {features.map((feat) => (
          <FeatureListItem
            key={feat}
            checkClassName={isSelected ? "text-destructive" : "text-primary"}
          >
            {feat}
          </FeatureListItem>
        ))}
      </ul>
    </Card>
  </button>
);
