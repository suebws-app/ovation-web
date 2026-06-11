"use client";

import { MinusIcon } from "@ovation/icons/MinusIcon";
import { PlusIcon } from "@ovation/icons/PlusIcon";

type QuantityStepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
};

export const QuantityStepper = ({
  value,
  onIncrement,
  onDecrement,
  min = 1,
}: QuantityStepperProps) => (
  <div className="border-border bg-card inline-flex items-center rounded-full border">
    <button
      type="button"
      onClick={onDecrement}
      disabled={value <= min}
      aria-label="Decrease quantity"
      className="text-muted-foreground hover:bg-muted/40 inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
    >
      <MinusIcon width={13} height={13} />
    </button>
    <span className="type-body-small min-w-6 text-center font-semibold">
      {value}
    </span>
    <button
      type="button"
      onClick={onIncrement}
      aria-label="Increase quantity"
      className="text-muted-foreground hover:bg-muted/40 inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors"
    >
      <PlusIcon width={13} height={13} />
    </button>
  </div>
);
