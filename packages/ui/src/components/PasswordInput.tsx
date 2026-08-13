"use client";

import { forwardRef, useState } from "react";
import { EyeIcon } from "@ovation/icons/EyeIcon";
import { EyeOffIcon } from "@ovation/icons/EyeOffIcon";
import { cn } from "../utils/cn";
import { Input } from "./Input";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  showLabel?: string;
  hideLabel?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showLabel = "Show password",
      hideLabel = "Hide password",
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOffIcon : EyeIcon;

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          tabIndex={-1}
          className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg transition-colors focus-visible:outline-none"
        >
          <Icon width={18} height={18} />
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
