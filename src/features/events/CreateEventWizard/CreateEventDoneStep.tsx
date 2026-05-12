"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { eventsClient } from "@/lib/api/events-client";
import { ApiError } from "@/lib/api/client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import type { CoverPhotoContentType } from "@/lib/api/types";
import { useCreateEventStore } from "@/features/events/useCreateEventStore";
import { useRouter } from "@/i18n/navigation";
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

type DoneState =
  | { kind: "creating" }
  | { kind: "error"; message: string };

export const CreateEventDoneStep = () => {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<DoneState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);
  const startedForTokenRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedForTokenRef.current === retryToken) return;
    startedForTokenRef.current = retryToken;

    let cancelled = false;
    const { formData, reset } = useCreateEventStore.getState();

    (async () => {
      try {
        const created = await eventsClient.create({
          partnerAName: formData.partner1Name.trim() || t("signup__partner_a_default"),
          partnerBName: formData.partner2Name.trim() || t("signup__partner_b_default"),
          weddingDate: toIsoDate(formData.weddingDate),
          venueName: formData.venue?.trim() || undefined,
        });
        if (cancelled) return;

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

        if (cancelled) return;

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
          if (cancelled) return;
        }

        reset();
        router.push(appRoutes.app.eventMessages(created.event.id));
      } catch (error) {
        if (cancelled) return;
        startedForTokenRef.current = null;
        setState({
          kind: "error",
          message: ApiError.isApiError(error)
            ? error.message
            : t("signup__completion__error_create_default"),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [retryToken, router, t]);

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
