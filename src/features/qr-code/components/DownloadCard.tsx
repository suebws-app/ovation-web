"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { eventsClient } from "@/lib/api/events-client";
import type { QrCodeFormat } from "@/lib/api/types";
import { FormatRow } from "./FormatRow";

type DownloadCardProps = {
  eventId: string;
  slug: string;
};

const triggerDownload = (data: string, filename: string) => {
  const link = document.createElement("a");
  link.href = data;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const DownloadCard = ({ eventId, slug }: DownloadCardProps) => {
  const t = useTranslations();
  const [pending, setPending] = useState<QrCodeFormat | null>(null);

  const handleDownload = async (format: QrCodeFormat) => {
    setPending(format);
    try {
      const result = await eventsClient.qrCode(eventId, format);
      if (format === "svg") {
        const blob = new Blob([result.qrData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `${slug}-qr.svg`);
        URL.revokeObjectURL(url);
      } else {
        triggerDownload(result.qrData, `${slug}-qr.png`);
      }
    } finally {
      setPending(null);
    }
  };

  const formats = [
    {
      ext: "PNG" as const,
      desc: t("qr_code__download__png_desc"),
      size: "142 KB",
      onClick: () => handleDownload("png"),
      enabled: true,
    },
    {
      ext: "SVG" as const,
      desc: t("qr_code__download__svg_desc"),
      size: "8 KB",
      onClick: () => handleDownload("svg"),
      enabled: true,
    },
    {
      ext: "PDF" as const,
      desc: t("qr_code__download__pdf_desc"),
      size: "38 KB",
      enabled: false,
    },
    {
      ext: "EPS" as const,
      desc: t("qr_code__download__eps_desc"),
      size: "14 KB",
      enabled: false,
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Eyebrow className="text-muted-foreground mb-3">
        {t("qr_code__download__eyebrow")}
      </Eyebrow>
      <div className="flex flex-col gap-2">
        {formats.map((f, i) => (
          <FormatRow
            key={f.ext}
            ext={f.ext}
            desc={f.desc}
            size={f.size}
            primary={i === 0}
            onClick={f.onClick}
            disabled={!f.enabled || pending !== null}
          />
        ))}
      </div>
    </div>
  );
};
