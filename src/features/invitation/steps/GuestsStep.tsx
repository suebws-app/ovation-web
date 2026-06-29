"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { CenteredModal } from "@/components/CenteredModal";
import { useInviteeImport } from "@/features/invitees/components/InviteeImport";
import type { ImportInvitee } from "@/features/invitees/components/inviteeImportParser";
import { GuestRow } from "../components/GuestRow";
import {
  INVITATION_SEATS_MIN,
  type InvitationFields,
} from "../invitationSchema";

type GuestsStepProps = {
  selectedGuestIndex: number | null;
  onSelectGuest: (index: number | null) => void;
};

export const GuestsStep = ({
  selectedGuestIndex,
  onSelectGuest,
}: GuestsStepProps) => {
  const t = useTranslations();
  const { control } = useFormContext<InvitationFields>();
  const guestsArray = useFieldArray<InvitationFields, "guests">({
    control,
    name: "guests",
  });
  const [importOpen, setImportOpen] = useState(false);

  const totalSeats = guestsArray.fields.reduce(
    (sum, guest) => sum + (guest.seats ?? INVITATION_SEATS_MIN),
    0,
  );

  const handleAdd = () => {
    guestsArray.append({
      first: "",
      email: "",
      phone: "",
      seats: INVITATION_SEATS_MIN,
    });
    if (selectedGuestIndex === null) {
      onSelectGuest(guestsArray.fields.length);
    }
  };

  const handleRemove = (index: number) => {
    guestsArray.remove(index);
    const remainingCount = guestsArray.fields.length - 1;
    if (remainingCount === 0) {
      onSelectGuest(null);
    } else if (
      selectedGuestIndex !== null &&
      selectedGuestIndex >= remainingCount
    ) {
      onSelectGuest(remainingCount - 1);
    }
  };

  const handleImport = (invitees: ImportInvitee[]) => {
    const previousLength = guestsArray.fields.length;
    guestsArray.append(
      invitees.map((invitee) => ({
        first: invitee.firstName,
        email: invitee.email ?? "",
        phone: invitee.phone ?? "",
        seats: invitee.seats,
      })),
    );
    if (selectedGuestIndex === null && invitees.length > 0) {
      onSelectGuest(previousLength);
    }
    setImportOpen(false);
  };

  const { body: importBody, footer: importFooter } = useInviteeImport({
    onConfirm: handleImport,
    isSubmitting: false,
  });

  return (
    <>
      <div className="tablet:mt-7 mt-5 flex items-center justify-between gap-3">
        <Kicker className="text-muted-foreground">
          {t("invitation__guests__count", {
            count: guestsArray.fields.length,
            seats: totalSeats,
          })}
        </Kicker>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="rounded-full"
          >
            <UploadIcon className="size-4" />
            {t("invitation__guests__import")}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            className="rounded-full"
          >
            {t("invitation__guests__add")}
          </Button>
        </div>
      </div>

      {guestsArray.fields.length === 0 ? (
        <div className="border-border rounded-12 type-body-small text-muted-foreground mt-3 border-2 border-dashed p-8 text-center">
          {t("invitation__guests__empty")}
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {guestsArray.fields.map((field, index) => (
            <GuestRow
              key={field.id}
              rowKey={field.id}
              index={index}
              selected={index === selectedGuestIndex}
              onSelect={onSelectGuest}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}

      <CenteredModal
        open={importOpen}
        onOpenChange={setImportOpen}
        title={t("invitation__guests__import__title")}
        description={t("invitation__guests__import__description")}
        footer={importFooter}
      >
        {importBody}
      </CenteredModal>
    </>
  );
};
