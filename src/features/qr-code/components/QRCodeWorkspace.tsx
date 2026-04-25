import { QRStage } from "./QRStage";
import { StylePicker } from "./StylePicker";
import { UrlCard } from "./UrlCard";

export const QRCodeWorkspace = () => (
  <div className="grid gap-4 desktop:grid-cols-[1fr_420px]">
    <QRStage />
    <div className="flex flex-col gap-4">
      <UrlCard />
      <StylePicker />
    </div>
  </div>
);
