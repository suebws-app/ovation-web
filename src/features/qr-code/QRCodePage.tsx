import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { getCurrentUser } from "@/lib/auth/session";
import { requireFilledCoupleEvent } from "@/lib/auth/require-filled-event";
import { getTranslations } from "next-intl/server";
import { QRCodeHeader } from "./components/QRCodeHeader";
import { QRCodeStudio } from "./components/QRCodeStudio";
import { QRStatsCard } from "./components/QRStatsCard";
import { QRCodeEmpty } from "./components/QRCodeEmpty";
import { coupleNameOf } from "@/lib/utils/eventFormatters";
import { containerClassName } from "@/lib/utils/layoutClassNames";

export const QRCodePage = async () => {
  const t = await getTranslations();
  const user = await getCurrentUser();
  const event = await requireFilledCoupleEvent();
  if (!event)
    return (
      <div className={containerClassName}>
        <QRCodeEmpty />
      </div>
    );

  const [qr, stats] = await Promise.all([
    eventsApi.qrCode(event.id, { format: "svg", size: 512 }).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
    eventsApi.stats(event.id).catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    }),
  ]);

  const isPro = user?.accountType === "pro";

  return (
    <div className={containerClassName}>
      <QRCodeHeader />
      {!isPro && (
        <div className="rounded-16 border-border bg-card flex flex-col gap-1 border p-5">
          <p className="type-body-small font-semibold">
            {t("qr_code__link_settings_card__title")}
          </p>
          <p className="type-caption text-muted-foreground">
            {t("qr_code__link_settings_card__desc")}
          </p>
          <Link
            href={appRoutes.app.link}
            className="text-primary type-body-small mt-1 font-semibold hover:underline"
          >
            {t("qr_code__link_settings_card__cta")}
          </Link>
        </div>
      )}
      <QRCodeStudio
        coupleName={coupleNameOf(event.partnerAName, event.partnerBName)}
        slug={event.slug}
        shortUrl={qr?.shortUrl ?? `/g/${event.slug}`}
      />
      <QRStatsCard
        totalMessages={stats?.totalMessages ?? 0}
        photoCount={stats?.photoCount ?? 0}
        videoCount={stats?.videoCount ?? 0}
        audioMessages={stats?.audioMessages ?? 0}
      />
    </div>
  );
};
