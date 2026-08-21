"use client";

import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { EventThemePreview } from "@/lib/theme/EventThemePreview";

/**
 * Recolors the whole signup flow (create steps, sign-up form, plans, checkout)
 * with the theme color the host picked on the cover step. Reads the color from
 * the persisted create store and emits the live theme CSS globally, so `--primary`
 * follows the pick across every step. Falls back to blush until a color is chosen.
 */
export const SignupThemeScope = () => {
  const hydrated = useHydrateStore(useCreateEventStore);
  const themeColor = useCreateEventStore((s) => s.formData.themeColor);
  const eventType = useCreateEventStore((s) => s.formData.eventType);

  if (!hydrated) return null;

  return <EventThemePreview themeColor={themeColor} eventType={eventType} />;
};
