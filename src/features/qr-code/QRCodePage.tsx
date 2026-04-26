import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { OrderCtaStrip } from "./components/OrderCtaStrip";
import { QRCodeDesktopFooter } from "./components/QRCodeDesktopFooter";
import { QRCodeHeader } from "./components/QRCodeHeader";
import { QRCodeMobileBar } from "./components/QRCodeMobileBar";
import { QRCodeShareGrid } from "./components/QRCodeShareGrid";
import { QRCodeWorkspace } from "./components/QRCodeWorkspace";
import { QRStatsCard } from "./components/QRStatsCard";
import { QRCodeEmpty } from "./components/QRCodeEmpty";

const coupleNameOf = (partnerA: string, partnerB: string) =>
  [partnerA, partnerB].filter(Boolean).join(" & ");

export const QRCodePage = async () => {
  const events = await eventsApi.list({ limit: 1 });
  const event = events.items[0];
  if (!event) return <QRCodeEmpty />;

  const qr = await eventsApi
    .qrCode(event.id, { format: "svg", size: 512 })
    .catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    });

  return (
    <div className="mx-auto min-w-0">
      <QRCodeHeader />
      <div className="mt-6">
        <QRCodeWorkspace
          coupleName={coupleNameOf(event.partnerAName, event.partnerBName)}
          slug={event.slug}
          shortUrl={qr?.shortUrl ?? `/g/${event.slug}`}
        />
      </div>
      <div className="mt-4">
        <QRCodeShareGrid />
      </div>
      <div className="mt-4">
        <QRStatsCard />
      </div>
      <div className="mt-4">
        <OrderCtaStrip />
      </div>
      <QRCodeDesktopFooter />
      <QRCodeMobileBar />
    </div>
  );
};
