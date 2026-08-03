"use client";

import { useTranslations } from "next-intl";
import { PhoneIcon } from "@ovation/icons/PhoneIcon";
import { StatusPill, type PillTone } from "../components/StatusPill";
import { StarRating } from "../components/StarRating";
import { money } from "../utils";
import type { PlannerVendor, VendorStatus } from "@/lib/api/types";

const statusTone: Record<VendorStatus, PillTone> = {
  Booked: "sage",
  "In talks": "gold",
  Shortlist: "neutral",
};

type VendorCardProps = {
  vendor: PlannerVendor;
  onOpen: (vendor: PlannerVendor) => void;
};

export const VendorCard = ({ vendor, onOpen }: VendorCardProps) => {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => onOpen(vendor)}
      className="rounded-16 border-border bg-card hover:border-primary/40 tablet:p-6 w-full border p-4 text-left shadow-sm transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {vendor.category ? (
            <StatusPill tone="neutral">{vendor.category}</StatusPill>
          ) : null}
          <h3 className="type-h3 mt-2.5">{vendor.name}</h3>
          {vendor.contact ? (
            <p className="type-body-small text-muted-foreground">
              {vendor.contact}
            </p>
          ) : null}
        </div>
        <StatusPill tone={statusTone[vendor.status]}>
          {vendor.status}
        </StatusPill>
      </div>
      <div className="mt-3 mb-3.5">
        <StarRating rating={vendor.rating} />
      </div>
      <div className="border-border/60 flex items-center justify-between gap-3 border-t pt-3.5">
        {vendor.phone ? (
          <span className="type-body-small text-muted-foreground flex items-center gap-2">
            <PhoneIcon width={15} height={15} />
            {vendor.phone}
          </span>
        ) : (
          <span className="type-body-small text-muted-foreground">—</span>
        )}
        <div className="text-right">
          <p className="type-h4">{money(vendor.price)}</p>
          <p className="type-caption text-muted-foreground">
            {vendor.deposit
              ? t("wp__vendors__deposit_paid", {
                  amount: money(vendor.deposit),
                })
              : t("wp__vendors__no_deposit")}
          </p>
        </div>
      </div>
    </button>
  );
};
