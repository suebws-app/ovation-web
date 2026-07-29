"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import {
  useCreateVendor,
  useDeleteVendor,
  useUpdateVendor,
} from "@/lib/query/weddingPlannerQueries";
import type { PlannerVendor, VendorStatus } from "@/lib/api/types";
import { getVendorSchema, type VendorFields } from "./vendorSchema";
import { RatingInput } from "./RatingInput";
import { FieldHint } from "../components/FieldHint";

type VendorModalProps = {
  eventId: string;
  open: boolean;
  vendor: PlannerVendor | null;
  onClose: () => void;
};

const emptyDefaults: VendorFields = {
  name: "",
  category: "",
  contact: "",
  phone: "",
  status: "Shortlist",
  rating: 0,
  price: "",
  deposit: "",
};

const toDefaults = (vendor: PlannerVendor | null): VendorFields =>
  vendor
    ? {
        name: vendor.name,
        category: vendor.category ?? "",
        contact: vendor.contact ?? "",
        phone: vendor.phone ?? "",
        status: vendor.status,
        rating: vendor.rating,
        price: vendor.price ? String(vendor.price) : "",
        deposit: vendor.deposit ? String(vendor.deposit) : "",
      }
    : emptyDefaults;

export const VendorModal = ({
  eventId,
  open,
  vendor,
  onClose,
}: VendorModalProps) => {
  const t = useTranslations();
  const schema = useMemo(() => getVendorSchema(t), [t]);
  const createVendor = useCreateVendor(eventId);
  const updateVendor = useUpdateVendor(eventId);
  const deleteVendor = useDeleteVendor(eventId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<VendorFields>({
    defaultValues: emptyDefaults,
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) reset(toDefaults(vendor));
  }, [open, vendor, reset]);

  const saving = createVendor.isPending || updateVendor.isPending;

  const onSubmit = (values: VendorFields) => {
    const priceNum = values.price.trim() ? Number(values.price) : 0;
    const depositNum = values.deposit.trim() ? Number(values.deposit) : 0;
    const input = {
      name: values.name,
      category: values.category.trim() || null,
      contact: values.contact.trim() || null,
      phone: values.phone.trim() || null,
      status: values.status,
      rating: values.rating,
      price: Number.isNaN(priceNum) ? 0 : priceNum,
      deposit: Number.isNaN(depositNum) ? 0 : depositNum,
    };
    if (vendor) {
      updateVendor.mutate(
        { vendorId: vendor.id, input },
        { onSuccess: onClose },
      );
    } else {
      createVendor.mutate(input, { onSuccess: onClose });
    }
  };

  const handleDelete = () => {
    if (vendor) deleteVendor.mutate(vendor.id, { onSuccess: onClose });
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-card rounded-16 data-[state=closed]:animate-scale-fade-out data-[state=open]:animate-scale-fade-in fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden shadow-lg"
        >
          <Dialog.Title className="type-h3 border-border border-b p-5 font-serif">
            {vendor
              ? t("wp__vendors__modal_edit")
              : t("wp__vendors__modal_new")}
          </Dialog.Title>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="flex flex-col gap-4 overflow-y-auto p-5">
              <label className="flex flex-col gap-1.5">
                <span className="type-caption text-muted-foreground">
                  {t("wp__vendors__f_name")}
                </span>
                <Input
                  type="text"
                  placeholder={t("wp__vendors__f_name_ph")}
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name ? (
                  <span className="type-caption text-destructive">
                    {errors.name.message}
                  </span>
                ) : null}
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__vendors__f_category")}
                  </span>
                  <Input type="text" {...register("category")} />
                </label>
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__vendors__f_status")}
                    <FieldHint
                      ariaLabel={t("wp__vendors__f_status")}
                      text={t("wp__vendors__hint_status")}
                    />
                  </span>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as VendorStatus)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shortlist">
                            {t("wp__vendors__s_shortlist")}
                          </SelectItem>
                          <SelectItem value="In talks">
                            {t("wp__vendors__s_intalks")}
                          </SelectItem>
                          <SelectItem value="Booked">
                            {t("wp__vendors__s_booked")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__vendors__f_contact")}
                  </span>
                  <Input type="text" {...register("contact")} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__vendors__f_phone")}
                  </span>
                  <Input type="tel" {...register("phone")} />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                  {t("wp__vendors__f_rating")}
                  <FieldHint
                    ariaLabel={t("wp__vendors__f_rating")}
                    text={t("wp__vendors__hint_rating")}
                  />
                </span>
                <Controller
                  control={control}
                  name="rating"
                  render={({ field }) => (
                    <RatingInput
                      value={field.value}
                      onChange={field.onChange}
                      ariaLabel={t("wp__vendors__f_rating")}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__vendors__f_price")}
                    <FieldHint
                      ariaLabel={t("wp__vendors__f_price")}
                      text={t("wp__vendors__hint_price")}
                    />
                  </span>
                  <Input type="number" min={0} {...register("price")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__vendors__f_deposit")}
                    <FieldHint
                      ariaLabel={t("wp__vendors__f_deposit")}
                      text={t("wp__vendors__hint_deposit")}
                    />
                  </span>
                  <Input type="number" min={0} {...register("deposit")} />
                </div>
              </div>
            </div>

            <div className="border-border flex items-center justify-between gap-2 border-t p-5">
              {vendor ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <TrashIcon width={16} height={16} />
                  {t("wp__vendors__delete")}
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="pillGhost" onClick={onClose}>
                  {t("wp__vendors__cancel")}
                </Button>
                <Button type="submit" disabled={saving}>
                  {t("wp__vendors__save")}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
