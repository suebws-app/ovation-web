"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Label } from "@ovation/ui/components/Label";
import { toast } from "@/components/Toaster";
import { publicClient } from "@/lib/api/public-client";
import { resolveFontStack } from "@/features/invitation/invitationTemplates";
import { readableTextColor } from "@/lib/utils/color";
import type {
  InvitationTemplate,
  PublicInvitation,
  RsvpStatus,
} from "@/lib/api/types";

type RsvpActionsProps = {
  slug: string;
  token: string;
  invitee: PublicInvitation["invitee"];
  template: InvitationTemplate;
  pageBg?: string;
  textColor?: string;
  mutedColor?: string;
  accentColor?: string;
};

const clampSeats = (value: number, max: number) => {
  if (Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(max, Math.floor(value)));
};

export const RsvpActions = ({
  slug,
  token,
  invitee,
  template,
  pageBg,
  textColor,
  mutedColor,
  accentColor,
}: RsvpActionsProps) => {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<RsvpStatus>(invitee.rsvpStatus);
  const [choice, setChoice] = useState<"accepted" | "declined">(
    invitee.rsvpStatus === "declined" ? "declined" : "accepted",
  );
  const [seats, setSeats] = useState(invitee.rsvpSeats ?? invitee.seats);
  const [note, setNote] = useState(invitee.rsvpNote ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      publicClient.rsvp(slug, {
        token,
        status: choice,
        seats: choice === "accepted" ? seats : undefined,
        note: note.trim() || null,
      }),
    onSuccess: (result) => {
      setStatus(result.status);
      if (result.seats !== null) setSeats(result.seats);
      setNote(result.note ?? "");
      setOpen(false);
      toast.success(t("guest__rsvp__success"));
    },
    onError: () => {
      toast.error(t("guest__rsvp__error"));
    },
  });

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !mutation.isPending) setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, mutation.isPending]);

  const maxSeats = Math.max(1, invitee.seats);
  const bodyFont = resolveFontStack(template.bodyFontKey);

  const accent = accentColor?.trim() ? accentColor : template.accentColor;
  const accentIsCustom =
    accent.trim().toLowerCase() !== template.accentColor.trim().toLowerCase();
  const onAccent = accentIsCustom
    ? readableTextColor(accent)
    : template.buttonText;
  const ink = textColor?.trim() ? textColor : template.textColor;
  const muted = mutedColor?.trim() ? mutedColor : template.mutedColor;
  const surface = pageBg?.trim() ? pageBg : template.pageBg;

  const toggleStyle = (active: boolean) =>
    active
      ? { background: accent, color: onAccent, borderColor: accent }
      : { background: "transparent", color: ink, borderColor: accent };

  const triggerLabel =
    status === "accepted"
      ? t("guest__rsvp__confirmed", { count: invitee.rsvpSeats ?? seats })
      : status === "declined"
        ? t("guest__rsvp__declined_state")
        : t("guest__rsvp__cta");

  return (
    <>
      <div
        style={{
          background: surface,
          borderTop:
            template.cardBorder !== "none" ? template.cardBorder : undefined,
          color: ink,
          fontFamily: bodyFont,
        }}
        className="flex w-full flex-col items-center gap-3 px-6 pt-2 pb-6 text-center"
      >
        <div
          className="h-px w-16"
          style={{ background: accent, opacity: 0.5 }}
          aria-hidden
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            background: accent,
            color: onAccent,
            borderColor: accent,
            fontFamily: bodyFont,
          }}
          className="tablet:max-w-md tablet:px-7.5 tablet:py-3.5 tablet:text-base w-full max-w-sm cursor-pointer rounded-full border px-5 py-3 text-sm font-semibold tracking-wide whitespace-nowrap shadow-md transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {triggerLabel}
        </button>
      </div>

      {open ? (
        <div
          className="bg-foreground/60 fixed inset-0 z-70 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-dialog-title"
          onClick={() => {
            if (!mutation.isPending) setOpen(false);
          }}
        >
          <div
            style={{
              background: surface,
              color: ink,
              border: `1px solid ${accent}`,
              fontFamily: bodyFont,
            }}
            className="rounded-20 flex w-full max-w-sm flex-col gap-4 p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="rsvp-dialog-title"
              className="type-h3 text-left font-semibold tracking-tight"
            >
              {t("guest__rsvp__title")}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                style={toggleStyle(choice === "accepted")}
                onClick={() => setChoice("accepted")}
                className="cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              >
                {t("guest__rsvp__accept")}
              </button>
              <button
                type="button"
                style={toggleStyle(choice === "declined")}
                onClick={() => setChoice("declined")}
                className="cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              >
                {t("guest__rsvp__decline")}
              </button>
            </div>

            {choice === "accepted" && maxSeats > 1 ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="rsvp-seats" style={{ color: muted }}>
                  {t("guest__rsvp__seats_label")}
                </Label>
                <div
                  style={{ borderColor: accent }}
                  className="rounded-8 flex h-10 items-center gap-1 border px-1"
                >
                  <button
                    type="button"
                    aria-label={t("guest__rsvp__seats_label")}
                    onClick={() => setSeats((s) => clampSeats(s - 1, maxSeats))}
                    disabled={seats <= 1}
                    style={{ color: ink }}
                    className="size-7 cursor-pointer rounded-full text-lg transition hover:opacity-70 disabled:opacity-30"
                  >
                    −
                  </button>
                  <input
                    id="rsvp-seats"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={maxSeats}
                    value={seats}
                    onChange={(e) =>
                      setSeats(clampSeats(Number(e.target.value), maxSeats))
                    }
                    style={{ color: ink }}
                    className="min-w-0 flex-1 [appearance:textfield] bg-transparent text-center text-sm font-medium tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    aria-label={t("guest__rsvp__seats_label")}
                    onClick={() => setSeats((s) => clampSeats(s + 1, maxSeats))}
                    disabled={seats >= maxSeats}
                    style={{ color: ink }}
                    className="size-7 cursor-pointer rounded-full text-lg transition hover:opacity-70 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="rsvp-note" style={{ color: muted }}>
                {t("guest__rsvp__note_label")}
              </Label>
              <textarea
                id="rsvp-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={t("guest__rsvp__note_placeholder")}
                style={{ borderColor: accent, color: ink }}
                className="rounded-8 w-full resize-none border bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
            </div>

            <div className="mt-2 flex w-full gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
                style={{ borderColor: accent, color: ink }}
                className="flex-1 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:opacity-80 disabled:opacity-50"
              >
                {t("guest__rsvp__cancel")}
              </button>
              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                style={{
                  background: accent,
                  color: onAccent,
                  borderColor: accent,
                }}
                className="flex-1 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
              >
                {t("guest__rsvp__submit")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
