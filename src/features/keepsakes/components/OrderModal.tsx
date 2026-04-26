"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/utils/env";
import { formatPrice } from "../designTokens";
import {
  getOrderShippingSchema,
  type OrderShippingFields,
} from "../orderShippingSchema";
import type { DesignedProduct } from "../designTokens";

type OrderModalProps = {
  product: DesignedProduct;
  eventId: string;
  onClose: () => void;
};

export const OrderModal = ({ product, eventId, onClose }: OrderModalProps) => {
  const t = useTranslations();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => getOrderShippingSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderShippingFields>({
    defaultValues: {
      name: "",
      line1: "",
      city: "",
      postalCode: "",
      country: "ES",
    },
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: OrderShippingFields) => {
    setSubmitError(null);
    try {
      const checkout = await paymentsClient.createCheckoutSession({
        eventId,
        orderType: "keepsake",
        items: [{ productSku: product.sku, quantity: 1 }],
        shippingAddress: {
          name: values.name.trim(),
          line1: values.line1.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country.trim().toUpperCase(),
        },
        successUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/success`,
        cancelUrl: `${env.APP_URL}/checkout/{CHECKOUT_SESSION_ID}/cancel`,
      });
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : t("keepsakes__order__error_default"),
      );
    }
  };

  return (
    <div className="bg-foreground/45 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="rounded-20 bg-card flex w-full max-w-lg flex-col overflow-hidden shadow-lg">
        <div
          className="relative flex h-30 items-center justify-center px-5"
          style={{ background: product.design.gradient }}
        >
          <p
            className="type-h2 text-center font-serif leading-tight font-semibold italic"
            style={{
              color: product.design.dark ? "#fff" : "var(--foreground)",
              textShadow: product.design.dark
                ? "0 2px 12px rgba(0,0,0,0.3)"
                : "none",
            }}
          >
            {t(product.design.headlineKey)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-7">
          <div className="flex items-baseline justify-between">
            <Eyebrow className="text-muted-foreground">
              {t("keepsakes__order__title")}
            </Eyebrow>
            <span className="type-h4 text-primary font-serif font-semibold">
              {formatPrice(product.priceCents, product.currency)}
            </span>
          </div>
          <h2 className="type-h2 mt-1.5 font-serif font-semibold">
            {product.name}
          </h2>
          <p className="type-body-small text-muted-foreground mt-1.5 leading-relaxed">
            {t(product.design.taglineKey) || product.description}
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="ship-name" className="mb-2">
                {t("keepsakes__order__shipping_recipient")}
              </Label>
              <Input
                id="ship-name"
                autoComplete="name"
                placeholder={t(
                  "keepsakes__order__shipping_recipient_placeholder",
                )}
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ship-line1" className="mb-2">
                {t("keepsakes__order__shipping_address")}
              </Label>
              <Input
                id="ship-line1"
                autoComplete="address-line1"
                placeholder={t(
                  "keepsakes__order__shipping_address_placeholder",
                )}
                aria-invalid={Boolean(errors.line1)}
                {...register("line1")}
              />
              {errors.line1 && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.line1.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-[1fr_140px] gap-4">
              <div>
                <Label htmlFor="ship-city" className="mb-2">
                  {t("keepsakes__order__shipping_city")}
                </Label>
                <Input
                  id="ship-city"
                  autoComplete="address-level2"
                  placeholder={t("keepsakes__order__shipping_city_placeholder")}
                  aria-invalid={Boolean(errors.city)}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="type-caption text-destructive mt-1.5">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="ship-postal" className="mb-2">
                  {t("keepsakes__order__shipping_postal")}
                </Label>
                <Input
                  id="ship-postal"
                  autoComplete="postal-code"
                  placeholder={t(
                    "keepsakes__order__shipping_postal_placeholder",
                  )}
                  aria-invalid={Boolean(errors.postalCode)}
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="type-caption text-destructive mt-1.5">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="ship-country" className="mb-2">
                {t("keepsakes__order__shipping_country")}
              </Label>
              <Input
                id="ship-country"
                autoComplete="country"
                placeholder={t(
                  "keepsakes__order__shipping_country_placeholder",
                )}
                maxLength={2}
                aria-invalid={Boolean(errors.country)}
                {...register("country")}
              />
              {errors.country && (
                <p className="type-caption text-destructive mt-1.5">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="type-body-small text-destructive mt-4" role="alert">
              {submitError}
            </p>
          )}

          <div className="mt-7 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("keepsakes__order__cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full"
            >
              {isSubmitting
                ? t("keepsakes__order__starting")
                : t("keepsakes__order__pay", {
                    amount: formatPrice(product.priceCents, product.currency),
                  })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
