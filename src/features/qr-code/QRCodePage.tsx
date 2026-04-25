import { OrderCtaStrip } from "./components/OrderCtaStrip";
import { QRCodeDesktopFooter } from "./components/QRCodeDesktopFooter";
import { QRCodeHeader } from "./components/QRCodeHeader";
import { QRCodeMobileBar } from "./components/QRCodeMobileBar";
import { QRCodeShareGrid } from "./components/QRCodeShareGrid";
import { QRCodeWorkspace } from "./components/QRCodeWorkspace";
import { QRStatsCard } from "./components/QRStatsCard";

export const QRCodePage = () => (
  <div className="mx-auto min-w-0">
    <QRCodeHeader />
    <div className="mt-6">
      <QRCodeWorkspace />
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
