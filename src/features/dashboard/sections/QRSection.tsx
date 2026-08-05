import { ApiError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { QRcodeWidget } from "../components/widgets/QRcodeWidget";

type QRSectionProps = {
  eventId: string;
  fallbackSlug: string;
};

export const QRSection = async ({ eventId, fallbackSlug }: QRSectionProps) => {
  const qr = await eventsApi
    .qrCode(eventId, { format: "svg", size: 512 })
    .catch((error) => {
      if (ApiError.isApiError(error) && error.status === 404) return null;
      throw error;
    });

  return <QRcodeWidget shortUrl={qr?.shortUrl ?? `/g/${fallbackSlug}`} />;
};
