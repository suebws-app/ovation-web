import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";

const fetchEventById = cache(async (id: string): Promise<Event | null> => {
  const result = await eventsApi.get(id).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });
  return result?.event ?? null;
});

export const getEventFromParams = async (
  params: Promise<{ id: string }>,
): Promise<Event> => {
  const { id } = await params;
  const event = await fetchEventById(id);
  if (!event) notFound();
  return event;
};
