"use client";

import { useTranslations } from "next-intl";
import { Check } from "@ovation/icons/Check";
import { Mic } from "@ovation/icons/Mic";
import { Hourglass } from "@ovation/icons/Hourglass";
import { PillBase } from "./PillBase";

type GuestStatusPillProps = {
  contributed: boolean;
  thanked: boolean;
  wasNudged?: boolean;
};

export const GuestStatusPill = ({
  contributed,
  thanked,
  wasNudged,
}: GuestStatusPillProps) => {
  const t = useTranslations();
  if (contributed && thanked) {
    return (
      <PillBase className="bg-secondary/20 text-secondary-foreground">
        <Check width={11} height={11} />
        {t("guests__pill__contributed_thanked")}
      </PillBase>
    );
  }

  if (contributed) {
    return (
      <PillBase className="bg-primary/15 text-primary">
        <Mic width={11} height={11} />
        {t("guests__pill__contributed")}
      </PillBase>
    );
  }

  if (wasNudged) {
    return (
      <PillBase className="bg-accent/25 text-accent-foreground">
        <Hourglass width={11} height={11} />
        {t("guests__pill__nudged")}
      </PillBase>
    );
  }

  return (
    <PillBase className="bg-muted text-muted-foreground">
      <Hourglass width={11} height={11} />
      {t("guests__pill__awaiting")}
    </PillBase>
  );
};
