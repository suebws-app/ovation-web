"use client";

import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import {
  useCartStore,
  type CartShipping,
} from "@/features/cart/store/useCartStore";
import { CountrySelect } from "@/features/cart/components/CountrySelect";
import {
  StateSelect,
  requiresState,
} from "@/features/cart/components/StateSelect";

type CustomizerShippingFieldsProps = {
  variantIds: string[];
  errors?: Partial<Record<keyof CartShipping, string>>;
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

export const CustomizerShippingFields = ({
  variantIds,
  errors,
}: CustomizerShippingFieldsProps) => {
  const t = useTranslations();
  const persisted = useCartStore((s) => s.shipping);
  const setShipping = useCartStore((s) => s.setShipping);

  const form = persisted ?? emptyShipping;

  const commit = (next: CartShipping) => {
    setShipping(next);
  };

  const update =
    (field: keyof CartShipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
      commit({ ...form, [field]: e.target.value });
    };

  const handleCountryChange = (country: string) => {
    commit({
      ...form,
      country,
      state: requiresState(country) ? form.state : undefined,
    });
  };

  const handleStateChange = (state: string) => {
    commit({ ...form, state });
  };

  const showState = requiresState(form.country);

  return (
    <div className="rounded-12 border-border bg-muted/30 flex flex-col gap-3 border px-3 py-3">
      <h3 className="type-body-small font-semibold">
        {t("cart__shipping__title")}
      </h3>
      <div className="flex flex-col gap-3">
        <div>
          <Label htmlFor="customizer-ship-name" className="mb-1.5">
            {t("cart__shipping__name")}
          </Label>
          <Input
            id="customizer-ship-name"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors?.name)}
          />
          {errors?.name && (
            <p className="type-caption text-destructive mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="customizer-ship-line1" className="mb-1.5">
            {t("cart__shipping__line1")}
          </Label>
          <Input
            id="customizer-ship-line1"
            autoComplete="address-line1"
            value={form.line1}
            onChange={update("line1")}
            aria-invalid={Boolean(errors?.line1)}
          />
          {errors?.line1 && (
            <p className="type-caption text-destructive mt-1">{errors.line1}</p>
          )}
        </div>
        <div>
          <Label htmlFor="customizer-ship-line2" className="mb-1.5">
            {t("cart__shipping__line2")}
          </Label>
          <Input
            id="customizer-ship-line2"
            autoComplete="address-line2"
            value={form.line2 ?? ""}
            onChange={update("line2")}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="customizer-ship-city" className="mb-1.5">
              {t("cart__shipping__city")}
            </Label>
            <Input
              id="customizer-ship-city"
              autoComplete="address-level2"
              value={form.city}
              onChange={update("city")}
              aria-invalid={Boolean(errors?.city)}
            />
            {errors?.city && (
              <p className="type-caption text-destructive mt-1">
                {errors.city}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="customizer-ship-postal" className="mb-1.5">
              {t("cart__shipping__postal_code")}
            </Label>
            <Input
              id="customizer-ship-postal"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={update("postalCode")}
              aria-invalid={Boolean(errors?.postalCode)}
            />
            {errors?.postalCode && (
              <p className="type-caption text-destructive mt-1">
                {errors.postalCode}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-1.5">{t("cart__shipping__country")}</Label>
          <CountrySelect
            value={form.country}
            onChange={handleCountryChange}
            variantIds={variantIds}
            invalid={Boolean(errors?.country)}
          />
          {errors?.country && (
            <p className="type-caption text-destructive mt-1">
              {errors.country}
            </p>
          )}
        </div>
        {showState && (
          <div>
            <Label className="mb-1.5">{t("cart__shipping__state")}</Label>
            <StateSelect
              country={form.country}
              value={form.state ?? ""}
              onChange={handleStateChange}
              invalid={Boolean(errors?.state)}
            />
            {errors?.state && (
              <p className="type-caption text-destructive mt-1">
                {errors.state}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
