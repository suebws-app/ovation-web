"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { cn } from "@ovation/ui/utils/cn";
import {
  INVITATION_NAME_MAX,
  type InvitationFields,
} from "../invitationSchema";

const formatNiceDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const parseIso = (value: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const DetailsStep = () => {
  const t = useTranslations();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InvitationFields>();

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <>
      <div className="tablet:mt-7 tablet:grid-cols-[1fr_auto_1fr] mt-5 grid grid-cols-1 items-end gap-3.5">
        <div>
          <Label htmlFor="inv-partner-a" className="mb-2">
            {t("invitation__field__partner_a")}
          </Label>
          <Input
            id="inv-partner-a"
            maxLength={INVITATION_NAME_MAX}
            placeholder={t("invitation__placeholder__partner_a")}
            aria-invalid={Boolean(errors.partnerA)}
            {...register("partnerA")}
          />
          {errors.partnerA?.message && (
            <span className="type-caption text-destructive mt-1 block">
              {errors.partnerA.message}
            </span>
          )}
        </div>
        <span className="text-muted-foreground type-h1 tablet:block hidden pb-2.5 italic">
          &amp;
        </span>
        <div>
          <Label htmlFor="inv-partner-b" className="mb-2">
            {t("invitation__field__partner_b")}
          </Label>
          <Input
            id="inv-partner-b"
            maxLength={INVITATION_NAME_MAX}
            placeholder={t("invitation__placeholder__partner_b")}
            aria-invalid={Boolean(errors.partnerB)}
            {...register("partnerB")}
          />
          {errors.partnerB?.message && (
            <span className="type-caption text-destructive mt-1 block">
              {errors.partnerB.message}
            </span>
          )}
        </div>
      </div>

      <div className="tablet:mt-6 tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
        <div>
          <Label className="mb-2 block">{t("invitation__field__date")}</Label>
          <Controller
            control={control}
            name="weddingDate"
            render={({ field }) => {
              const selected = parseIso(field.value);
              return (
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <CalendarIcon
                        width={16}
                        height={16}
                        className="text-primary shrink-0"
                      />
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate",
                          selected ? "font-medium" : "text-muted-foreground",
                        )}
                      >
                        {selected
                          ? formatNiceDate(selected)
                          : t("invitation__placeholder__date")}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="rounded-16 w-auto p-3"
                  >
                    <Calendar
                      mode="single"
                      selected={selected}
                      onSelect={(date) => {
                        field.onChange(
                          date ? date.toISOString().slice(0, 10) : "",
                        );
                        setDatePickerOpen(false);
                      }}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
        </div>
        <div>
          <Label htmlFor="inv-time" className="mb-2">
            {t("invitation__field__time")}
          </Label>
          <Input
            id="inv-time"
            placeholder={t("invitation__placeholder__time")}
            {...register("time")}
          />
        </div>
      </div>

      <div className="tablet:mt-4 tablet:grid-cols-2 mt-4 grid grid-cols-1 gap-3.5">
        <div>
          <Label htmlFor="inv-venue" className="mb-2">
            {t("invitation__field__venue")}
          </Label>
          <Input
            id="inv-venue"
            placeholder={t("invitation__placeholder__venue")}
            {...register("venue")}
          />
        </div>
        <div>
          <Label htmlFor="inv-place" className="mb-2">
            {t("invitation__field__place")}
          </Label>
          <Input
            id="inv-place"
            placeholder={t("invitation__placeholder__place")}
            {...register("place")}
          />
        </div>
      </div>

      <div className="tablet:mt-6 mt-4">
        <Label htmlFor="inv-message" className="mb-2">
          {t("invitation__field__message")}
        </Label>
        <textarea
          id="inv-message"
          rows={3}
          placeholder={t("invitation__placeholder__message")}
          className="border-border bg-background focus-visible:ring-ring rounded-8 w-full resize-none border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          {...register("message")}
        />
      </div>
    </>
  );
};
