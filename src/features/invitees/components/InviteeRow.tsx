"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { TableCell, TableRow } from "@ovation/ui/components/Table";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { LinkIcon } from "@ovation/icons/LinkIcon";
import { MailIcon } from "@ovation/icons/MailIcon";
import { PencilIcon } from "@ovation/icons/PencilIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/Toaster";
import type { Invitee } from "@/lib/api/types";
import {
  useCopyInvitationLink,
  useDeleteInvitee,
  useSendInvitationToInvitee,
  useUpdateInvitee,
} from "@/lib/query/inviteesQueries";
import { inviteesTableColumnClasses } from "../tableColumns";
import { initialsFor, tintFor } from "../utils/inviteeAvatar";
import { InviteeStatusChip } from "./InviteeStatusChip";

type InviteeRowProps = {
  eventId: string;
  invitee: Invitee;
  index: number;
};

export const InviteeRow = ({ eventId, invitee, index }: InviteeRowProps) => {
  const t = useTranslations();
  const update = useUpdateInvitee(eventId);
  const remove = useDeleteInvitee(eventId);
  const send = useSendInvitationToInvitee(eventId);
  const copyLink = useCopyInvitationLink(eventId);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(invitee.firstName);
  const [email, setEmail] = useState(invitee.email ?? "");
  const [phone, setPhone] = useState(invitee.phone ?? "");
  const [seats, setSeats] = useState(invitee.seats);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const resetDraft = () => {
    setFirstName(invitee.firstName);
    setEmail(invitee.email ?? "");
    setPhone(invitee.phone ?? "");
    setSeats(invitee.seats);
  };

  const handleSave = async () => {
    const trimmedName = firstName.trim();
    if (!trimmedName) return;
    await update.mutateAsync({
      inviteeId: invitee.id,
      input: {
        firstName: trimmedName,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        seats,
      },
    });
    setEditing(false);
  };

  const handleCancel = () => {
    resetDraft();
    setEditing(false);
  };

  const confirmDelete = () => {
    remove.mutate(invitee.id, {
      onSuccess: () => setDeleteOpen(false),
      onError: () => setDeleteOpen(false),
    });
  };

  const handleSend = async () => {
    try {
      await send.mutateAsync(invitee.id);
      toast.success(
        t("invitees__row__send_success", { name: invitee.firstName }),
      );
    } catch {
      toast.error(t("invitees__row__send_error"));
    }
  };

  const handleCopyLink = async () => {
    try {
      const { url } = await copyLink.mutateAsync(invitee.id);
      await navigator.clipboard.writeText(url);
      toast.success(t("invitees__row__copy_success"));
    } catch {
      toast.error(t("invitees__row__copy_error"));
    }
  };

  const isBusy =
    update.isPending ||
    remove.isPending ||
    send.isPending ||
    copyLink.isPending;
  const canSend = Boolean(invitee.email) && !isBusy;

  const animationDelay = `${Math.min(index, 16) * 30}ms`;

  if (editing) {
    return (
      <TableRow style={{ animationDelay }} className="animate-slide-up-fade">
        <TableCell className={inviteesTableColumnClasses.guest}>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoFocus
          />
        </TableCell>
        <TableCell className={inviteesTableColumnClasses.email}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              onClick={handleSave}
              disabled={isBusy || !firstName.trim()}
              aria-label={t("invitees__row__save")}
            >
              <CheckIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isBusy}
              aria-label={t("invitees__row__cancel")}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow style={{ animationDelay }} className="animate-slide-up-fade">
      <TableCell className={inviteesTableColumnClasses.guest}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="default">
            <AvatarFallback
              className="type-body-small text-primary-foreground font-semibold"
              style={{ background: tintFor(invitee.id) }}
            >
              {initialsFor(invitee.firstName, invitee.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="type-body-small truncate font-semibold">
              {invitee.firstName}
              {invitee.lastName ? ` ${invitee.lastName}` : ""}
            </p>
            <p className="type-caption text-muted-foreground truncate @[740px]/table:hidden">
              {invitee.email ?? t("invitees__row__no_email")}
            </p>
            {invitee.phone && (
              <p className="type-caption text-muted-foreground truncate @[840px]/table:hidden">
                {invitee.phone}
              </p>
            )}
            <div className="type-caption text-muted-foreground mt-1 flex flex-wrap items-center gap-3 @[640px]/table:hidden">
              <span>
                {t("invitees__row__seats_inline", { count: invitee.seats })}
              </span>
              <InviteeStatusChip invitee={invitee} />
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.email}>
        <span className="type-body-small text-muted-foreground truncate">
          {invitee.email ?? "—"}
        </span>
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.phone}>
        <span className="type-body-small text-muted-foreground truncate">
          {invitee.phone ?? "—"}
        </span>
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.seats}>
        <span className="type-body-small">{invitee.seats}</span>
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.status}>
        <InviteeStatusChip invitee={invitee} />
      </TableCell>
      <TableCell className={inviteesTableColumnClasses.actions}>
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            aria-label={t("invitees__row__send")}
            title={
              !invitee.email ? t("invitees__row__send_disabled") : undefined
            }
          >
            <MailIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            disabled={isBusy}
            aria-label={t("invitees__row__copy_link")}
          >
            <LinkIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setEditing(true)}
            disabled={isBusy}
            aria-label={t("invitees__row__edit")}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDeleteOpen(true)}
            disabled={isBusy}
            aria-label={t("invitees__row__delete")}
            className="text-destructive hover:text-destructive"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
        <ConfirmDialog
          open={deleteOpen}
          title={t("invitees__row__delete_dialog__title")}
          description={t("invitees__row__delete_dialog__description", {
            name: invitee.firstName,
          })}
          cancelLabel={t("invitees__row__delete_dialog__cancel")}
          confirmLabel={t("invitees__row__delete_dialog__confirm")}
          confirmTone="destructive"
          isPending={remove.isPending}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      </TableCell>
    </TableRow>
  );
};
