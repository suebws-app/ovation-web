import { DownloadCard } from "./DownloadCard";
import { ShareCard } from "./ShareCard";

export const QRCodeShareGrid = () => (
  <div className="grid gap-4 tablet:grid-cols-2">
    <DownloadCard />
    <ShareCard />
  </div>
);
