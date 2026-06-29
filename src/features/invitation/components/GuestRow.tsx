"use client";

import { useRef, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import type { InvitationFields } from "../invitationSchema";
import { SeatsStepper } from "./SeatsStepper";

type GuestRowProps = {
  rowKey: string;
  index: number;
  selected: boolean;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
};

const INTERACTIVE_SELECTOR =
  "input, textarea, select, button, a, [role='button']";

const isInteractiveTarget = (target: EventTarget | null): boolean =>
  target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));

export const GuestRow = ({
  rowKey,
  index,
  selected,
  onSelect,
  onRemove,
}: GuestRowProps) => {
  const t = useTranslations();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InvitationFields>();
  const guestErrors = errors.guests?.[index];

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const nameRegistration = register(`guests.${index}.first`);

  const setNameInputRef = (element: HTMLInputElement | null) => {
    nameRegistration.ref(element);
    nameInputRef.current = element;
  };

  const handleCardClick = (event: MouseEvent<HTMLLIElement>) => {
    onSelect(index);
    if (isInteractiveTarget(event.target)) return;
    nameInputRef.current?.focus();
  };

  return (
    <li
      onClick={handleCardClick}
      className={cn(
        "rounded-12 cursor-pointer border p-3 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="tablet:grid-cols-[1fr_1fr_1fr_120px_auto] grid grid-cols-1 items-end gap-3">
        <div>
          <Label htmlFor={`guest-name-${rowKey}`} className="mb-2">
            {t("invitation__field__guest_name")}
          </Label>
          <Input
            id={`guest-name-${rowKey}`}
            placeholder={t("invitation__placeholder__guest_name")}
            onFocusCapture={() => onSelect(index)}
            {...nameRegistration}
            ref={setNameInputRef}
          />
        </div>
        <div>
          <Label htmlFor={`guest-email-${rowKey}`} className="mb-2">
            {t("invitation__field__guest_email")}
          </Label>
          <Input
            id={`guest-email-${rowKey}`}
            type="email"
            placeholder={t("invitation__placeholder__guest_email")}
            aria-invalid={Boolean(guestErrors?.email)}
            onFocusCapture={() => onSelect(index)}
            {...register(`guests.${index}.email`)}
          />
          {guestErrors?.email?.message && (
            <span className="type-caption text-destructive mt-1 block">
              {guestErrors.email.message}
            </span>
          )}
        </div>
        <div>
          <Label htmlFor={`guest-phone-${rowKey}`} className="mb-2">
            {t("invitation__field__guest_phone")}
          </Label>
          <Input
            id={`guest-phone-${rowKey}`}
            type="tel"
            autoComplete="tel"
            placeholder={t("invitation__placeholder__guest_phone")}
            onFocusCapture={() => onSelect(index)}
            {...register(`guests.${index}.phone`)}
          />
        </div>
        <div>
          <Label htmlFor={`guest-seats-${rowKey}`} className="mb-2">
            {t("invitation__field__guest_seats")}
          </Label>
          <Controller
            control={control}
            name={`guests.${index}.seats`}
            render={({ field }) => (
              <SeatsStepper
                id={`guest-seats-${rowKey}`}
                value={field.value ?? 1}
                onChange={field.onChange}
                onFocus={() => onSelect(index)}
              />
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-muted-foreground hover:text-destructive rounded-full"
        >
          {t("invitation__guests__remove")}
        </Button>
      </div>
    </li>
  );
};
