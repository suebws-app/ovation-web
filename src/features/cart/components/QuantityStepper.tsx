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
  <div className="border-border bg-card rounded-full inline-flex items-center border">
    <button
      type="button"
      onClick={onDecrement}
      disabled={value <= min}
      aria-label="Decrease quantity"
      className="size-7 rounded-full inline-flex items-center justify-center text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/40 cursor-pointer transition-colors"
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
      className="size-7 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-muted/40 cursor-pointer transition-colors"
    >
      <PlusIcon width={13} height={13} />
    </button>
  </div>
);
