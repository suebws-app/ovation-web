"use client";

import { Button } from "@ovation/ui/components/Button";
import {
  INVITATION_SEATS_MAX,
  INVITATION_SEATS_MIN,
} from "../invitationSchema";

type SeatsStepperProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  onFocus?: () => void;
};

const clamp = (n: number) => {
  if (Number.isNaN(n)) return INVITATION_SEATS_MIN;
  return Math.max(
    INVITATION_SEATS_MIN,
    Math.min(INVITATION_SEATS_MAX, Math.floor(n)),
  );
};

export const SeatsStepper = ({
  id,
  value,
  onChange,
  onFocus,
}: SeatsStepperProps) => {
  const safe = clamp(value || INVITATION_SEATS_MIN);
  return (
    <div className="border-border bg-background focus-within:ring-ring rounded-8 flex h-10 items-center gap-1 border px-1 transition-colors focus-within:ring-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Decrease seats"
        onClick={() => onChange(clamp(safe - 1))}
        disabled={safe <= INVITATION_SEATS_MIN}
        className="text-muted-foreground hover:text-foreground size-7 rounded-full !px-0"
      >
        −
      </Button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={INVITATION_SEATS_MIN}
        max={INVITATION_SEATS_MAX}
        value={safe}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        onFocus={onFocus}
        className="text-foreground min-w-0 flex-1 [appearance:textfield] bg-transparent text-center text-sm font-medium tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Increase seats"
        onClick={() => onChange(clamp(safe + 1))}
        disabled={safe >= INVITATION_SEATS_MAX}
        className="text-muted-foreground hover:text-foreground size-7 rounded-full !px-0"
      >
        +
      </Button>
    </div>
  );
};
