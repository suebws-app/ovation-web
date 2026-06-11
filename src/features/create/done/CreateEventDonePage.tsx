"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { compressImage } from "@/lib/media/compressImage";
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
  const router = useRouter();
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });
  const [state, setState] = useState<DoneState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);
  const startedForTokenRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedForTokenRef.current === retryToken) return;
    startedForTokenRef.current = retryToken;

    const { formData, mode, eventId, reset } = useCreateEventStore.getState();

    const isEmpty =
      !formData.partner1Name.trim() &&
      !formData.partner2Name.trim() &&
      !formData.weddingDate &&
      !formData.venueName?.trim() &&
      !formData.venueCity?.trim() &&
      !formData.bookUrl?.trim() &&
      !formData.coverFile;

    if (isEmpty && mode === "create") {
      reset();
      router.push(appRoutes.app.root);
      return;
    }

    (async () => {
      try {
        const tr = tRef.current;
        const partnerAName =
          formData.partner1Name.trim() || tr("signup__partner_a_default");
        const partnerBName =
          formData.partner2Name.trim() || tr("signup__partner_b_default");
        const weddingDate = toIsoDate(formData.weddingDate);
        const venueName = formData.venueName?.trim() || undefined;
        const venueCity = formData.venueCity?.trim() || undefined;

        let targetEventId: string;
        if (mode === "edit" && eventId) {
          const { event } = await eventsClient.update(eventId, {
            partnerAName,
            partnerBName,
            weddingDate,
            venueName,
            venueCity,
          });
          targetEventId = event.id;
        } else {
          const created = await eventsClient.create({
            partnerAName,
            partnerBName,
            weddingDate,
            venueName,
            venueCity,
          });
          targetEventId = created.event.id;
        }

        await profileClient.markOnboardingComplete().catch(() => undefined);

        const desiredSlug = formData.bookUrl?.trim();
        if (desiredSlug && /^[a-z0-9-]{4,20}$/.test(desiredSlug)) {
          try {
            await eventsClient.update(targetEventId, { slug: desiredSlug });
          } catch {
            // Slug clash — keep existing
          }
        }

        if (formData.coverFile) {
          try {
            if (ALLOWED_COVER_MIMES[formData.coverFile.type]) {
              const compressed = await compressImage(formData.coverFile);
              const contentType =
                ALLOWED_COVER_MIMES[compressed.type] ?? "image/jpeg";
              const result = await eventsClient.coverUploadUrl(
                targetEventId,
                contentType,
              );
              await uploadToTarget(
                { url: result.uploadUrl, key: result.key },
                compressed,
              );
              await eventsClient
                .update(targetEventId, { couplePhotoUrl: result.publicUrl })
                .catch(() => undefined);
            }
          } catch {
            // Non-fatal
          }
        }

        document.cookie = `${LAST_EVENT_COOKIE}=${targetEventId}; path=/; max-age=${LAST_EVENT_COOKIE_MAX_AGE}; samesite=lax`;
        reset();
        router.push(appRoutes.app.eventMessages(targetEventId));
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
  }, [retryToken, router]);

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
