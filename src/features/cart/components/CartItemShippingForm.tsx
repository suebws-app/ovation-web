"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Button } from "@ovation/ui/components/Button";
import type { CartShipping } from "../store/useCartStore";
import { CountrySelect } from "./CountrySelect";
import { StateSelect, requiresState } from "./StateSelect";

type CartItemShippingFormProps = {
  initial: CartShipping | null;
  variantIds: string[];
  title: string;
  description?: string;
  submitLabel: string;
  onSubmit: (shipping: CartShipping) => void;
  onBack: () => void;
  isSubmitting?: boolean;
};

const emptyShipping: CartShipping = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "",
  state: undefined,
};

export const CartItemShippingForm = ({
  initial,
  variantIds,
  title,
  description,
  submitLabel,
  onSubmit,
  onBack,
  isSubmitting = false,
}: CartItemShippingFormProps) => {
  const t = useTranslations();
  const [form, setForm] = useState<CartShipping>(initial ?? emptyShipping);
  const [error, setError] = useState<Record<string, string>>({});

  const update =
    (field: keyof CartShipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleCountryChange = (country: string) => {
    setForm((prev) => ({
      ...prev,
      country,
      state: requiresState(country) ? prev.state : undefined,
    }));
  };

  const handleStateChange = (state: string) => {
    setForm((prev) => ({ ...prev, state }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("cart__shipping__error_required");
    if (!form.line1.trim()) errs.line1 = t("cart__shipping__error_required");
    if (!form.city.trim()) errs.city = t("cart__shipping__error_required");
    if (!form.postalCode.trim())
      errs.postalCode = t("cart__shipping__error_required");
    if (form.country.trim().length !== 2)
      errs.country = t("cart__shipping__error_country");
    if (requiresState(form.country) && !form.state)
      errs.state = t("cart__shipping__error_required");
    if (Object.keys(errs).length > 0) {
      setError(errs);
      return;
    }
    setError({});
    onSubmit({
      name: form.name.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim() || undefined,
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim().toUpperCase(),
      state: form.state,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-20 border-border bg-card flex flex-col gap-5 border p-7"
    >
      <h2 className="type-h3 font-serif font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground type-body-small">{description}</p>
      )}
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="ship-name" className="mb-2">
            {t("cart__shipping__name")}
          </Label>
          <Input
            id="ship-name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(error.name)}
          />
          {error.name && (
            <p className="type-caption text-destructive mt-1">{error.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="ship-line1" className="mb-2">
            {t("cart__shipping__line1")}
          </Label>
          <Input
            id="ship-line1"
            value={form.line1}
            onChange={update("line1")}
            aria-invalid={Boolean(error.line1)}
          />
          {error.line1 && (
            <p className="type-caption text-destructive mt-1">{error.line1}</p>
          )}
        </div>
        <div>
          <Label htmlFor="ship-line2" className="mb-2">
            {t("cart__shipping__line2")}
          </Label>
          <Input
            id="ship-line2"
            value={form.line2 ?? ""}
            onChange={update("line2")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="ship-city" className="mb-2">
              {t("cart__shipping__city")}
            </Label>
            <Input
              id="ship-city"
              value={form.city}
              onChange={update("city")}
              aria-invalid={Boolean(error.city)}
            />
            {error.city && (
              <p className="type-caption text-destructive mt-1">{error.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ship-postal" className="mb-2">
              {t("cart__shipping__postal_code")}
            </Label>
            <Input
              id="ship-postal"
              value={form.postalCode}
              onChange={update("postalCode")}
              aria-invalid={Boolean(error.postalCode)}
            />
            {error.postalCode && (
              <p className="type-caption text-destructive mt-1">
                {error.postalCode}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-2">{t("cart__shipping__country")}</Label>
          <CountrySelect
            value={form.country}
            onChange={handleCountryChange}
            variantIds={variantIds}
            invalid={Boolean(error.country)}
          />
          {error.country && (
            <p className="type-caption text-destructive mt-1">
              {error.country}
            </p>
          )}
        </div>
        {requiresState(form.country) && (
          <div>
            <Label className="mb-2">{t("cart__shipping__state")}</Label>
            <StateSelect
              country={form.country}
              value={form.state ?? ""}
              onChange={handleStateChange}
              invalid={Boolean(error.state)}
            />
            {error.state && (
              <p className="type-caption text-destructive mt-1">
                {error.state}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={onBack}
        >
          {t("cart__shipping__back")}
        </Button>
        <Button type="submit" className="rounded-full" disabled={isSubmitting}>
          {isSubmitting ? t("cart__summary__checkout_pending") : submitLabel}
        </Button>
      </div>
    </form>
  );
};
