"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { QRStage } from "./QRStage";
import { StylePicker } from "./StylePicker";
import { UrlCard } from "./UrlCard";
import { ShareCard } from "./ShareCard";

const DownloadCardSkeleton = () => (
  <div className="rounded-16 border-border bg-card h-64 animate-pulse border p-4.5" />
);

const DownloadCard = dynamic(
  () => import("./DownloadCard").then((m) => ({ default: m.DownloadCard })),
  { ssr: false, loading: DownloadCardSkeleton },
);

export type QRStyle = {
  id: string;
  dark: string;
  light: string;
};

const DEFAULT_STYLE: QRStyle = {
  id: "classic",
  dark: "#2D2D2D",
  light: "#ffffff",
};

type QRCodeStudioProps = {
  coupleName: string;
  slug: string;
  shortUrl: string;
};

export const QRCodeStudio = ({
  coupleName,
  slug,
  shortUrl,
}: QRCodeStudioProps) => {
  const [style, setStyle] = useState<QRStyle>(DEFAULT_STYLE);

  return (
    <div className="flex flex-col gap-4">
      <div className="desktop:grid-cols-[1fr_420px] grid gap-4">
        <QRStage
          coupleName={coupleName}
          shortUrl={shortUrl}
          dark={style.dark}
          light={style.light}
        />
        <div className="flex flex-col gap-4">
          <UrlCard slug={slug} shortUrl={shortUrl} />
          <StylePicker selectedId={style.id} onSelectStyle={setStyle} />
        </div>
      </div>
      <div className="tablet:grid-cols-2 grid gap-4">
        <DownloadCard
          slug={slug}
          shortUrl={shortUrl}
          dark={style.dark}
          light={style.light}
        />
        <ShareCard url={slug} />
      </div>
    </div>
  );
};
