import { useCallback, useEffect, useRef, useState } from "react";
import { linkSettingsClient } from "@/lib/api/link-settings-client";
import type { LinkSettings, UpdateLinkSettingsInput } from "@/lib/api/types";

const DEBOUNCE_MS = 400;

type UseLinkSettingsResult = {
  settings: LinkSettings;
  patch: (changes: UpdateLinkSettingsInput) => void;
  isSaving: boolean;
  error: Error | null;
};

export const useLinkSettings = (
  eventId: string,
  initial: LinkSettings,
): UseLinkSettingsResult => {
  const [settings, setSettings] = useState<LinkSettings>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pendingRef = useRef<UpdateLinkSettingsInput>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const payload = pendingRef.current;
    if (!Object.keys(payload).length) return;
    pendingRef.current = {};
    setIsSaving(true);
    setError(null);
    try {
      const res = await linkSettingsClient.update(eventId, payload);
      setSettings(res.settings);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to save"));
    } finally {
      setIsSaving(false);
    }
  }, [eventId]);

  const patch = useCallback(
    (changes: UpdateLinkSettingsInput) => {
      setSettings((prev) => ({ ...prev, ...changes }));
      pendingRef.current = { ...pendingRef.current, ...changes };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        flush();
      }, DEBOUNCE_MS);
    },
    [flush],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { settings, patch, isSaving, error };
};
