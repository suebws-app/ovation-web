"use client";

import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import type { CartShipping } from "../store/useCartStore";
import { CountrySelect } from "./CountrySelect";
import { StateSelect, requiresState } from "./StateSelect";

type CartInlineShippingFormProps = {
  value: CartShipping | null;
  onChange: (next: CartShipping) => void;
  variantIds: string[];
  title?: string;
  subtitle?: string | null;
  idPrefix?: string;
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

export const CartInlineShippingForm = ({
  value,
  onChange,
  variantIds,
  title,
  subtitle,
  idPrefix = "inline-ship",
}: CartInlineShippingFormProps) => {
  const t = useTranslations();
  const form = value ?? emptyShipping;

  const update =
    (field: keyof CartShipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, [field]: e.target.value });
    };

  const handleCountryChange = (country: string) => {
    onChange({
      ...form,
      country,
      state: requiresState(country) ? form.state : undefined,
    });
  };

  const handleStateChange = (state: string) => {
    onChange({ ...form, state });
  };

  return (
    <div className="rounded-16 border-primary/30 bg-muted/30 flex flex-col gap-3 border p-5">
      {(title || subtitle) && (
        <div className="flex flex-col gap-0.5">
          {title && <h3 className="type-body-small font-semibold">{title}</h3>}
          {subtitle && (
            <p className="type-caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div>
          <Label htmlFor={`${idPrefix}-name`} className="mb-1.5">
            {t("cart__shipping__name")}
          </Label>
          <Input
            id={`${idPrefix}-name`}
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-line1`} className="mb-1.5">
            {t("cart__shipping__line1")}
          </Label>
          <Input
            id={`${idPrefix}-line1`}
            autoComplete="address-line1"
            value={form.line1}
            onChange={update("line1")}
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-line2`} className="mb-1.5">
            {t("cart__shipping__line2")}
          </Label>
          <Input
            id={`${idPrefix}-line2`}
            autoComplete="address-line2"
            value={form.line2 ?? ""}
            onChange={update("line2")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${idPrefix}-city`} className="mb-1.5">
              {t("cart__shipping__city")}
            </Label>
            <Input
              id={`${idPrefix}-city`}
              autoComplete="address-level2"
              value={form.city}
              onChange={update("city")}
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-postal`} className="mb-1.5">
              {t("cart__shipping__postal_code")}
            </Label>
            <Input
              id={`${idPrefix}-postal`}
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={update("postalCode")}
            />
          </div>
        </div>
        <div>
          <Label className="mb-1.5">{t("cart__shipping__country")}</Label>
          <CountrySelect
            value={form.country}
            onChange={handleCountryChange}
            variantIds={variantIds}
          />
        </div>
        {requiresState(form.country) && (
          <div>
            <Label className="mb-1.5">{t("cart__shipping__state")}</Label>
            <StateSelect
              country={form.country}
              value={form.state ?? ""}
              onChange={handleStateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
