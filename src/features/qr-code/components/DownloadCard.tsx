"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Kicker } from "@ovation/ui/components/Kicker";
import { saveDataUrl } from "@/lib/utils/download-blob";
import { buildLogoSrc } from "../utils";
import { FormatRow } from "./FormatRow";

type DownloadCardProps = {
  slug: string;
  shortUrl: string;
  dark: string;
  light: string;
};

const QR_EXPORT_SIZE = 1024;

export const DownloadCard = ({
  slug,
  shortUrl,
  dark,
  light,
}: DownloadCardProps) => {
  const t = useTranslations();
  const [pending, setPending] = useState<"png" | "svg" | "pdf" | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const logoSrc = buildLogoSrc(dark, light);

  const handlePng = () => {
    setPending("png");
    try {
      const canvas =
        canvasContainerRef.current?.querySelector("canvas") ?? null;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      saveDataUrl(dataUrl, `${slug}-qr.png`);
    } finally {
      setPending(null);
    }
  };

  const handleSvg = () => {
    setPending("svg");
    try {
      const svg = svgContainerRef.current?.querySelector("svg") ?? null;
      if (!svg) return;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob(
        ['<?xml version="1.0" standalone="no"?>\r\n', source],
        { type: "image/svg+xml;charset=utf-8" },
      );
      const url = URL.createObjectURL(blob);
      saveDataUrl(url, `${slug}-qr.svg`);
      URL.revokeObjectURL(url);
    } finally {
      setPending(null);
    }
  };

  const handlePdf = async () => {
    setPending("pdf");
    try {
      const canvas =
        canvasContainerRef.current?.querySelector("canvas") ?? null;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const qrSize = 140;
      const x = (pageWidth - qrSize) / 2;
      const y = (pageHeight - qrSize) / 2 - 15;
      pdf.addImage(dataUrl, "PNG", x, y, qrSize, qrSize);
      pdf.setFontSize(13);
      const safeUrl = shortUrl.replace(/[^\x20-\x7E]/g, "");
      pdf.text(safeUrl, pageWidth / 2, y + qrSize + 14, { align: "center" });
      pdf.save(`${slug}-qr.pdf`);
    } finally {
      setPending(null);
    }
  };

  const formats = [
    {
      ext: "PNG" as const,
      desc: t("qr_code__download__png_desc"),
      size: "1024×1024",
      onClick: handlePng,
      enabled: true,
    },
    {
      ext: "SVG" as const,
      desc: t("qr_code__download__svg_desc"),
      size: "vector",
      onClick: handleSvg,
      enabled: true,
    },
    {
      ext: "PDF" as const,
      desc: t("qr_code__download__pdf_desc"),
      size: "A4",
      onClick: handlePdf,
      enabled: true,
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Kicker className="text-muted-foreground mb-3">
        {t("qr_code__download__eyebrow")}
      </Kicker>
      <div className="flex flex-col gap-2">
        {formats.map((f) => (
          <FormatRow
            key={f.ext}
            ext={f.ext}
            desc={f.desc}
            size={f.size}
            onClick={f.onClick}
            disabled={!f.enabled || pending !== null}
          />
        ))}
      </div>
      <div className="absolute top-0 -left-2499.75" aria-hidden="true">
        <div ref={canvasContainerRef}>
          <QRCodeCanvas
            value={shortUrl}
            size={QR_EXPORT_SIZE}
            level="H"
            marginSize={2}
            fgColor={dark}
            bgColor={light}
            imageSettings={{
              src: logoSrc,
              height: QR_EXPORT_SIZE / 5,
              width: QR_EXPORT_SIZE / 5,
              excavate: true,
            }}
          />
        </div>
        <div ref={svgContainerRef}>
          <QRCodeSVG
            value={shortUrl}
            size={QR_EXPORT_SIZE}
            level="H"
            marginSize={2}
            fgColor={dark}
            bgColor={light}
            imageSettings={{
              src: logoSrc,
              height: QR_EXPORT_SIZE / 5,
              width: QR_EXPORT_SIZE / 5,
              excavate: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};
