"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { ViewHeader } from "../components/ViewHeader";
import { useWeddingPlannerVendors } from "@/lib/query/weddingPlannerQueries";
import type { PlannerVendor } from "@/lib/api/types";
import { VendorCard } from "./VendorCard";
import { VendorModal } from "./VendorModal";
import { VendorFilterChips, type VendorFilter } from "./VendorFilterChips";

export const WeddingPlannerVendorsClient = ({
  eventId,
}: {
  eventId: string;
}) => {
  const t = useTranslations();
  const {
    data: vendors,
    isLoading,
    isError,
  } = useWeddingPlannerVendors(eventId);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVendor, setActiveVendor] = useState<PlannerVendor | null>(null);
  const [filter, setFilter] = useState<VendorFilter>("all");

  const openCreate = () => {
    setActiveVendor(null);
    setModalOpen(true);
  };
  const openEdit = (vendor: PlannerVendor) => {
    setActiveVendor(vendor);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const renderBody = () => {
    if (isLoading) {
      return (
        <p className="type-body-small text-muted-foreground">
          {t("wp__vendors__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive">
          {t("wp__vendors__error")}
        </p>
      );
    }
    if (!vendors || vendors.length === 0) {
      return (
        <div className="rounded-16 border-border flex flex-col items-center gap-4 border border-dashed p-10 text-center">
          <p className="type-h4">{t("wp__vendors__empty_title")}</p>
          <p className="type-body-small text-muted-foreground max-w-md">
            {t("wp__vendors__empty_body")}
          </p>
          <Button size="sm" onClick={openCreate}>
            <PlusIcon width={15} height={15} />
            {t("wp__vendors__add")}
          </Button>
        </div>
      );
    }
    const filtered =
      filter === "all"
        ? vendors
        : vendors.filter((vendor) => vendor.status === filter);

    return (
      <div className="flex flex-col gap-4">
        <VendorFilterChips
          vendors={vendors}
          active={filter}
          onSelect={setFilter}
        />
        {filtered.length === 0 ? (
          <p className="type-body-small text-muted-foreground p-8 text-center">
            {t("wp__vendors__empty_title")}
          </p>
        ) : (
          <div className="tablet:grid-cols-2 grid gap-4">
            {filtered.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onOpen={openEdit} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <ViewHeader
        title={t("wp__vendors__title")}
        subtitle={t("wp__vendors__sub")}
        action={
          <Button size="sm" onClick={openCreate}>
            <PlusIcon width={15} height={15} />
            {t("wp__vendors__add")}
          </Button>
        }
      />
      {renderBody()}
      <VendorModal
        eventId={eventId}
        open={modalOpen}
        vendor={activeVendor}
        onClose={closeModal}
      />
    </div>
  );
};
