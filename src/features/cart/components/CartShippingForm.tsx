"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Button } from "@ovation/ui/components/Button";
import { useCartStore, type CartShipping } from "../store/useCartStore";

type CartShippingFormProps = {
  onBack: () => void;
  onSubmit: (shipping: CartShipping) => void;
  isSubmitting: boolean;
};

export const CartShippingForm = ({
  onBack,
  onSubmit,
  isSubmitting,
}: CartShippingFormProps) => {
  const t = useTranslations();
  const existing = useCartStore((s) => s.shipping);
  const [form, setForm] = useState<CartShipping>(
    existing ?? {
      name: "",
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      country: "ES",
    },
  );
  const [error, setError] = useState<Record<string, string>>({});

  const update =
    (field: keyof CartShipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-20 border-border bg-card flex flex-col gap-5 border p-7"
    >
      <h2 className="type-h3 font-serif font-semibold tracking-tight">
        {t("cart__shipping__title")}
      </h2>
      <p className="text-muted-foreground type-body-small">
        {t("cart__shipping__description")}
      </p>
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
          <Label htmlFor="ship-country" className="mb-2">
            {t("cart__shipping__country")}
          </Label>
          <Input
            id="ship-country"
            value={form.country}
            onChange={update("country")}
            maxLength={2}
            placeholder="ES"
            aria-invalid={Boolean(error.country)}
          />
          {error.country && (
            <p className="type-caption text-destructive mt-1">
              {error.country}
            </p>
          )}
        </div>
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
          {isSubmitting
            ? t("cart__summary__checkout_pending")
            : t("cart__shipping__continue")}
        </Button>
      </div>
    </form>
  );
};
