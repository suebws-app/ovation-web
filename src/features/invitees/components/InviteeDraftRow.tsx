"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { TableCell, TableRow } from "@ovation/ui/components/Table";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { useCreateInvitee } from "@/lib/query/inviteesQueries";
import { inviteesTableColumnClasses } from "../tableColumns";

type InviteeDraftRowProps = {
  eventId: string;
  onDone: () => void;
};

export const InviteeDraftRow = ({ eventId, onDone }: InviteeDraftRowProps) => {
  const t = useTranslations();
  const create = useCreateInvitee(eventId);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(1);

  const commit = async () => {
    const trimmedName = firstName.trim();
    if (!trimmedName) {
      onDone();
      return;
    }
    if (create.isPending) return;
    await create.mutateAsync({
      firstName: trimmedName,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      seats,
    });
    onDone();
  };

  const handleBlur = (event: React.FocusEvent<HTMLTableRowElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    void commit();
  };

  return (
    <TableRow className="animate-slide-up-fade" onBlur={handleBlur}>
      <TableCell className={inviteesTableColumnClasses.guest}>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t("invitees__form__name_placeholder")}
          autoComplete="off"
          autoFocus
        />
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.email}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("invitees__form__email_placeholder")}
          autoComplete="off"
        />
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.phone}>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("invitees__form__phone_placeholder")}
          autoComplete="tel"
        />
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.seats}>
        <Input
          type="number"
          min={1}
          max={20}
          value={seats}
          onChange={(e) => setSeats(Math.max(1, Number(e.target.value) || 1))}
          className="text-center"
        />
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.status} />
      <TableCell className={inviteesTableColumnClasses.actions}>
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => void commit()}
            disabled={create.isPending || !firstName.trim()}
            aria-label={t("invitees__row__save")}
          >
            <CheckIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onDone}
            disabled={create.isPending}
            aria-label={t("invitees__row__cancel")}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
