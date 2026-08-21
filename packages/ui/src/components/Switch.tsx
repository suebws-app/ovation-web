"use client";

import { forwardRef } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../utils/cn";

type SwitchProps = Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "onChange" | "onCheckedChange" | "checked"
> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
};

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ checked, onChange, label, className, ...props }, ref) => {
  const root = (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={(value) => onChange?.(value === true)}
      className={cn(
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:ring-ring peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="bg-background pointer-events-none block size-5 rounded-full shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  );

  if (!label) return root;

  return (
    <label className="flex items-center gap-2.5 text-left">
      {root}
      <span className="type-body-small text-muted-foreground leading-snug">
        {label}
      </span>
    </label>
  );
});
Switch.displayName = "Switch";
