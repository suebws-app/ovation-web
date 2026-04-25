import { DownloadCard } from "./DownloadCard";
import { ShareCard } from "./ShareCard";

export const QRCodeShareGrid = () => (
  <div className="tablet:grid-cols-2 grid gap-4">
    <DownloadCard />
    <ShareCard />
  </div>
);
