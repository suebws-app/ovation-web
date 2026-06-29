"use client";

import type { FormEventHandler } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import {
  INVITATION_STEP_LABEL_KEYS,
  INVITATION_STEP_TITLES,
  type InvitationStepId,
} from "../constants";
import { DesignStep } from "../steps/DesignStep";
import { DetailsStep } from "../steps/DetailsStep";
import { GuestsStep } from "../steps/GuestsStep";
import type { SaveStatus } from "../useSaveInvitationStep";

type InvitationFormPanelProps = {
  step: InvitationStepId;
  stepIdx: number;
  saveStatus: SaveStatus;
  eventId: string | null;
  selectedGuestIndex: number | null;
  onSelectGuest: (index: number | null) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const InvitationFormPanel = ({
  step,
  stepIdx,
  saveStatus,
  eventId,
  selectedGuestIndex,
  onSelectGuest,
  onSubmit,
}: InvitationFormPanelProps) => {
  const t = useTranslations();
  const titles = INVITATION_STEP_TITLES[step];

  return (
    <form
      className="tablet:px-8 tablet:pt-10 tablet:pb-10 desktop:min-w-0 desktop:px-2 flex flex-1 items-start justify-center px-5 pt-5 pb-24"
      onSubmit={onSubmit}
    >
      <div className="mx-auto w-full max-w-160">
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: stepIdx + 1,
            label: t(INVITATION_STEP_LABEL_KEYS[step]),
          })}
        </Kicker>
        <h1 className="type-h2 tablet:type-h1 leading-tight font-semibold tracking-tight">
          {t(titles.a)}{" "}
          <span className="text-primary italic">{t(titles.b)}</span>
        </h1>
        <p className="type-body-small text-muted-foreground tablet:mt-3 mt-1.5 leading-relaxed">
          {t(titles.sub)}
        </p>

        {step === "design" && <DesignStep />}
        {step === "details" && <DetailsStep />}
        {step === "guests" && (
          <GuestsStep
            selectedGuestIndex={selectedGuestIndex}
            onSelectGuest={onSelectGuest}
          />
        )}

        {saveStatus === "error" && (
          <p className="type-caption text-destructive mt-4 text-center">
            {t("invitation__save_error")}
          </p>
        )}
        {!eventId && (
          <p className="type-caption text-muted-foreground mt-4 text-center">
            {t("invitation__no_event")}
          </p>
        )}
      </div>
    </form>
  );
};
