"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@ovation/ui/components/Card";
import type { PublicEvent } from "@/lib/api/types";
import { eventHostNames, getEventTypeConfig } from "@/lib/event-types";

type WelcomeQuoteProps = {
  event: PublicEvent;
};

export const WelcomeQuote = ({ event }: WelcomeQuoteProps) => {
  const t = useTranslations();
  const type = getEventTypeConfig(event.eventType).type;
  const message =
    event.welcomeMessage?.trim() || t(`guest__welcome_default__${type}`);
  if (!message) return null;

  const initials = eventHostNames(event)
    .map((name) => name.charAt(0))
    .join(" & ");
  return (
    <Card className="relative">
      <CardContent>
        <span className="text-accent type-h0 absolute -top-2.5 left-4 leading-none italic">
          &ldquo;
        </span>
        <p className="text-foreground type-body pl-3.5 font-serif leading-relaxed italic">
          {message}
        </p>
        <p className="text-muted-foreground type-caption mt-2.5 text-right font-serif italic">
          — {initials}
        </p>
      </CardContent>
    </Card>
  );
};
