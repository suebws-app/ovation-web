"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import type { CoverPhotoContentType } from "@/lib/api/types";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { appRoutes } from "@/lib/routes";

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const ALLOWED_COVER_MIMES: Record<string, CoverPhotoContentType> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
};

const LAST_EVENT_COOKIE = "ovation_last_event_id";
const LAST_EVENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type DoneState = { kind: "creating" } | { kind: "error"; message: string };

export const CreateEventDonePage = () => {
  const t = useTranslations();
  const tRef = useRef(t);
  tRef.current = t;
  const [state, setState] = useState<DoneState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);
  const startedForTokenRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedForTokenRef.current === retryToken) return;
    startedForTokenRef.current = retryToken;

    const { formData, reset } = useCreateEventStore.getState();

    if (
      !formData.partner1Name.trim() &&
      !formData.partner2Name.trim() &&
      !formData.weddingDate &&
      !formData.venue?.trim() &&
      !formData.bookUrl?.trim() &&
      !formData.coverFile
    ) {
      reset();
      window.location.assign(appRoutes.app.root);
      return;
    }

    (async () => {
      try {
        const tr = tRef.current;
        const created = await eventsClient.create({
          partnerAName:
            formData.partner1Name.trim() || tr("signup__partner_a_default"),
          partnerBName:
            formData.partner2Name.trim() || tr("signup__partner_b_default"),
          weddingDate: toIsoDate(formData.weddingDate),
          venueName: formData.venue?.trim() || undefined,
        });

        const desiredSlug = formData.bookUrl?.trim();
        if (
          desiredSlug &&
          desiredSlug !== created.event.slug &&
          /^[a-z0-9-]{4,20}$/.test(desiredSlug)
        ) {
          try {
            await eventsClient.update(created.event.id, { slug: desiredSlug });
          } catch {
            // Slug clash — keep auto-generated
          }
        }

        if (formData.coverFile) {
          try {
            const contentType = ALLOWED_COVER_MIMES[formData.coverFile.type];
            if (contentType) {
              const result = await eventsClient.coverUploadUrl(
                created.event.id,
                contentType,
              );
              await uploadToTarget(
                { url: result.uploadUrl, key: result.key },
                formData.coverFile,
              );
              await eventsClient
                .update(created.event.id, { couplePhotoUrl: result.publicUrl })
                .catch(() => undefined);
            }
          } catch {
            // Non-fatal
          }
        }

        document.cookie = `${LAST_EVENT_COOKIE}=${created.event.id}; path=/; max-age=${LAST_EVENT_COOKIE_MAX_AGE}; samesite=lax`;
        reset();
        window.location.assign(appRoutes.app.eventMessages(created.event.id));
      } catch (error) {
        startedForTokenRef.current = null;
        setState({
          kind: "error",
          message: ApiError.isApiError(error)
            ? error.message
            : tRef.current("signup__completion__error_create_default"),
        });
      }
    })();
  }, [retryToken]);

  if (state.kind === "error") {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <p className="type-body-small text-destructive">{state.message}</p>
          <Button
            onClick={() => {
              setState({ kind: "creating" });
              setRetryToken((n) => n + 1);
            }}
            size="lg"
            className="mt-6"
          >
            {t("common__retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <p className="type-body-small text-muted-foreground">
        {t("common__loading")}
      </p>
    </div>
  );
};
