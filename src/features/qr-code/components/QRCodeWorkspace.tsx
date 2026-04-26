import { QRStage } from "./QRStage";
import { StylePicker } from "./StylePicker";
import { UrlCard } from "./UrlCard";

type QRCodeWorkspaceProps = {
  coupleName: string;
  slug: string;
  shortUrl: string;
};

export const QRCodeWorkspace = ({
  coupleName,
  slug,
  shortUrl,
}: QRCodeWorkspaceProps) => (
  <div className="desktop:grid-cols-[1fr_420px] grid gap-4">
    <QRStage coupleName={coupleName} shortUrl={shortUrl} />
    <div className="flex flex-col gap-4">
      <UrlCard slug={slug} shortUrl={shortUrl} />
      <StylePicker />
    </div>
  </div>
);
