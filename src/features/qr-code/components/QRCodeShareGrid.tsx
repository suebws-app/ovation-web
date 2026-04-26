import { DownloadCard } from "./DownloadCard";
import { ShareCard } from "./ShareCard";

type QRCodeShareGridProps = {
  eventId: string;
  slug: string;
};

export const QRCodeShareGrid = ({ eventId, slug }: QRCodeShareGridProps) => (
  <div className="tablet:grid-cols-2 grid gap-4">
    <DownloadCard eventId={eventId} slug={slug} />
    <ShareCard url={slug} />
  </div>
);
