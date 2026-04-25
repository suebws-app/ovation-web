import { QRStage } from "./QRStage";
import { StylePicker } from "./StylePicker";
import { UrlCard } from "./UrlCard";

export const QRCodeWorkspace = () => (
  <div className="desktop:grid-cols-[1fr_420px] grid gap-4">
    <QRStage />
    <div className="flex flex-col gap-4">
      <UrlCard />
      <StylePicker />
    </div>
  </div>
);
