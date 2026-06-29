"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { useCreateInvitee } from "@/lib/query/inviteesQueries";

type InviteeAddFormProps = {
  eventId: string;
};

export const InviteeAddForm = ({ eventId }: InviteeAddFormProps) => {
  const t = useTranslations();
  const create = useCreateInvitee(eventId);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState(1);

  const canSubmit = firstName.trim().length > 0 && !create.isPending;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    await create.mutateAsync({
      firstName: firstName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      seats,
    });
    setFirstName("");
    setEmail("");
    setPhone("");
    setSeats(1);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-12 border-border bg-card tablet:flex-row tablet:items-end flex flex-col gap-3 border p-4"
    >
      <div className="flex-1 space-y-1">
        <label
          htmlFor="invitee-first-name"
          className="type-caption text-muted-foreground"
        >
          {t("invitees__form__name_label")}
        </label>
        <Input
          id="invitee-first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t("invitees__form__name_placeholder")}
          autoComplete="off"
          required
        />
      </div>
      <div className="flex-1 space-y-1">
        <label
          htmlFor="invitee-email"
          className="type-caption text-muted-foreground"
        >
          {t("invitees__form__email_label")}
        </label>
        <Input
          id="invitee-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("invitees__form__email_placeholder")}
          autoComplete="off"
        />
      </div>
      <div className="flex-1 space-y-1">
        <label
          htmlFor="invitee-phone"
          className="type-caption text-muted-foreground"
        >
          {t("invitees__form__phone_label")}
        </label>
        <Input
          id="invitee-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("invitees__form__phone_placeholder")}
          autoComplete="tel"
        />
      </div>
      <div className="tablet:w-24 w-full space-y-1">
        <label
          htmlFor="invitee-seats"
          className="type-caption text-muted-foreground"
        >
          {t("invitees__form__seats_label")}
        </label>
        <Input
          id="invitee-seats"
          type="number"
          min={1}
          max={20}
          value={seats}
          onChange={(e) => setSeats(Math.max(1, Number(e.target.value) || 1))}
        />
      </div>
      <Button type="submit" disabled={!canSubmit} className="rounded-full">
        <PlusIcon className="size-4" />
        {t("invitees__form__add_cta")}
      </Button>
    </form>
  );
};
